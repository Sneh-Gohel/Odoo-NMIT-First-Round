import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { db } from '../config/firebase';

export const isProjectMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.uid;
    // --- CHANGE: Get projectId from the request BODY ---
    const { projectId } = req.body; 

    if (!userId) {
      return res.status(401).json({ message: 'Authentication error.' });
    }
    if (!projectId) {
      // Updated error message
      return res.status(400).json({ message: 'Project ID is required in the request body.' });
    }

    const teamMemberRef = db.collection('projects').doc(projectId).collection('team').doc(userId);
    const teamMemberDoc = await teamMemberRef.get();

    if (!teamMemberDoc.exists) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this project.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error while verifying project membership.' });
  }
};