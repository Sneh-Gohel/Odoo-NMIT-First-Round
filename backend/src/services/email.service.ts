import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"SynergySphere" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your SynergySphere Verification Code',
    html: createOtpEmailTemplate(otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${to}:`, error);
    throw new Error('Could not send verification email.');
  }
};

const createOtpEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #333;">Welcome to SynergySphere!</h2>
      <p style="font-size: 16px; color: #555;">
        Thank you for signing up. Please use the following verification code to complete your registration.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 16px; color: #555;">
        This code is valid for 10 minutes. If you did not request this, please ignore this email.
      </p>
      <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 20px;">
        &copy; 2025 SynergySphere. All rights reserved.
      </p>
    </div>
  `;
};