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

    const { name, description, tags, deadline, priority } = req.body;
    const isCustom = req.body.isCustom === 'true';

    // Basic validation
    if (!name || !description || !deadline || !priority) {
      return res.status(400).json({ message: 'Missing required fields: name, description, deadline, priority.' });
    }

    let imageUrl = '';
    if (isCustom) {
      if (!req.file) {
        return res.status(400).json({ message: 'A project image is required for custom projects.' });
      }
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      imageUrl = req.body.imageUrl || 'default-project-image';
    }

    const userRecord = await admin.auth().getUser(user.uid);
    const ownerName = userRecord.displayName || user.email || '';

    const projectData: projectService.NewProjectData = {
      name,
      description,
      tags: typeof tags === 'string' ? tags.split(',') : [],
      deadline: new Date(deadline),
      priority,
      imageUrl: imageUrl,
      isCustom: isCustom,
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

export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestorId = req.user?.uid;
    if (!requestorId) {
      return res.status(401).json({ message: 'Authentication error.' });
    }

    const { projectId } = req.params; // Get project ID from URL
    const { email } = req.body; // Get new member's email from body

    if (!email) {
      return res.status(400).json({ message: 'Please provide the email of the member to add.' });
    }

    const newMember = await projectService.addTeamMember(projectId, email, requestorId);
    res.status(200).json({ message: 'Team member added successfully!', member: newMember });
  } catch (error: any) {
    // Customize error response based on the message from the service
    if (error.message === 'Project not found.' || error.message === 'User with the specified email does not exist.') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Only the project owner can add team members.') {
      return res.status(403).json({ message: error.message }); // 403 Forbidden
    }
    res.status(400).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required in the request body.' });
    }
    
    const projectDetails = await projectService.getProjectDetails(projectId);
    res.status(200).json(projectDetails);
  } catch (error: any) {
    // --- ADD THIS DETAILED LOG ---
    console.error("🔴 Error in getProjectById controller:", error);
    
    if (error.message === 'Project not found.') {
      return res.status(404).json({ message: error.message });
    }
    // This is the generic response you are seeing
    res.status(500).json({ message: 'Server error while fetching project details.' });
  }
};