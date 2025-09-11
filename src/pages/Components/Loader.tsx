import React from "react";

import logo from '../../assets/images/ubs icons/2-removebg-preview.png';
const Loader: React.FC = () => {
  return (
    <div className="relative w-1/2 h-[100px] overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={logo}
          alt="Loading"
          style={{ animationDelay: `${i * 0.6}s`, opacity: 0, animationFillMode: 'forwards' }}
          className="absolute bottom-[25px] w-14 h-14 animate-flyRight"
          onAnimationStart={e => (e.currentTarget.style.opacity = '1')}
        />
      ))}
    </div>
  );
};

export default Loader;
