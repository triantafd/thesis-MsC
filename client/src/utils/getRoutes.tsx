import React from 'react';
import { Route, Navigate } from "react-router-dom";
import { IParentRoute, IRoute } from "../routes/types";

export const getRoutes = (
  Layout: React.ComponentType<{ children?: React.ReactNode }>,
  routes: (IParentRoute | IRoute)[]
) =>
  routes.map((route, index) => {
    if ("children" in route) {
      // This block will run for IParentRoute type routes.
      return route.children.map((element, childIndex) => {
        if ("redirectTo" in element) {
          return (
            <Route
              key={childIndex}
              path={element.path}
              element={<Navigate to={element.redirectTo} replace />}
            />
          );
        }

        // Check if the 'component' property exists in the 'element' object.
        if ("component" in element) {
          const ChildGuard = element.guard || React.Fragment;
          const ElementComponent = element.component;

          return (
            <Route
              key={childIndex}
              path={element.path}
              element={
                <Layout>
                  <ChildGuard>
                    <ElementComponent />
                  </ChildGuard>
                </Layout>
              }
            />
          );
        }

        return null; // Return null for cases that don't match the above conditions.
      });
    } else if ("component" in route) {
      // This block will run for IRoute type routes.
      const Guard = route.guard || React.Fragment;
      const RouteComponent = route.component;

      return (
        <Route
          key={index}
          path={route.path}
          element={
            <Layout>
              <Guard>
                <RouteComponent />
              </Guard>
            </Layout>
          }
        />
      );
    } else {
      return null; // Return null for cases that don't match any of the above conditions.
    }
  });
