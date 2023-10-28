/** @format */

import axios from "axios";

const baseUrl = "http://localhost:3001/api/users";

// Create an Axios instance with credentials enabled
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/currentuser");

    if (response.status === 200) {
      const userData = response.data;
      // You can choose to handle the login logic here or in the component where you use it.
      return userData;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/signin", { email, password });

    if (response.status === 200) {
      const userData = response.data;
      // You can choose to handle the login logic here or in the component where you use it.
      return userData;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/signup", { email, password });

    if (response.status === 200) {
      const userData = response.data;
      // You can choose to handle the login logic here or in the component where you use it.
      return userData;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signout = async () => {
  try {
    const response = await axiosInstance.post("/signout");

    if (response.status === 200) {
      // You can choose to handle the logout logic here or in the component where you use it.
      return true;
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
