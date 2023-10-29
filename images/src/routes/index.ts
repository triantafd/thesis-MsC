/** @format */

import express, { Request, Response } from "express";
import { SingleImage } from "../models/userSingleImage";
import { requireAuth } from "thesis-common";

const router = express.Router();

router.get("/api/images", requireAuth, async (req: Request, res: Response) => {
  // Retrieve the images
  const images = await SingleImage.find({});

  // Send the image data as a response
  res.send(images);
});

export { router as indexSingleImageRouter };
