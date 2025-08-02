import React from 'react'
import './global.css'
import googleLogo from './assets/google.png'

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-[#EBE9D2]">
        <h1 className="text-9xl font-04b text-[#3B23BB] pb-25">
          PIXELPAL
        </h1>
        <div className = "bg-[#7B63FF] text-[#fff] font-pixel p-3 rounded border-2 border-black pr-5 pl-5">
          <img src={googleLogo} className="w-6 h-6 inline mr-2" alt="Google Logo" />
          <button >Sign Up With Google</button>
        </div>
      </div>
    </>
  )
}

export default App;