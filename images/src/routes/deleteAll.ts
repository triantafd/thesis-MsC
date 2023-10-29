/** @format */

import express, { Request, Response } from "express";
import { SingleImage } from "../models/userSingleImage";

const router = express.Router();

router.delete("/api/images", async (req: Request, res: Response) => {
  try {
    // Delete all image documents
    await SingleImage.deleteMany({});

    // Respond with a success message
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).send("Error deleting images");
  }
});

export { router as deleteAllImagesRouter };
