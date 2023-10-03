/** @format */

import Account from "../pages/account";
import { IRoute } from "./types";

const userRoutes: IRoute = {
  path: "/account",
  name: "Account",
  component: Account,
  guard: null,
};

export const layoutRoutesUser = [];

export { userRoutes };
