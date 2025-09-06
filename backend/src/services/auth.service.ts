import { db, admin, clientAuth } from '../config/firebase';
import { sendOtpEmail } from './email.service';
import { signInWithEmailAndPassword } from 'firebase/auth';
import jwt from 'jsonwebtoken';

const PENDING_USERS_COLLECTION = 'pendingUsers';


export const initiateSignup = async (name: string, email: string, password: string) => {
  try {
    await admin.auth().getUserByEmail(email);
    throw new Error('An account with this email already exists.');
  } catch (error: any) {
    if (error.code !== 'auth/user-not-found') { throw error; }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store the plain-text password temporarily
  const pendingUserRef = db.collection(PENDING_USERS_COLLECTION).doc(email);
  await pendingUserRef.set({
    name,
    email,
    password, 
    otp,
    expiresAt,
  });

  await sendOtpEmail(email, otp);
};


export const verifyAndCompleteSignup = async (email: string, otp: string) => {
  const pendingUserRef = db.collection(PENDING_USERS_COLLECTION).doc(email);
  const doc = await pendingUserRef.get();

  if (!doc.exists) { throw new Error('No pending registration found for this email.'); }
  const data = doc.data()!;
  if (data.expiresAt.toDate() < new Date()) {
    await pendingUserRef.delete();
    throw new Error('OTP has expired. Please try signing up again.');
  }
  if (data.otp !== otp) { throw new Error('Invalid OTP.'); }

  // Create the user in Firebase Auth with the plain-text password
  const userRecord = await admin.auth().createUser({
    email: data.email,
    password: data.password, // <-- CHANGE: Using the plain password from the document
    displayName: data.name,
  });

  await db.collection('users').doc(userRecord.uid).set({
    name: data.name,
    email: data.email,
    profilePictureUrl: '',
  });

  await pendingUserRef.delete();
  return { uid: userRecord.uid, email: userRecord.email, name: userRecord.displayName };
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in .env file.');
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return token;
  } catch (error: any) {
    console.error("Firebase Login Error:", error);

    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      throw new Error('Invalid email or password.');
    }

    throw new Error('Login failed. Please try again.');
  }
};