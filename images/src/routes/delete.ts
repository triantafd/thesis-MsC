import express, { Request, Response } from "express";
import { NotFoundError } from "thesis-common";
import { SingleImage } from "../models/userSingleImage";

const router = express.Router();

router.delete("/api/images/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Retrieve the image document from MongoDB using the imageId
    const imageDocument = await SingleImage.findById(id);

    if (!imageDocument) {
      throw new NotFoundError();
    }

    // Delete the image document
    await imageDocument.remove();

    // Respond with a success message
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send("Error deleting image");
  }
});

export { router as deleteSingleImageRouter };
