import {Router} from 'express';
import {register, login, logout, getMe,verifyEmail} from '../controllers/auth.controller.js';
import validateRegistration from '../validate/registration.validation.js';
import validateLogin from '../validate/login.validation.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/get-me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);

export default router;
 