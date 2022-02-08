import UserModel from '../model/userModel.js';

const findById = async id => {
  return await UserModel.findById(id);
};

const findByEmail = async email => {
  return await UserModel.findOne({ email });
};

const create = async body => {
  const user = new UserModel(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await UserModel.updateOne({ _id: id }, { token });
};

export default { findById, findByEmail, create, updateToken };
