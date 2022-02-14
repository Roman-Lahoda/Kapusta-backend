import Router from 'express';
import {googleAuth2, googleRedirect2} from './auth2.controller.js'

const routerGoogle2 = new Router();

routerGoogle2.get('/google2', googleAuth2);
routerGoogle2.get('/google-redirect2', googleRedirect2);


routerGoogle2.post('/google-redirect2',  (req, res) => {
    res.send('google-redirect2  (POST)');
  });


export default routerGoogle2;