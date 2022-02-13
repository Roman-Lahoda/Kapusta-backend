import axios from 'axios'
import queryString from 'query-string'
// import URL from 'url'

import {loginWithGoogle2} from '../../controllers/authentication/authenticationController.js'


import UserModel from '../../model/userModel.js'
import {AuthenticationService} from '../../controllers/authentication/authenticationController.js'

 const googleAuth2 = async (req, res) => {
  console.log ("Сработала функция googleAuth2")

    const stringifiedParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID_2,
        redirect_uri: `${process.env.BASE_URL}/auth2/google-redirect2`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    })

    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
}



const googleRedirect2 = async (req, res) => {
  console.log ("Сработала функция googleRedirect2")
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);


    if (urlParams.code=== undefined || urlParams.code==='') {
        console.log (" urlParams.code  is undefined or empty line")
    } else {
        const code = urlParams.code;
    }
    
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID_2,
        client_secret: process.env.GOOGLE_CLIENT_SECRET_2,
        redirect_uri: `${process.env.BASE_URL}/auth2/google-redirect2`,
        grant_type: 'authorization_code',
        code: code,  // or code: code,
      },
    });
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorisation: `Bearer ${tokenData.data.access_token}`,
      },
    });

    console.log ( 'userData.data : ', userData.data)

    // userData.data.email
    const email = userData.data.email

      // Проверяем есть ли такой имейл в БД юзеров:
    const findByEmail = async email => {
      return await UserModel.findOne({email});
    };

    const user = findByEmail
    const authenticationService = new AuthenticationService();

    //если юзера по его имейлу нашли, то создаём и возвращаем токен
  if (user!==null) {
    const token = authenticationService.getToken(user);
    await authenticationService.setToken(user.id, token);
  }
  // } else {
  //   //если юзера по его имейлу не нашли, то регистрируем
    
  // const userData = await authenticationService.create(req.body);
  // // res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.CREATED, userData });
  // }

    // loginWithGoogle2

    return res.redirect(
        // `${process.env.FRONTEND_URL}/google-redirect/?accessToken=${accessToken}&refreshToken=${refreshToken}`,
        // `${process.env.FRONTEND_URL}?token=${token}`,
        `${process.env.FRONTEND_URL}?email=${email}`,
      );
    };


export {googleAuth2, googleRedirect2 }