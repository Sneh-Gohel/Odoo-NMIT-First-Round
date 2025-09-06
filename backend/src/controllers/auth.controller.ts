import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const initiateSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    await authService.initiateSignup(name, email, password);
    res.status(200).json({ message: 'Verification OTP sent to your email.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyAndCompleteSignup = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const newUser = await authService.verifyAndCompleteSignup(email, otp);
    res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};