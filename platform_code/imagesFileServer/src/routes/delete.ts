import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, requireAuth } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";
import fs from "fs";

const router = express.Router();

router.delete(
  "/api/images/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // Handle invalid ID format (e.g., return an error response)
      throw new BadRequestError("Invalid ID format");
    }

    try {
      // Retrieve the image document from MongoDB using the imageId
      const imageDocument = await SingleImage.findById(id);

      if (!imageDocument) {
        throw new BadRequestError("Image not found");
      }

      // Build the file path

      const filePath = `public/${imageDocument.imagePath}`;

      fs.unlink(filePath, async (err: any) => {
        if (err) {
          throw new BadRequestError("Error deleting the file from the server");
        }

        try {
          // Delete the MongoDB document
          await imageDocument.remove();
          // Respond with a success message
          res.status(204).send();
        } catch (error) {
          console.error("Error deleting image from MongoDB:", error);
          /*    res.status(500).send("Error deleting image record from MongoDB"); */
          throw new BadRequestError("Error deleting image record from MongoDB");
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteSingleImageRouter };
