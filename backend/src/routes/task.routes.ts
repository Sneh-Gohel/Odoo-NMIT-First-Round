import { Router } from 'express';
import { createTask } from '../controllers/task.controller';

const router = Router();

// This route will now handle POST requests to /v1/tasks
router.post('/', createTask);

export default router;