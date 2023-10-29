/** @format */

import axios from "axios";

const baseUrl = "http://localhost:3002/api/images";

// Create an Axios instance with credentials enabled
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

const uploadImage = async (userId: string, file: any) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("image", file);

    const response = await axiosInstance.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      const imgRes = response.data;

      return imgRes;
    } else {
      throw new Error("Photo Upload failed");
    }
  } catch (error) {
    console.error("Photo Upload error:", error);
    throw error;
  }
};

const getImageById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/${id}`, {
      responseType: "arraybuffer", // Set responseType to "arraybuffer" to handle binary data
    });

    if (response.status === 200) {
      // Create a blob from the binary data and set it as the image source
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    } else {
      throw new Error("Error getting image");
    }
  } catch (error) {
    console.error("Image get error:", error);
    throw error;
  }
};

// Make a request to the backend API to get all images
const getAllImages = async () => {
  try {
    const response = await axiosInstance.get("/");

    if (response.status === 200) {
      // Assuming the response data is an array of image objects
      const images = response.data;

      // Use map to convert the image data into Blobs and add them to the image objects
      const imagesWithBlobs = images.map((image: any) => {
        const blob = new Blob([new Uint8Array(image.imgBuffer.data)], {
          type: image.contentType,
        });
        const blobUrl = URL.createObjectURL(blob);
        return { ...image, blobUrl };
      });

      return imagesWithBlobs;
    } else {
      throw new Error("Error getting images");
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

const deleteImageById = async (id: any) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);

    if (response.status === 204) {
      // Image deleted successfully
    } else {
      throw new Error("Error deleting image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

const deleteAllImages = async () => {
  try {
    const response = await axiosInstance.delete("/");

    if (response.status === 204) {
      // All images deleted successfully
    } else {
      throw new Error("Error deleting images");
    }
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

// Define your object with functions
const imageService = {
  uploadImage,
  getImageById,
  getAllImages,
  deleteAllImages,
  deleteImageById,
};

// Export the object as the default export
export default imageService;
