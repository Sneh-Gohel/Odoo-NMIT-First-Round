import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'uploads' directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwriting files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only accept images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: File upload only supports the following filetypes - ' + allowedTypes));
};

// Initialize multer with the storage and filter configurations
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: fileFilter
});

// This is our custom middleware function
export const handleProjectImageUpload = (req: Request, res: any, next: any) => {
  // Check the 'isCustom' field from the form data
  const isCustom = req.body.isCustom === 'true';

  if (isCustom) {
    // If isCustom is true, use multer to upload a single file named 'projectImage'
    upload.single('projectImage')(req, res, (err: any) => {
      if (err) {
        // Handle multer errors (e.g., file too large, wrong file type)
        return res.status(400).json({ message: err.message });
      }
      // If upload is successful, proceed to the controller
      next();
    });
  } else {
    // If isCustom is false, skip the upload and proceed
    next();
  }
};