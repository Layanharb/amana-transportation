import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-black text-white max-w-8xl mx-auto shadow-md">
      <div className="font-bold text-lg">Amana Logo</div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Menu</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
