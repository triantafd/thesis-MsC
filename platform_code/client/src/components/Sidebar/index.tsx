import React, { useState } from "react";
import logo from "../../assets/logos/LogoAUTHwhite300ppi.png";
import Divider from "./components/Divider";
import { BottomNavItems, Logout, NavItems } from "./components/NavItems";

const Sidebar: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:sticky md:top-0 w-full md:w-[13rem] md:h-screen">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-800">
        <button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? (
            <i className="text-white fas fa-bars"></i>
          ) : (
            <i className="text-white fas fa-times"></i>
          )}
        </button>
        <img src={logo} alt="Logo" className="w-16 h-16" />
        <i className="text-white far fa-user-circle"></i>
      </div>

      {/* Sidebar content */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block bg-gray-800 md:h-full`}
      >
        <div className="p-4 md:w-[13rem] md:h-screen">
          {/* Logo for medium and up */}
          <div className="hidden md:block">
            <img src={logo} alt="Logo" className="w-32 mx-auto" />
          </div>

          {/* Nav Items */}
          <NavItems />
          {/* Divider */}
          <Divider />
          {/* Bottom Nav Items */}
          {/*   <BottomNavItems /> */}
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
