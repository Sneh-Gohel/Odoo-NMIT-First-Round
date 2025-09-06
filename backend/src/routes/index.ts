import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import projectRoutes from './project.routes';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import { isProjectMember } from '../middlewares/projectAuth.middleware';

const router = Router();

router.get('/', (req, res) => res.json({ message: 'API V1 is alive!' }));

// Auth routes (public)
router.use('/auth', authRoutes);

// Project routes (all routes starting with /projects are protected)
router.use('/projects', protect, projectRoutes);

// Task routes (all routes starting with /tasks are protected and require project membership)
router.use('/tasks', protect, isProjectMember, taskRoutes);

export default router;