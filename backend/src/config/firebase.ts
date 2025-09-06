import * as admin from 'firebase-admin';
import path from 'path'; // Import the 'path' module
import dotenv from 'dotenv';

dotenv.config();

// Get the filename from the .env file
const serviceAccountKeyFile = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountKeyFile) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is not set in your .env file');
}

// THIS IS THE FIX: Create a reliable, absolute path to the key file
const serviceAccountPath = path.join(process.cwd(), serviceAccountKeyFile);

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

} catch (error) {
  console.error("🔴 Could not load Firebase service account key. Make sure the path in your .env file is correct.");
  throw error;
}

const db = admin.firestore();

export { admin, db };