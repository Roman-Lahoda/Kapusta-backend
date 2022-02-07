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

export default { findById, findByEmail, create };
