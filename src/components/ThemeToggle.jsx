
import { SunMoon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
    <button onClick={toggleTheme} className= {`p-1.5 m-1 flex rounded-full ${isDarkMode ? `bg-blue-50 text-black` : `bg-black text-white`}  `}>
    <SunMoon size={25} /> 
    </button>
    
    </>
  );
};

export default ThemeToggle;
