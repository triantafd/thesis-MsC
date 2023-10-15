// AuthContext.js
// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { signin, signout, signup } from '../services/authService';

// Define the user type
interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  handleSignin: (email: string, password: string) => Promise<void>;
  handleSignout: () => Promise<void>;
  handleSignup: (email: string, password: string) => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface IAuthProvider {
  children: ReactNode
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user data is stored in localStorage
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const handleSignup = async (email: string, password: string) => {
    try {
      const userData = await signup(email, password);
      setUser(userData);

      // Save user data to local storage
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignin = async (email: string, password: string) => {
    try {
      const userData = await signin(email, password);
      setUser(userData);

      // Save user data to local storage
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignout = async () => {
    try {
      const success = await signout();
      if (success) {
        setUser(null);

        // Remove user data from local storage
        localStorage.removeItem('userData');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleSignin, handleSignout, handleSignup }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
