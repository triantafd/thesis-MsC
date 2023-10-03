/** @format */

import Login from "../pages/auth/Login";
import { IParentRoute } from "./types";

const authRoutes: IParentRoute = {
  id: "Auth",
  path: "/auth",
  icon: "fas fa-cloud-sun-rain text-warning",
  guard: null,
  children: [
    {
      path: "/auth/login",
      name: "Login",
      component: Login,
      guard: null,
    },
    {
      path: "/auth",
      name: "Redirect",
      redirectTo: "/auth/login",
      guard: null,
    },
  ],
};

export const layoutRoutesUser = [];

export { authRoutes };
