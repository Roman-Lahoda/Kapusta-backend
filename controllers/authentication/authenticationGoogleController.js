import queryString from 'query-string';
import axios from 'axios';
import UserModel from '../../model/userModel.js';
// import users from '../../repository/users.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
// import { AuthenticationService } from '../authentication/authenticationController.js';

// import URL from 'url';
// import { query } from 'express';
// const authenticationService = new AuthenticationService();

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });
  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  // Логика поиска юзера в нашей базе  по email
  const { name, email } = userData.data;
  const user = await UserModel.findOne({ email });
  if (!user) {
    const hashPasword = bcrypt.hashSync(id, bcrypt.genSaltSync(10));
    const userGoogle = await UserModel.create({
      name: name,
      email: email,
      password: hashPasword,
      token: null,
      balanse: null,
      verify: true,
      verifyToken: null,
    });
    const { _id } = userGoogle;
    const payload = {
      id: _id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    await UserModel.findByIdAndUpdate(_id, { token });
    return res.redirect(`${FRONTEND_URL}?access_token=${token}`);
  }
  const { _id } = user;
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  await UserModel.findByIdAndUpdate(_id, { token });
  return res.redirect(`${FRONTEND_URL}?access_token=${token}`);
};

// по userData.data.email мы може обратиться к email и:
// const { email } = userData.data;
// const userByGoogle = async email => {
//   const user = users.findByEmail({ email });
//   // ...если юзер есть, то даем ему токен и пускаем в базу данных
//   if (!user) {
//     // ...если юзера в базе данных нет, то мы его регистрируем
//     const userData = await authenticationService.create(req.body);
//   }
//   const accessToken = authenticationService.getToken(user);
//   await authenticationService.setToken(user.id, accessToken);
// };

// ...
// ...
// в query параметрах мы указываем токен
// return res.redirect(`${process.env.FRONTEND_URL}?email=${userData.data.email}`);
// console.log('userData.data.email', userData.data.email);
// return res.redirect(
//   `${process.env.FRONTEND_URL}/google-redirect/?accessToken=${accessToken}&refreshToken=${refreshToken}`,
// `${process.env.FRONTEND_URL}?email=${userData.data.email}`,
// );

export default { googleAuth, googleRedirect };
