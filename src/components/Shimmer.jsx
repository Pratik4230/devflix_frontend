import React from 'react';

const Shimmer = () => {
  return (
    <div className="space-y-4 p-4">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
          
            <div className="bg-gray-300 h-48 w-full rounded-lg"></div>

            
            <div className="mt-2 bg-gray-300 h-4 w-3/4 rounded"></div>

           
            <div className="mt-2 bg-gray-300 h-3 w-full rounded"></div>
            <div className="mt-2 bg-gray-300 h-3 w-5/6 rounded"></div>

            
            <div className="mt-4 flex space-x-2">
              <div className="bg-gray-300 h-3 w-1/4 rounded"></div>
              <div className="bg-gray-300 h-3 w-1/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;
