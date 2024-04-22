/** @format */

import axios from "axios";

const baseUrl = "http://localhost:3002/api/images";

// Create an Axios instance with credentials enabled
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

const uploadImage = async (file: any, buildingType: string, metadata?: any) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    metadata && formData.append("metadata", JSON.stringify(metadata));
    formData.append("label", buildingType);

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
const getAllImages = async (page?: number, label?: string) => {
  try {
    const response = await axiosInstance.get(`/?page=${page}&label=${label}`);

    if (response.status === 200) {
      // Assuming the response data is an array of image objects
      const images = response.data;

      return images;
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

const deleteAllImages = async (ids?: string[]) => {
  try {
    const response = await axiosInstance.delete("/", {
      data: { ids },
    });

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

// Make a request to the backend API to get all images
const fetchAnalytics = async (label?: string) => {
  try {
    const response = await axiosInstance.get(`analytics/?label=${label}`);

    if (response.status === 200) {
      // Assuming the response data is an array of image objects
      const analytics = response.data;

      return analytics;
    } else {
      throw new Error("Error getting analytics");
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// Define your object with functions
const imageServiceFileServer = {
  uploadImage,
  getImageById,
  getAllImages,
  deleteAllImages,
  deleteImageById,
  fetchAnalytics,
};

// Export the object as the default export
export default imageServiceFileServer;
