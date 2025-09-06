import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase';

// Extend the Express Request interface to include our custom 'user' property
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Check if the token is in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error: JWT secret not found.' });
      }

      // Verify the token
      const decoded = jwt.verify(token, jwtSecret) as { uid: string; email: string };

      // Verify the user still exists in Firebase
      await admin.auth().getUser(decoded.uid);

      // Attach user info to the request object
      req.user = decoded;
      next(); // Proceed to the next function (the controller)
    } catch (error) {
      console.error('Authentication Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};