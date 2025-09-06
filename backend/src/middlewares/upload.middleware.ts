import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Configure Multer storage for saving files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to only allow image file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  if (allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  }
  cb(new Error('Error: File upload only supports image filetypes'));
};

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

/**
 * CORRECTED: A single middleware that properly handles form-data parsing for project creation.
 * It calls multer first, then checks conditions.
 */
export const projectImageParser = (req: Request, res: Response, next: NextFunction) => {
  // Use multer to process the incoming form for a single file named 'projectImage'
  const uploader = upload.single('projectImage');

  // This function runs AFTER multer has processed the request
  uploader(req, res, (err: any) => {
    if (err) {
      // Handle any multer-specific errors (e.g., file too large)
      return res.status(400).json({ message: err.message });
    }

    // Now, req.body is guaranteed to be available
    const isCustom = req.body.isCustom === 'true';
    
    // If it's a custom project but no file was actually uploaded, send an error.
    if (isCustom && !req.file) {
        return res.status(400).json({ message: 'A project image is required for custom projects.' });
    }

    // If everything is fine, proceed to the controller
    next();
  });
};