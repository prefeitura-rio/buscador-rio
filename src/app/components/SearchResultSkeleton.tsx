import React from 'react';

const SearchResultSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              
              {/* Breadcrumb skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <span className="text-gray-300">{'>'}</span>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <span className="text-gray-300">{'>'}</span>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              
              <hr className="border-gray-200 my-4" />
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultSkeleton; 