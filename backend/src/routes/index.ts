import { Router } from 'express';
import projectRoutes from './project.routes';
import authRoutes from './auth.routes'; // Import auth routes

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API V1 is alive!' });
});

// All auth routes will be prefixed with /v1/auth
router.use('/auth', authRoutes); // Use auth routes

// All project routes will be prefixed with /v1/projects
router.use('/projects', projectRoutes);

export default router;