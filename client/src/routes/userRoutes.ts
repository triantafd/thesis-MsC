/** @format */

import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Account from "../pages/account";
import { IRoute } from "./types";

const accountUserRoute: IRoute = {
  path: "/account",
  name: "Account",
  component: Account,
  guard: null,
};

const homeUserRoute: IRoute = {
  path: "/home",
  name: "Home",
  component: Home,
  guard: null,
};

const accountSettingsRoute: IRoute = {
  path: "/settings",
  name: "Settings",
  component: Settings,
  guard: null,
};

export const layoutRoutesUser = [
  homeUserRoute,
  accountUserRoute,
  accountSettingsRoute,
];
