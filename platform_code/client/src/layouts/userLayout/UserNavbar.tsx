import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

type UserNavbarProps = {
  brandText: string;
  userName: string;
};

const UserNavbar: React.FC<UserNavbarProps> = ({ brandText, userName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleSignout } = useAuth();

  return (
    <>
      <div className="bg-gray-600 p-8">
        <div className="w-full px-8 mx-auto flex justify-between items-center">
          <span className="text-white text-xl">{brandText}</span>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-white"
              >
                <div className="rounded-full items-center">
                  <i className="text-white far fa-user-circle"></i>
                </div>
                <span>{userName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {dropdownOpen && (
        // Overlay
        <div
          className="fixed top-0 left-0 w-full h-full"
          onClick={() => setDropdownOpen(false)}
        >
          {/* Dropdown Modal positioned below the user icon */}
          <div
            className="absolute right-8 top-16 w-56 rounded-md shadow-lg bg-white z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-md bg-white shadow-xs">
              <div className="py-1">
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="text-black fas fa-user-circle pr-1"></i>
                  My account
                </Link>

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="text-black fas fa-cog pr-1"></i>
                  Settings
                </Link>

                <Link
                  to="/"
                  className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200"
                  onClick={() => {
                    handleSignout();
                    setDropdownOpen(false);
                  }}
                >
                  <i className="text-black fas fa-sign-out-alt pr-1"></i>
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
