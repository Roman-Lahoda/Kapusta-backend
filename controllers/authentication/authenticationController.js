import { request } from 'https';
import { HttpCode } from '../../lib/constants.js';
import users from '../../repository/users.js';
// import { findByVerifyToken } from '../../repository/users.js'; /**TODO */
import JWT from 'jsonwebtoken';
import EmailService from '../../email/emailService.js';
import SenderNodemailer from '../../email/emailSender.js';
// const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthenticationService {
  async isUserExist(email) {
    const user = await users.findByEmail(email);
    return !!user;
  }

  async create(body) {
    const { id, name, email, balance, verifyTokenEmail } = await users.create(body);
    return { id, name, email, balance, verifyTokenEmail };
  }

  async getUser(email, password) {
    const user = await users.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !user?.isVerify) {
      return null;
    }
    return user;
  }

  getToken(user) {
    const id = user.id;
    const payload = { id };
    const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
    return token;
  }

  async setToken(id, token) {
    await users.updateToken(id, token);
  }

  // async update(body) {
  //   const { email, password } = body;
  //   const user = await users.findByEmail(email);
  //   const isValidPassword = await user?.isValidPassword(password);
  // }
}

const authenticationService = new AuthenticationService();

const registration = async (req, res, _next) => {
  try {
    const { email } = req.body;
    const isUserExist = await authenticationService.isUserExist(email);
    if (isUserExist) {
      return res
        .status(HttpCode.CONFLICT)
        .json({ status: 'error', code: HttpCode.CONFLICT, message: 'Email is already exist' });
    }

    const userData = await authenticationService.create(req.body);

    const emailService = new EmailService(process.env.NODE_ENV, new SenderNodemailer());

    const isSend = await emailService.sendVerifyEmail(
      email,
      userData.name,
      userData.verifyTokenEmail,
    );
    delete userData.verifyTokenEmail;

    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { ...userData, isSendVerify: isSend },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authenticationService.getUser(email, password);
  if (!user) {
    return res
      .status(HttpCode.UNAUTHORIZED)
      .json({ status: 'error', code: HttpCode.UNAUTHORIZED, message: 'Invalid credentials' });
  }
  const { name, balance } = user;
  const token = authenticationService.getToken(user);
  await authenticationService.setToken(user.id, token);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, userData: { token, name, balance, email } });
};

const logout = async (req, res, next) => {
  await authenticationService.setToken(req.user.id, null);
  res.status(HttpCode.NO_CONTENT).json({ status: 'success', code: HttpCode.NO_CONTENT });
};

const update = async (req, res, next) => {
  const updatedUser = await users.update(req.user.id, req.body);
  const email = updatedUser.email;
  const balance = updatedUser.balance;
  const name = updatedUser.name;
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    userData: { name, email, balance },
  });
};

const verifyUser = async (req, res, next) => {
  const verifyToken = req.params.token;
  // const userToken =
};

export { registration, login, logout, update, verifyUser };
