import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { layoutAuthRoutes } from './routes/authRoutes';

import PageNotFound404 from './pages/PageNotFound404';
import RootLayout from './layouts/authLayout';
import UserLayout from './layouts/userLayout';

import './App.css';
import LandingPage from './pages/LandingPage';
import { getRoutes } from './utils/getRoutes';
import { layoutRoutesUser } from './routes/userRoutes';
import { useAuth } from './context/authContext';

function App() {
  const { user } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {!!user && getRoutes(UserLayout, layoutRoutesUser)}
        {!user && getRoutes(RootLayout, layoutAuthRoutes)}
        <Route
          path="/"
          element={
            <div className="App">
              <RootLayout>
                <LandingPage />
              </RootLayout>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="App">
              <PageNotFound404 />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
