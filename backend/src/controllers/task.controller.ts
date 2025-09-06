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

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestorId = req.user!.uid;
    // Get projectId and taskId from the request BODY
    const { projectId, taskId, ...updateData } = req.body;

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'projectId and taskId are required in the request body.' });
    }
    
    const updatedTask = await taskService.updateTask(projectId, taskId, requestorId, updateData);
    res.status(200).json({ message: 'Task updated successfully!', task: updatedTask });

  } catch (error: any) {
    if (error.message.startsWith('Forbidden:')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};