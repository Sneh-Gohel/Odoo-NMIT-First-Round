import { Router } from 'express';
import { isProjectMember } from '../middlewares/projectAuth.middleware';
import { createProject, getProjects, addMember, getProjectById } from '../controllers/project.controller';
import { projectImageParser } from '../middlewares/upload.middleware';

const router = Router();

// Route to get all projects for the logged-in user
router.get('/', getProjects);

// Route to create a new project. It uses our new robust image parser.
router.post('/', projectImageParser, createProject);

// Route to get the full details of a specific project
router.post('/details', isProjectMember, getProjectById);

// Route to add a new member to a project's team
router.post('/:projectId/team', isProjectMember, addMember);

export default router;