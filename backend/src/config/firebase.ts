import * as admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth'; 

dotenv.config();

// --- Firebase Admin SDK (for backend operations) ---
const serviceAccountKeyFile = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountKeyFile) throw new Error('...');
const serviceAccountPath = path.join(process.cwd(), serviceAccountKeyFile);
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (error) {
  console.error("🔴 Could not load Firebase service account key.");
  throw error;
}
const db = admin.firestore();

// --- Firebase Client SDK (for user authentication) ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const clientApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(clientApp); 

export { admin, db, clientAuth }; 