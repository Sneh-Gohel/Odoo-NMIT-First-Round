import { Router } from 'express';
import { initiateSignup, verifyAndCompleteSignup } from '../controllers/auth.controller';

const router = Router();

// Route to start the signup process and send an OTP
router.post('/signup/initiate', initiateSignup);

// Route to verify the OTP and create the user
router.post('/signup/verify', verifyAndCompleteSignup);

export default router;