import { Router } from 'express';
import { createTask, updateTask } from '../controllers/task.controller';

const router = Router();

// This route will now handle POST requests to /v1/tasks
router.post('/', createTask);

router.put('/', updateTask);

export default router;