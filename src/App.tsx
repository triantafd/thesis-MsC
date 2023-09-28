import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { authRoutes } from './routes/allRoutes';

import PageNotFound404 from './pages/PageNotFound404';
import RootLayout from './layouts/authLayout';
import UserLayout from './layouts/userLayout';

import './App.css';
import LandingPage from './pages/LandingPage';
import { getRoutes } from './utils/getRoutes';

function App() {
  const isUser = true

  return (
    <BrowserRouter>
      <Routes>
        {isUser && getRoutes(UserLayout, [authRoutes])}
        {!isUser && getRoutes(RootLayout, [authRoutes])}
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
