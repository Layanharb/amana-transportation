
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white mt-6 border-t-4 border-indigo-600">
      <p>&copy; 2025 Amana. All rights reserved.</p>
      <div className="mt-4">
        <a href="#" className="hover:text-yellow-300 transition-colors duration-300">Privacy Policy</a> | 
        <a href="#" className="hover:text-yellow-300 transition-colors duration-300">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
