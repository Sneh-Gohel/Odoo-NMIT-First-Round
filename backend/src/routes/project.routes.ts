import { Router } from 'express';

const router = Router();

// This will eventually be replaced by controller functions
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Project created successfully', data: req.body });
});

router.get('/', (req, res) => {
  res.status(200).json({ message: 'List of all projects' });
});

export default router;