import { useState } from 'react';
import './global.css';
import googleLogo from './assets/google.png';
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
    <div className="flex flex-col items-center justify-center h-screen bg-[#EBE9D2]">
      <h1 className="text-9xl font-04b text-[#3B23BB] pb-25">
        PIXELPAL
      </h1>
      {user ? (
        <div className="text-center">
          <img src={user.photoURL} alt="User" className="w-25 h-25 rounded-full mx-auto mb-2 border-2 border-black" />
          <div className="text-lg font-bold bg-[#7B63FF] text-[#fff] font-pixel p-3 rounded border-2 border-black pr-5 pl-5">Welcome, {user.displayName || user.email}!</div>
        </div>
      ) : (
        <div className="bg-[#7B63FF] text-[#fff] font-pixel p-3 rounded border-2 border-black pr-5 pl-5 hover:cursor-pointer">
          <img src={googleLogo} className="w-6 h-6 inline mr-2" alt="Google Logo" />
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

