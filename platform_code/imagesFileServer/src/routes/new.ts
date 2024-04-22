import express, { NextFunction, Request, Response } from "express";
import { BadRequestError, requireAuth } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";
import { multerMiddleware } from "../middlewares/multerUpload";
import { isValidLabel } from "../utils/labelValidator";

const router = express.Router();

router.post(
  "/api/images/",
  requireAuth,
  multerMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new BadRequestError("No image file uploaded");
    }

    const label = req.body.label; // Assuming the label is sent in the body of the request

    if (!isValidLabel(label) && label !== undefined) {
      // Handle invalid label error
      throw new BadRequestError("Invalid label");
    }

    let metadata = req.body?.metadata
      ? JSON.parse(req.body.metadata)
      : undefined;

    const imagePath = req.file.path; // The path where the image is saved
    const imagePathWithoutPublic = imagePath
      .replace(/\\/g, "/")
      .replace("public/", "");

    try {
      const label = req.body.label; // Get the label from the request body

      const userSingleImage = SingleImage.build({
        userId: req.currentUser!.id,
        imagePath: imagePathWithoutPublic,
        label, // Save the label
        metadata: metadata,
      });

      await userSingleImage.save();

      res.status(200).send(userSingleImage);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as createSingleImageRouter };
