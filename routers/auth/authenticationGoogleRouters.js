import { Router } from 'express';
import googleAuth from '../../controllers/authentication/authenticationGoogleController.js';

const router = Router();

router.get('/google', googleAuth);
router.get('/google_redirect', googleRedirect);

export default router;
