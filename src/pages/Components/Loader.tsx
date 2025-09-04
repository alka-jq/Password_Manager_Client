import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="relative w-1/2 h-[100px] overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 0.6}s` }}
          className="absolute bottom-[25px] w-10 h-[50px] bg-gradient-to-r from-[#0e2f6d] to-[#081a3a] rounded animate-flyRight opacity-0"
        >
          {/* White lines inside file */}
          <div className="absolute top-[6px] left-[6px] w-[28px] h-[4px] bg-white rounded" />
          <div className="absolute top-[13px] left-[6px] w-[18px] h-[4px] bg-white rounded" />
        </div>
      ))}
    </div>
  );
};

export default Loader;