import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center he-full">
      <div className="w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
      <p className="ml-5">Loading...</p>
    </div>
  );
};

export default Loading;
