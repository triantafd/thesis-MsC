import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/LogoAUTHwhite300ppi.png'

type Props = {
  logo: string; // URL or path to the logo image.
  navItems: { icon: string; name: string; route: string }[];
  bottomNavItems: { icon: string; name: string; route: string }[];
};



const navItems = [
  {
    name: "Home",
    icon: "fas fa-home",
    link: "/home",
    route: "/home"
  },
  {
    name: "Account",
    icon: "fas fa-user",
    link: "/profile",
    route: "/account"
  },
  {
    name: "Settings",
    icon: "fas fa-cog",
    link: "/settings",
    route: "/settings"
  }
];

const NavItems = () => (
  <ul className="space-y-2">
    {navItems.map((item, idx) => (
      <li key={idx} className="flex items-center space-x-2">
        <i className={item.icon}></i>
        <a href={item.link} className="text-gray-800">{item.name}</a>
      </li>
    ))}
  </ul>
);


const bottomNavItems = [
  {
    name: "Help",
    icon: "fas fa-question-circle",
    link: "/help",
    route: "/home"
  },
  {
    name: "Logout",
    icon: "fas fa-sign-out-alt",
    link: "/logout",
    route: "/home"
  }
];

const BottomNavItems = () => (
  <ul className="space-y-2 mt-8">
    {bottomNavItems.map((item, idx) => (
      <li key={idx} className="flex items-center space-x-2">
        <i className={item.icon}></i>
        <a href={item.link} className="text-gray-800">{item.name}</a>
      </li>
    ))}
  </ul>
);

const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#007BFF" />
    </svg>
    <span className="text-xl font-semibold text-gray-800">BrandName</span>
  </div>
);


const Sidebar: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:sticky md:top-0 w-full md:w-[16rem] md:h-screen">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-800">
        <button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen
            ? <i className="text-white fas fa-bars"></i>
            : <i className="text-white fas fa-times"></i>
          }
        </button>
        <img src={logo} alt="Logo" className="w-16 h-16" />
        <i className="text-white far fa-user-circle"></i>
      </div>

      {/* Sidebar content */}
      <div
        className={`${isOpen ? 'block' : 'hidden'
          } md:block bg-gray-800 md:h-full`}
      >
        <div className="p-4">
          {/* Logo for medium and up */}
          <div className="hidden md:block">
            <img src={logo} alt="Logo" className="w-32 mx-auto" />
          </div>

          {/* Nav Items */}
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

          {/* Divider */}
          <hr className="my-4 border-t border-gray-700" />

          {/* Bottom Nav Items */}
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
        </div>

      </div>
    </div>
  );
};

export default Sidebar
