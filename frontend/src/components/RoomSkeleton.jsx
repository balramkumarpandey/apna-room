import React from 'react';

const RoomSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-full animate-pulse">
      <div className="h-64 bg-gray-200" />
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-4" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
        <div className="pt-4 border-t border-gray-100 flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RoomSkeleton;