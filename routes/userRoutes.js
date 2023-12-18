import express from 'express';
import { loginForm, registerForm, confirm, forgotPasswordForm, signUp, resetPassword, checkToken, newPassword, authenticate} from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);
router.post('/login', authenticate);

router.get('/register', registerForm);
router.post('/register', signUp);

router.get('/confirm/:token', confirm);

router.get('/forgot-password', forgotPasswordForm);
router.post('/forgot-password', resetPassword);

//Store the new password

router.get('/forgot-password/:token', checkToken);
router.post('/forgot-password/:token', newPassword);


export default router;