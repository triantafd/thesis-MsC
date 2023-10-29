/** @format */

import express, { Request, Response } from "express";
import multer from "multer";
import { body } from "express-validator";
import { NotFoundError, requireAuth, validateRequest } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post(
  "/api/images/",
  upload.single("image"),
  [body("userId").not().isEmpty().withMessage("UserId is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.file) {
      // No file was included in the request.
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log(req.file);
    const { originalname, buffer: imgBuffer, mimetype } = req.file;

    const { userId } = req.body;

    try {
      const userSingleImage = SingleImage.build({
        userId,
        imgBuffer,
        contentType: mimetype
      });

      await userSingleImage.save();

      res.status(201).send(userSingleImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send("Error uploading image");
    }
  }
);

export { router as createSingleImageRouter };
