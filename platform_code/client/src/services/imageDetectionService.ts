/** @format */

import axios from "axios";

const baseUrl = "http://localhost:3005/api/detection";

export interface IRectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type TLabel = "carpet" | "mirror" | "";

export interface IRectObject {
  id: number;
  rect: IRectangle;
  label: TLabel;
}

// Create an Axios instance with credentials enabled
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

const detectImage = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post(
      "/image",
      formData /* , {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    } */
    );

    if (response.status === 200) {
      /* const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(blob); */

      const imageUrl = response.data;
      return imageUrl;
    } else {
      throw new Error("Photo Upload failed");
    }
  } catch (error) {
    console.error("Photo Upload error:", error);
    throw error;
  }
};

const detectImageWithLabels = async (file: any, rectangles: IRectObject[]) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    // Append rectangle data as a JSON string
    formData.append("rectangles", JSON.stringify(rectangles));

    const response = await axiosInstance.post(
      "/image-with-labels",
      formData /* , {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    } */
    );

    if (response.status === 200) {
      /*   const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      }); 
      const imageUrl = response;
      */
      const imageUrl = response.data;

      return imageUrl;
    } else {
      throw new Error("Image detection with labels failed");
    }
  } catch (error) {
    console.error("Image detection with labels error:", error);
    throw error;
  }
};

// Define your object with functions
const imageDetectionService = {
  detectImage,
  detectImageWithLabels,
};

export default imageDetectionService;
