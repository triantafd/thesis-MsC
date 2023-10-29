/** @format */

import express, { Request, Response } from "express";
import { NotFoundError } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";

const router = express.Router();

router.get("/api/images/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Retrieve the image document from MongoDB using the imageId
    console.log(id);
    const imageDocument = await SingleImage.findById(id);

    if (!imageDocument) {
      throw new NotFoundError();
    }

    // Send the image data as a response
    res.setHeader("Content-Type", imageDocument.contentType);
    res.send(imageDocument.imgBuffer);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Error retrieving image");
  }
});

export { router as showSingleImageRouter };
