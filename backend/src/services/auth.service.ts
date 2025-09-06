// src/services/auth.service.ts

import { db, admin } from '../config/firebase';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from './email.service';

const PENDING_USERS_COLLECTION = 'pendingUsers';

/**
 * Step 1: Hashes password, generates OTP, saves temporarily, and sends email.
 */
// ADD 'export' HERE
export const initiateSignup = async (name: string, email: string, password:string) => {
  // ... rest of the function code is correct
  try {
    await admin.auth().getUserByEmail(email);
    throw new Error('An account with this email already exists.');
  } catch (error: any) {
    if (error.code !== 'auth/user-not-found') {
      throw error;
    }
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const pendingUserRef = db.collection(PENDING_USERS_COLLECTION).doc(email);
  await pendingUserRef.set({ name, email, passwordHash, otp, expiresAt });
  await sendOtpEmail(email, otp);
};

/**
 * Step 2: Verifies OTP and creates the user permanently.
 */
// ADD 'export' HERE
export const verifyAndCompleteSignup = async (email: string, otp: string) => {
  // ... rest of the function code is correct
  const pendingUserRef = db.collection(PENDING_USERS_COLLECTION).doc(email);
  const doc = await pendingUserRef.get();

  if (!doc.exists) {
    throw new Error('No pending registration found for this email.');
  }

  const data = doc.data()!;

  if (data.expiresAt.toDate() < new Date()) {
    await pendingUserRef.delete();
    throw new Error('OTP has expired. Please try signing up again.');
  }

  if (data.otp !== otp) {
    throw new Error('Invalid OTP.');
  }

  const userRecord = await admin.auth().createUser({
    email: data.email,
    // Use the raw password from the temporary store for creation
    // Firebase will handle hashing and salting internally.
    password: data.passwordHash, 
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