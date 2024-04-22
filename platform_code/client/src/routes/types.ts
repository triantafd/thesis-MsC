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