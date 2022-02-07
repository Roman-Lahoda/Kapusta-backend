// import { request } from 'https';
import { HttpCode } from '../../constants/httpCode.js';
import users from '../../repository/users.js';

class AuthenticationService {
  async isUserExist(email) {
    const user = await users.findByEmail(email);
    return !!user;
  }

  async create(body) {
    const { id, name, email, owner } = await users.create(body);
    return { id, name, email, owner };
  }
}

const authenticationService = new AuthenticationService();

const registration = async (req, res, next) => {
  const { email } = req.body;
  const isUserExist = await authenticationService.isUserExist(email);
  if (isUserExist) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'error', code: HttpCode.CONFLICT, message: 'Email is already exist' });
  }
  const userData = await authenticationService.create(req.body);
  res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, userData });
};

const login = (req, res, next) => {};

const logout = (req, res, next) => {};

export { registration, login, logout };
