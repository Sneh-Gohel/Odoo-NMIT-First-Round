import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const creatorId = req.user!.uid;
    // --- CHANGE: Get projectId from the request BODY ---
    const { projectId, title, description, assigneeId, dueDate, status, priority } = req.body;

    if (!title || !assigneeId || !dueDate || !status || !priority) {
      return res.status(400).json({ message: 'Missing required fields for the task.' });
    }

    const taskData: taskService.NewTaskData = {
      title,
      description: description || '',
      assigneeId,
      dueDate: new Date(dueDate),
      status,
      priority,
      creatorId,
    };

    const newTask = await taskService.createTask(projectId, taskData);
    res.status(201).json({ message: 'Task created successfully!', task: newTask });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};