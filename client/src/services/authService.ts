/** @format */

const baseUrl = "http://localhost:3001/api/users";

export const getCurrentUser = async () => {
  try {
    // Make an API call to authenticate the user
    const response = await fetch(`${baseUrl}/currentuser`, {
      method: "GET",
    });

    if (response.ok) {
      const userData = await response.json();
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

export const login = async (email: string, password: string) => {
  try {
    // Make an API call to authenticate the user
    const response = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
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

export const logout = async () => {
  try {
    // Make an API call to log the user out
    const response = await fetch(`${baseUrl}/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
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
