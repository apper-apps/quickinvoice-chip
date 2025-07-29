import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <ApperIcon 
          name="FileText" 
          className="absolute inset-0 m-auto w-6 h-6 text-primary/60" 
        />
      </div>
      <p className="mt-4 text-secondary text-sm font-medium">{message}</p>
      
      {/* Skeleton placeholders */}
      <div className="w-full max-w-4xl mt-8 space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        
        <div className="animate-pulse">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;