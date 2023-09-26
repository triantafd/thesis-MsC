import React from 'react';

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = (props) => {
  return (
    <footer className="bg-black">
      {/*   <-- Container --> */}
      <div className="container max-w-6xl py-14 mx-auto">
        {/*   <-- Footer Flex Container --> */}
        <div className="flex flex-col items-center space-y-10 md:flex-row md:space-y-0 md:justify-between md:items-start">
          {/*  <-- Menu & Logo Container --> */}

          {/*   <-- Logo --> */}
          <div className="h-8">
            <img
              src="https://www.auth.gr/wp-content/uploads/logogr.png"
              alt=""
              className="bg-white w-44 md:ml-3 rounded-lg"
            />
          </div>

          {/*        <!-- Menus Container --> */}
          <div className="flex flex-col space-y-16 md:space-x-20  md:flex-row md:space-y-0">
            {/*        <!-- Menu 1 --> */}
            <div className="flex flex-col items-center w-full md:items-start">
              <div className="h-10 group">
                <div className="flex mb-5 font-bold text-white capitalize text-start  group-hover:border-b">
                  Main Features
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 md:items-start text-start">
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Object Detection
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Further Classification after Detection
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Webapp
                </a>
              </div>
            </div>

            {/*     <!-- Menu 2 --> */}
            <div className="flex flex-col items-center w-full md:items-start">
              <div className="h-10 group">
                <div className="flex mb-5 font-bold text-white capitalize text-start  group-hover:border-b">
                  Main Features
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 md:items-start text-start">
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Blog
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Developers
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Support
                </a>
              </div>
            </div>

            {/*        <!-- Menu 3 --> */}
            <div className="flex flex-col items-center w-full md:items-start">
              <div className="h-10 group">
                <div className="flex mb-5 font-bold text-white capitalize text-start group-hover:border-b">
                  Main Features
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 md:items-start text-start">
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Blog
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Developers
                </a>
                <a
                  href="/"
                  className="capitalize text-softViolet hover:text-primaryCyan text-start"
                >
                  Support
                </a>
              </div>
            </div>
          </div>

          {/*     <!-- Social Container --> */}
          <div className="flex space-x-4">
            {/*  <!-- Facebook Icon (Icon 1) --> */}
            <div className="h-8">
              <a href="/">
                <img
                  src="images/icon-facebook.svg"
                  alt=""
                  className="h-6 filterIconCyan"
                />
              </a>
            </div>
            {/*  <!-- X/Linkedin Icon (Icon 2) --> */}
            <div className="h-8">
              <a href="/">
                <img
                  src="images/icon-linkedin.svg"
                  alt=""
                  className="h-6 filterIconCyan"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
