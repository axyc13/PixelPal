import React from 'react';
import exit from '../assets/exit.png';
import full from '../assets/full.png';
import minimise from '../assets/minimise.png';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExit = () => {
    if (location.pathname === '/') {
      window.close();
      // Fallback: if window.close() fails (most browsers), go to DonePage
      setTimeout(() => {
        if (!window.closed) {
          navigate('/done');
        }
      }, 200);
    } else if (location.pathname === '/characterselect') {
      window.close();
      // Fallback: if window.close() fails, go to DonePage
      setTimeout(() => {
        if (!window.closed) {
          navigate('/done');
        }
      }, 200);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full h-10 bg-[#7B63FF] border-2 border-black ">
      <div className="flex absolute right-3 gap-1 pt-1">
        <img src={minimise} className="w-8 h-8 cursor-pointer" alt="minimise" />
        <img src={full} className="w-8 h-8 cursor-pointer" alt="full" />
        <img src={exit} className="w-8 h-8 cursor-pointer" alt="exit" onClick={handleExit} />
      </div>
    </div>
  );
}

export default Header;
