import React from 'react';
import ubmailLogo from '../../assets/images/UB_Logos/UB Logos-loading.png'; 

const PageLoader: React.FC = () => {
  return (
    <div className="font_lato_light fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      {/* Blinking Logo */}
      <img
        src={ubmailLogo}
        alt="UB Mail Logo"
        className="w-36 h-32 mb-6 animate-pulse"
      />

      {/* Loading Text with Dots */}
      <p className="text-xl font-medium text-gray-700 flex items-center space-x-2">
        <span></span>
        <AnimatedDots />
      </p>
    </div>
  );
};

// Dot animation using React state
const AnimatedDots: React.FC = () => {
  const [dots, setDots] = React.useState('');
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span>{dots}</span>;
};

export default PageLoader;
