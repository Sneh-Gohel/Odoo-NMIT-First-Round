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

export const updateTask = async (projectId: string, taskId: string, requestorId: string, updateData: any) => {
  // 1. Get the requestor's role in the project
  const teamMemberRef = db.collection('projects').doc(projectId).collection('team').doc(requestorId);
  const teamMemberDoc = await teamMemberRef.get();
  
  if (!teamMemberDoc.exists) {
    // This check is redundant due to the middleware, but good for safety
    throw new Error('You are not a member of this project.');
  }
  const requestorRole = teamMemberDoc.data()?.role;

  // 2. Define what data is allowed to be updated based on the role
  let allowedUpdates: any = {};
  if (requestorRole === 'owner') {
    // Owner can update any provided field
    allowedUpdates = updateData;
  } else if (requestorRole === 'member') {
    // Member can only update the status
    if (updateData.status) {
      allowedUpdates.status = updateData.status;
    } else {
      // If a member tries to update anything else, throw an error
      throw new Error('Forbidden: Team members can only update the task status.');
    }
  } else {
    throw new Error('Forbidden: You do not have permission to update tasks in this project.');
  }

  // 3. Apply the updates to the task document
  const taskRef = db.collection('projects').doc(projectId).collection('tasks').doc(taskId);
  await taskRef.update(allowedUpdates);

  // 4. Return the full, updated task document
  const updatedTaskDoc = await taskRef.get();
  return updatedTaskDoc.data();
};