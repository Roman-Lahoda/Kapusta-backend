import axios from 'axios'
import queryString from 'query-string'
// import URL from 'url'
 const googleAuth2 = async (req, res) => {
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
    return res.
    redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`)
}

const googleRedirect2 = async (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID_2,
        client_secret: process.env.GOOGLE_CLIENT_SECRET_2,
        redirect_uri: `${process.env.BASE_URL}/auth2/google-redirect2`,
        grant_type: 'authorization_code',
        code: code,  
      },
    });
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorisation: `Bearer ${tokenData.data.access_token}`,
      },
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}?email=${userData.data.email}`,
      );
    };
export {googleAuth2, googleRedirect2 }