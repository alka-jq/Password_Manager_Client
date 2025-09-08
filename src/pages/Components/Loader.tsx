import React from "react";
import loaderImage from '../../assets/images/UB_Logos/Loader_Pass.png';

const Loader: React.FC = () => {
  return (
    <div className="relative w-1/2 h-[100px] overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={loaderImage}
          alt="Loading"
          style={{ animationDelay: `${i * 0.6}s`, opacity: 0, animationFillMode: 'forwards' }}
          className="absolute bottom-[25px] w-12 h-12 animate-flyRight"
          onAnimationStart={e => (e.currentTarget.style.opacity = '1')}
        />
      ))}
    </div>
  );
};

export default Loader;
