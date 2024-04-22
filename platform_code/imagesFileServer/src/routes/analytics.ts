/** @format */

import express, { NextFunction, Request, Response } from "express";
import { SingleImage } from "../models/userSingleImage";
import { requireAuth } from "thesis-common";

const router = express.Router();

// Assuming the structure of your metadata
interface Metadata {
  [key: string]: { [subkey: string]: number };
}

router.get(
  "/api/images/analytics/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const label = req.query.label || null; // Default to null if label is not provided

    try {
      let query: { userId: string; [key: string]: any } = { userId }; // Construct the query based on whether label and userId is provided

      if (label) {
        query.label = label; // Only label is provided
      }

      const images = await SingleImage.find(query); // Find images by userId and optionally label with pagination

      let aggregatedMetadata: Metadata = {};

      // Aggregate metadata
      images.forEach((image) => {
        if (image.metadata) {
          Object.entries(image.metadata).forEach(([mainClass, subClasses]) => {
            if (!aggregatedMetadata[mainClass]) {
              aggregatedMetadata[mainClass] = {};
            }

            Object.entries(subClasses).forEach(([subClass, count]) => {
              if (!aggregatedMetadata[mainClass][subClass]) {
                aggregatedMetadata[mainClass][subClass] = 0;
              }

              aggregatedMetadata[mainClass][subClass] += count;
            });
          });
        }
      });

      // Calculate the percentage for each subcategory
      let percentages: Metadata = {};
      Object.keys(aggregatedMetadata).forEach((mainClass) => {
        const total = Object.values(aggregatedMetadata[mainClass]).reduce(
          (sum, count) => sum + count,
          0
        );
        percentages[mainClass] = {};

        Object.entries(aggregatedMetadata[mainClass]).forEach(
          ([subClass, count]) => {
            percentages[mainClass][subClass] = parseFloat(
              ((count / total) * 100).toFixed(2)
            );
          }
        );
      });

      // Respond with images and pagination metadata
      res.status(200).json(aggregatedMetadata);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as analyticsSingleImageRouter };
