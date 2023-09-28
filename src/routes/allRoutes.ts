import Login from "../pages/auth/Login";

type Guard = React.ComponentType<{ children?: React.ReactNode }>;

export interface IRoute {
  path: string;
  name?: string; // because not every route might have a name property
  component: React.ComponentType<any>; // Assuming it's a React component
  guard: Guard | null; // The guard type is not specified, so I've used any for now
}

export interface IRedirectRoute {
  path: string;
  name: string;
  redirectTo: string;
  guard: Guard | null;
}

export type ChildRoute = IRoute | IRedirectRoute;

export interface IParentRoute {
  id: string;
  path: string;
  icon: string;
  guard: any | null;
  children: ChildRoute[];
}

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




export const layoutRoutesUser = [

];

export { authRoutes };
