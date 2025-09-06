import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as projectService from '../services/project.service';
import { admin } from '../config/firebase';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.uid) {
      return res.status(401).json({ message: 'Authentication error, user not found.' });
    }

    console.log('Received request to create project with body:', req.body);

    const { name, description, tags, deadline, priority, imageUrl, isCustom } = req.body;

    if (!name || !description || !deadline || !priority) {
      return res.status(400).json({ message: 'Missing required fields: name, description, deadline, priority.' });
    }
    
    // Fetch the user's display name to store with the project
    const userRecord = await admin.auth().getUser(user.uid);
    const ownerName = userRecord.displayName || user.email; 

    const projectData: projectService.NewProjectData = {
      name,
      description,
      tags: Array.isArray(tags) ? tags : [], 
      deadline: new Date(deadline),
      priority,
      imageUrl: imageUrl || '',
      isCustom: typeof isCustom === 'boolean' ? isCustom : false,
      ownerId: user.uid,
      ownerName: ownerName,
    };

    const newProject = await projectService.createProject(projectData);

    res.status(201).json({ message: 'Project created successfully!', project: newProject });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error while creating project.' });
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication error, user not found.' });
    }

    const projects = await projectService.getProjectsForUser(userId);
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};