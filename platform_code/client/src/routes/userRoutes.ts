/** @format */

import ImageUploadSelector from "../pages/Detection";
import Settings from "../pages/Settings";
import Account from "../pages/Account";
import MyImageFolders from "../pages/MyImageFolders";
import ImageGallery from "../pages/MyImageFolders/ImageGallery";
import { IRoute, IParentRoute } from "./types";

const accountUserRoute: IRoute = {
  path: "/account",
  name: "Account",
  component: Account,
  guard: null,
};

const homeUserRoute: IRoute = {
  path: "/detection",
  name: "Detection",
  component: ImageUploadSelector,
  guard: null,
};

const myFoldersRoute: IParentRoute = {
  id: "My folder",
  path: "/myFolders",
  icon: "",
  guard: null,
  children: [
    {
      path: "/myFolders",
      name: "My Image Folder",
      component: MyImageFolders,
      guard: null,
    },
    {
      path: "/myFolders/:label",
      name: "Image Gallery",
      component: ImageGallery,
      guard: null,
    },
  ],
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
  myFoldersRoute,
];
