import Router from 'express';
import {
  registration,
  login,
  logout,
} from '../../controllers/authentication/authenticationController.js';

const router = new Router();

router.post('/registration', registration);
router.post('/login', login);
router.post('/logout', logout);

export default router;
