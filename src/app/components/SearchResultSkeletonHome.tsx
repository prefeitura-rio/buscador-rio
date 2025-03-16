const SearchResultSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
              
              {/* Breadcrumb skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                <span className="text-gray-300">{'>'}</span>
                <div className="h-3 bg-gray-200 rounded-md w-12 animate-pulse"></div>
                <span className="text-gray-300">{'>'}</span>
                <div className="h-3 bg-gray-200 rounded-md w-14 animate-pulse"></div>
              </div>
            </div>
            
            {/* External link icon skeleton */}
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          {index < 2 && <hr className="border-gray-200 my-2" />}
        </div>
      ))}
    </div>
  );
};

export default SearchResultSkeleton; 