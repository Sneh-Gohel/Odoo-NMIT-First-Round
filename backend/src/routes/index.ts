import { Router } from 'express';
import projectRoutes from './project.routes'; // Uncomment this line

const router = Router();

// A simple health check for the API router
router.get('/', (req, res) => {
  res.json({ message: 'API V1 is alive!' });
});

// Use other specific routers here
router.use('/projects', projectRoutes); // Add this line

export default router;