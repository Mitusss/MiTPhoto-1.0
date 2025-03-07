
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { History, Camera } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/history';

  return (
    <header className="w-full animate-fade-in">
      <div className="container px-4 py-6 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mitphoto-400 to-mitphoto-600 flex items-center justify-center shadow-elegant">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-mitphoto-800 to-mitphoto-600 bg-clip-text text-transparent">
            MitPhoto
          </h1>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link 
            to={isHome ? "/history" : "/"} 
            className="p-2 rounded-full transition-all duration-300 hover:bg-secondary flex items-center justify-center"
            aria-label={isHome ? "View History" : "Go Home"}
          >
            {isHome ? (
              <History className="h-5 w-5 text-mitphoto-600" />
            ) : (
              <Camera className="h-5 w-5 text-mitphoto-600" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
