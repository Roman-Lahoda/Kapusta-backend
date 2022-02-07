import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
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
    required: [true, 'Password is required'],
  },
  token: {
    type: String,
    default: null,
  },
  balans: {
    type: Number,
    default: null,
  },
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'user',
  // },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcryptjs.genSalt(6);
    this.password = await bcryptjs.hash(this.password, salt);
  }
  next();
});

const UserModel = model('user', userSchema);

export default UserModel;
// export default mongoose.model('user', userSchema);
