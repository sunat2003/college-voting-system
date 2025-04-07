import React from 'react';
import NotFound from '../components/lottie/404NotFound';

const NotFound404 = () => {
  return (
    <div className="flex flex-col items-center h-screen w-screen justify-center">
      <h1 className="text-2xl text-gray-500">404 | Page Not Found</h1>
      <NotFound/>
    </div>
  )
}

export default NotFound404;
