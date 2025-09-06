import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
// Import BOTH controller functions from the controller file
import { createProject, getProjects } from '../controllers/project.controller';

const router = Router();


router.post('/', protect, createProject);


router.get('/', protect, getProjects);

export default router;