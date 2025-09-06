import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/firebase'; // Import the initialized db instance
import apiRoutes from './routes'; // <<< THE ONLY CHANGE IS HERE

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
// All routes will now be prefixed with /v1
app.use('/v1', apiRoutes);

// --- Health Check Route ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'SynergySphere API is up and running!' });
});

/**
 * A function to verify the connection to Firestore.
 */
const verifyFirebaseConnection = async () => {
  try {
    await db.listCollections();
    console.log('✅ Successfully connected to Firebase Firestore.');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Firebase Firestore.', error);
    return false;
  }
};

/**
 * Starts the Express server only if the Firebase connection is successful.
 */
const startServer = async () => {
  const isFirebaseConnected = await verifyFirebaseConnection();

  if (isFirebaseConnected) {
    app.listen(port, () => {
      console.log(`🚀 Server is listening on http://localhost:${port}`);
    });
  } else {
    console.error('Server did not start due to a failed database connection.');
    process.exit(1);
  }
};

// --- Initialize Server ---
startServer();