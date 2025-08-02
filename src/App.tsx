import React, { useState } from 'react';
import './global.css';
import googleLogo from './assets/google.png';
import star from './assets/star.png';
import cursor from './assets/cursor.png';
import speech from './assets/speech.png';
import trail from './assets/trail.png';
import { signInWithGoogleAndStoreUser } from './authService';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CharacterSelectPage from "./pages/CharacterSelectPage";
import Header from './components/Header';

function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await signInWithGoogleAndStoreUser();
      setUser(userData);
      navigate('/characterselect');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-b from-[#EBE9D2] to-[#F8C2FF]">
        <div className="relative inline-block">
          <img
            src={star}
            alt="Star"
            className="absolute -top-22 -left-14 w-15 h-15"
          />
          <img
            src={star}
            alt="Star"
            className="absolute -top-12 -left-3 w-15 h-15"
          />
          <div className="absolute -top-40 -right-45">
            <div className="relative w-45 h-25">
              <img
                src={speech}
                alt="speech"
                className="w-full h-full object-contain"
              />
              <p className="font-pixel absolute top-6 left-5.5 text-s">
                talk to your favs
              </p>
            </div>
          </div>
          <h1 className="text-8xl font-04b text-[#3B23BB] pl-15 pb-20">
            PIXELPAL
          </h1>
          <div className="absolute -bottom-42 -left-60">
            <div className="relative w-58 h-25">
              <img
                src={speech}
                alt="speech"
                className="w-full h-full object-contain scale-x-[-1]"
              />
              <p className="font-pixel absolute top-5.5 left-7.5 text-m">
                revist your childhood!
              </p>
            </div>
          </div>
          <img
            src={cursor}
            alt="cursor"
            className="absolute -bottom-20 -right-20 w-30 h-30"
          />
          <img
            src={trail}
            alt="trail"
            className="absolute -bottom-62 -right-89 w-80 h-60"
          />
        </div>
        {user ? (
          <div className="text-center">
            <img src={user.photoURL} 
              alt="User" 
              className="w-25 h-25 rounded-full mx-auto mb-2 border-2 border-black" 
            />
            <div className="text-lg font-bold bg-[#7B63FF] text-[#fff] font-pixel p-3 rounded border-2 border-black pr-5 pl-5">
              Welcome, {user.displayName || user.email}!
            </div>
          </div>
        ) : (
          <div className="bg-[#7B63FF] text-[#fff] font-pixel p-3 rounded border-2 border-black pr-5 pl-5 hover:cursor-pointer">
            <img src={googleLogo} 
              alt="Google Logo"
              className="w-6 h-6 inline mr-2"
            />
            <button className = "hover:cursor-pointer" onClick={handleGoogleSignIn} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign Up With Google'}
            </button>
          </div>
        )}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/characterselect" element={<CharacterSelectPage />} />
      </Routes>
    </>
  );
}

export default App;