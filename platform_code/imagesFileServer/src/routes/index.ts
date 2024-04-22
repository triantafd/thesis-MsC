/** @format */

import express, { NextFunction, Request, Response } from "express";
import { SingleImage } from "../models/userSingleImage";
import { requireAuth } from "thesis-common";

const router = express.Router();

router.get(
  "/api/images/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const label = req.query.label || null; // Default to null if label is not provided
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit as string) || 6; // Default to 6 items per page if not specified
    const skip = (page - 1) * limit;

    try {
      // Construct the query based on whether label and userId is provided
      let query: { userId: string; [key: string]: any } = { userId };

      if (label) {
        // Only label is provided
        query.label = label;
      }

      // Find images by userId and optionally label with pagination
      const images = await SingleImage.find(query).skip(skip).limit(limit);

      // Optional: Count total number of documents for pagination metadata
      const total = await SingleImage.countDocuments(query);

      // get fullUrl
      const fullUrl = req.protocol + "://" + req.get("host") + "/";

      const imagesWithFullUrl = images.map((image) => {
        const imageObj = image.toObject(); // Convert to plain object
        imageObj.imagePath = fullUrl + imageObj.imagePath.replace(/\\/g, "/"); // Modify the imagePath
        return imageObj; // Return the modified object
      });

      // Respond with images and pagination metadata
      res.status(200).json({
        imagesWithFullUrl,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as indexSingleImageRouter };
