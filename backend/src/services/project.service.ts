import { admin, db } from '../config/firebase';

export interface NewProjectData {
  name: string;
  description: string;
  tags: string[];
  deadline: Date;
  priority: 'Low' | 'Medium' | 'High';
  imageUrl?: string;
  isCustom: boolean;
  ownerId: string;
  ownerName: string;
}

export const createProject = async (projectData: NewProjectData) => {
  const projectRef = db.collection('projects').doc();
  const newProject = {
    id: projectRef.id,
    ...projectData,
    createdAt: new Date(),
  };
  await projectRef.set(newProject);

  const teamMemberRef = projectRef.collection('team').doc(projectData.ownerId);
  await teamMemberRef.set({
    userId: projectData.ownerId,
    name: projectData.ownerName,
    role: 'owner',
    joinedAt: new Date(),
  });
  return newProject;
};

export const getProjectDetails = async (projectId: string) => {
  const projectRef = db.collection('projects').doc(projectId);
  const projectDoc = await projectRef.get();

  if (!projectDoc.exists) {
    throw new Error('Project not found.');
  }
  const projectData = projectDoc.data();

  const teamSnapshot = await projectRef.collection('team').get();
  const teamMembers = teamSnapshot.docs.map(doc => doc.data());

  const tasksSnapshot = await projectRef.collection('tasks').get();
  const tasks = tasksSnapshot.docs.map(doc => doc.data());

  return {
    ...projectData,
    team: teamMembers,
    tasks: tasks,
  };
};

export const addTeamMember = async (projectId: string, newMemberEmail: string, requestorId: string) => {
  const projectRef = db.collection('projects').doc(projectId);
  const projectDoc = await projectRef.get();

  if (!projectDoc.exists) {
    throw new Error('Project not found.');
  }
  const projectData = projectDoc.data()!;

  if (projectData.ownerId !== requestorId) {
    throw new Error('Only the project owner can add team members.');
  }

  let newMemberRecord;
  try {
    newMemberRecord = await admin.auth().getUserByEmail(newMemberEmail);
  } catch (error) {
    throw new Error('User with the specified email does not exist.');
  }

  if (newMemberRecord.uid === requestorId) {
    throw new Error('The project owner is already a member.');
  }

  const teamMemberRef = projectRef.collection('team').doc(newMemberRecord.uid);
  const newMemberData = {
    userId: newMemberRecord.uid,
    name: newMemberRecord.displayName || newMemberRecord.email!,
    role: 'member',
    joinedAt: new Date(),
  };
  await teamMemberRef.set(newMemberData);
  
  return newMemberData;
};

// --- THIS IS THE CORRECT, FULLY IMPLEMENTED FUNCTION ---
export const getProjectsForUser = async (userId: string) => {
  const userProjects: any[] = [];
  
  const allProjectsSnapshot = await db.collection('projects').get();

  for (const projectDoc of allProjectsSnapshot.docs) {
    const projectData = projectDoc.data();

    if (projectData.ownerId === userId) {
      userProjects.push(projectData);
      continue;
    }

    const teamMemberDoc = await projectDoc.ref.collection('team').doc(userId).get();
    if (teamMemberDoc.exists) {
      userProjects.push(projectData);
    }
  }

  return userProjects;
};