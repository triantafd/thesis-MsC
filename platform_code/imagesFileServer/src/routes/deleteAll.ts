/** @format */

import express, { NextFunction, Request, Response } from "express";
import { SingleImage } from "../models/userSingleImage";
import { BadRequestError, NotFoundError, requireAuth } from "thesis-common";
import fs from "fs";
import path from "path";

const router = express.Router();

router.delete(
  "/api/images",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const ids = req.body.ids;

    try {
      if (ids && Array.isArray(ids)) {
        // Check if all IDs have the correct format
        if (!ids.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
          throw new BadRequestError("Invalid ID format in the provided array");
        }

        // Check if all IDs exist
        const imageDocuments = await SingleImage.find({
          _id: { $in: req.body.ids },
        });

        if (imageDocuments.length === 0) {
          throw new NotFoundError();
        }

        // Iterate over each document to delete the associated file
        // Create an array of promises for file deletion
        const fileDeletionPromises = imageDocuments.map((doc) => {
          const filePath = `public/${doc.imagePath}`;
          return fs.unlink(filePath, async (err) => {
            if (err) {
              console.error(`Error deleting file: ${err.message}`);
              throw new BadRequestError(
                "Error deleting the file from the server"
              );
            }
          });
        });

        // Wait for all file deletions to complete
        await Promise.all(fileDeletionPromises);

        // Delete all matching documents from MongoDB
        await SingleImage.deleteMany({ _id: { $in: ids } });
      } else {
        // Delete all image documents
        const filePath = `public/images/${req.currentUser!.id}`;

        fs.rm(filePath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error deleting folder: ${err.message}`);
            throw new BadRequestError(
              "Error deleting the file from the server"
            );
          }
        });

        await SingleImage.deleteMany({});
      }

      // Respond with a success message
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as deleteAllImagesRouter };
