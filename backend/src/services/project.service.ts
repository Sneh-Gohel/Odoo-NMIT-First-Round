import { db } from '../config/firebase';

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

export const getProjectsForUser = async (userId: string) => {
  const userProjects: any[] = [];
  
  // 1. Fetch ALL projects from the database
  const allProjectsSnapshot = await db.collection('projects').get();

  // 2. Loop through each project to check for user membership
  for (const projectDoc of allProjectsSnapshot.docs) {
    const projectData = projectDoc.data();

    // Check if the user is the owner
    if (projectData.ownerId === userId) {
      userProjects.push(projectData);
      continue; 
    }

    // If not the owner, check if they are in the 'team' subcollection
    const teamMemberDoc = await projectDoc.ref.collection('team').doc(userId).get();
    if (teamMemberDoc.exists) {
      userProjects.push(projectData);
    }
  }

  // 3. Return the filtered list
  return userProjects;
};