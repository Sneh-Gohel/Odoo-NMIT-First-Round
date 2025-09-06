import { db } from '../config/firebase';

export interface NewTaskData {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: Date;
  status: 'To-Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  creatorId: string;
}

export const createTask = async (projectId: string, taskData: NewTaskData) => {
  // Verify the assignee is also a member of the project
  const assigneeRef = db.collection('projects').doc(projectId).collection('team').doc(taskData.assigneeId);
  const assigneeDoc = await assigneeRef.get();
  if (!assigneeDoc.exists) {
    throw new Error('Assignee is not a member of this project.');
  }

  // Create the task
  const taskRef = db.collection('projects').doc(projectId).collection('tasks').doc();
  const newTask = {
    id: taskRef.id,
    ...taskData,
    imageUrl: 'default-task-image', // Default value since no image is uploaded
    createdAt: new Date(),
  };

  await taskRef.set(newTask);
  return newTask;
};