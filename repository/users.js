import { verify } from 'crypto';
import UserModel from '../model/userModel.js';

const findById = async id => {
  return await UserModel.findById(id);
};

const findByEmail = async email => {
  return await UserModel.findOne({ email });
};

const findByVerifyToken = async verifyTokenEmail => {
  return await UserModel.findOne({ verifyTokenEmail });
};

const create = async body => {
  const user = new UserModel(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await UserModel.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id, status) => {
  return await UserModel.updateOne({ _id: id }, { isVerify: status, verifyTokenEmail: null });
};

const update = async (id, body) => {
  const user = await UserModel.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
  return user;
};

export default {
  findById,
  findByEmail,
  create,
  updateToken,
  update,
  findByVerifyToken,
  updateVerifyToken,
};
