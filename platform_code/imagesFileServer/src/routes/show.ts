import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";
import path from "path";

const router = express.Router();

router.get(
  "/api/images/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      // Retrieve the image document from MongoDB using the imageId

      const imageDocument = await SingleImage.findById(id);

      if (!imageDocument) {
        throw new NotFoundError();
      }

      const filePath = path.join(
        __dirname,
        "..",
        "..",
        imageDocument.imagePath
      );
      res.sendFile(filePath);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as showSingleImageRouter };
