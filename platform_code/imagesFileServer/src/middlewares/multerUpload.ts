import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isValidLabel } from "../utils/labelValidator";
import { BadRequestError } from "thesis-common";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.currentUser!.id; // Get user ID from the request

    // const uploadPath = `public/images/${userId}/${label}`;
    const uploadPath = `public/images/${userId}}`;

    fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage });

// Define multer middleware
const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const uploadSingle = upload.single("image");
  uploadSingle(req, res, (err) => {
    /*  if (err) {
      next(err);
    } */
    next();
  });
};

// Export the multer middleware
export { multerMiddleware };
