import mongoose from 'mongoose';
// import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      // TODO пароль не обязательный
      // required: [true, 'Password is required'],
    },
    token: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    verify: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
  },
  { versionKey: false },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10));
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = model('user', userSchema);

export default UserModel;
