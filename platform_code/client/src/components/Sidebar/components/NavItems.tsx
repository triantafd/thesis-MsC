import React from "react";
import { Link } from "react-router-dom";
import { bottomNavItems, navItems } from "../constants";
import { useAuth } from "../../../context/authContext";

export const NavItems = () => {
  return (
    <ul className="mt-8">
      {navItems.map((item, idx) => (
        <li key={idx} className="mb-2">
          <Link
            to={item.route}
            className="flex items-center text-white hover:bg-gray-700 p-2 rounded"
          >
            <i className={`mr-2 ${item.icon}`}></i>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const BottomNavItems = () => (
  <ul>
    {bottomNavItems.map((item, idx) => (
      <li key={idx} className="mb-2">
        <Link
          to={item.route}
          className="flex items-center text-white hover:bg-gray-700 p-2 rounded"
        >
          <i className={`mr-2 ${item.icon}`}></i>
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
);

export const Logout = () => {
  const { handleSignout } = useAuth();

  return (
    <Link
      to={"/"}
      className="flex items-center text-white hover:bg-gray-700 p-2 rounded"
      onClick={() => {
        handleSignout();
      }}
    >
      <i className={`mr-2 fas fa-sign-out-alt`}></i>
      Logout
    </Link>
  );
};
