import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';

interface IHeaderProps { }

const Header: React.FC<IHeaderProps> = (props) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { login } = useAuth();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <nav className="container relative mx-auto p-6">
        {/*       <!-- Flex Container For Nav Items --> */}
        <div className="flex items-center justify-between space-x-20 my-6">
          {/*   <!-- Logo --> */}
          <div className="z-30">
            <img
              src={
                isNavOpen
                  ? 'https://www.auth.gr/wp-content/uploads/logogr.png'
                  : 'https://www.auth.gr/wp-content/uploads/logogr.png'
              }
              alt=""
              id="logo"
              className="w-44 md:ml-3"
            />
          </div>

          {/*   <!-- Menu Items --> */}
          <div className="hidden items-center space-x-10 uppercase text-grayishBlue md:flex">
            <a href="#features" className="tracking-widest hover:text-softRed">
              Features
            </a>
            <a href="#download" className="tracking-widest hover:text-softRed">
              Download
            </a>
            <a href="#faq" className="tracking-widest hover:text-softRed">
              FAQ
            </a>

            <a
              href="/"
              className="px-8 py-2 text-slate-500 bg-softRed border-2 border-softRed rounded-lg shadow-md hover:text-softRed hover:bg-white"
              onClick={() => login}
            >
              Login
            </a>
          </div>
          {/*    <!-- Hamburger Button --> */}
          <button
            id="menu-btn"
            className={`z-30 block md:hidden focus:outline-none hamburger ${isNavOpen ? 'open' : ''
              }`}
            onClick={toggleNav}
          >
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </button>
        </div>
        {/*  <!-- Mobile Menu --> */}
        <div
          id="menu"
          className={`fixed inset-0 z-20 flex-col items-center self-end w-full h-full m-h-screen px-6 py-1 pt-24 pb-4 tracking-widest text-white uppercase divide-y divide-gray-500 opacity-90 bg-veryDarkBlue ${isNavOpen ? 'flex  md:hidden' : 'hidden'
            }`}
        >
          <div className="w-full py-3 text-center">
            <a href="#features" className="block hover:text-softRed">
              Features
            </a>
          </div>
          <div className="w-full py-3 text-center">
            <a href="#download" className="block hover:text-softRed">
              Download
            </a>
          </div>
          <div className="w-full py-3 text-center">
            <a href="#faq" className="block hover:text-softRed">
              FAQ
            </a>
          </div>
          <div className="w-full py-3 text-center">
            <a href="/" className="block hover:text-softRed">
              Login
            </a>
          </div>
        </div>
      </nav>

      {/*  Jumbotron  */}
      <div className="bg-gray-300 text-black font-semibold py-16 px-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="text-xl leading-tight mb-4 w-full md:w-3/4">
              <h1>
                {' '}
                Disclaimer: The logos and trademarks used in this technical
                assignment belong to their respective owners.
              </h1>
              <p>
                I do not claim ownership or any rights to these logos. They have
                been used solely for the purpose of this assignment.
              </p>
              <p>
                {' '}
                Create a React project hosted at (stackblitz / bitbucket /
                github) using Disney REST API to create a dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <LoginForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    </div>
  );
};

export default Header;
