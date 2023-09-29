// NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound404: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900">
            404 - Page Not Found
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound404;
