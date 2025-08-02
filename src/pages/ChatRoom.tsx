import React from "react";
import "../global.css";


const ChatRoom: React.FC = () => {
  return (
    <div className="w-screen h-screen min-h-screen min-w-full bg-[linear-gradient(180deg,_#EFE9D1_0%,_#ECD3E7_100%)] flex flex-row border-[2px] border-black overflow-hidden" style={{ boxSizing: 'border-box' }}>
      {/* Sidebar */}
      <div className="relative flex flex-col" style={{ width: 467, minWidth: 320, height: '100vh' }}>
        {/* SVG Sidebar background */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="467"
          height="100%"
          viewBox="0 0 467 1016"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >
          <g clipPath="url(#clip0_120_392)">
            <rect width="467" height="1016" fill="#7B63FF" />
            <path d="M221.129 1.5L311.447 86.9873L311.881 87.3975H465.5V1078.5H1.5V1.5H221.129Z" fill="#EFE9D1" stroke="black" strokeWidth="3" />
            <rect x="44.5" y="143.5" width="389" height="793" fill="#EFE9D1" />
            <rect x="44.5" y="143.5" width="389" height="793" stroke="black" strokeWidth="3" />
          </g>
          <rect x="1" y="1" width="465" height="1014" stroke="black" strokeWidth="2" />
          <defs>
            <clipPath id="clip0_120_392">
              <rect width="467" height="1016" fill="white" />
            </clipPath>
          </defs>
        </svg>
        {/* Character and Back buttons with extended underline */}
        <div className="absolute left-15 top-5 flex flex-col z-10 w-full" style={{ height: 56 }}>
          <div className="flex flex-row items-start">
            <button className="font-bold text-3xl px-6 py-1 border-b-2 border-black" style={{ fontFamily: 'O4B3O, monospace', borderTopLeftRadius: 0, borderTopRightRadius: 12 }}>Character</button>
            <button className="font-bold text-3xl px-10 py-1 text-white" style={{ fontFamily: 'O4B3O, monospace', borderTopRightRadius: 12 }}>Back</button>
          </div>
          {/* Short underline only under the buttons */}
          <div className="border-b-2 border-black" style={{ width: 'calc(100% - 180px)', marginTop: '-2px', marginLeft: '0px', maxWidth: 330 }}></div>
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 border-l-[2px] border-black">
        {/* Chat messages area */}
        <div className="mt-8 mx-10 h-[340px] border-[2px] border-black bg-white" style={{ minHeight: 340 }} />
        {/* Toolbar */}
        <div className="flex items-center px-10 py-2 border-t-[2px] border-black gap-8" style={{ fontFamily: 'O4B3O, monospace', minHeight: 55 }}>
          <span className="font-bold text-lg">A</span>
          <span className="text-2xl align-middle">😀</span>
          <span className="text-lg align-middle">▼</span>
          <span className="font-bold text-lg">|</span>
          <span className="text-2xl text-[#7B63FF] align-middle">🖼️</span>
          <span className="text-lg align-middle">▼</span>
          <span className="font-bold text-lg">|</span>
          <span className="font-bold text-lg">B</span>
          <span className="italic text-lg">I</span>
          <span className="underline text-lg">U</span>
          <span className="font-bold text-lg">|</span>
          <span className="text-lg font-bold">I</span>
          <span className="text-2xl text-[#F77B7B] align-middle">💬</span>
          <span className="text-2xl align-middle">Q</span>
          <span className="text-2xl text-[#7B63FF] align-middle">🖌️</span>
        </div>
        {/* Input area */}
        <div className="flex items-center px-10 py-4 bg-[#EFE9D1] border-t-0 border-black" style={{ minHeight: 120 }}>
          <div className="flex-1 h-[90px] border-[2px] border-black bg-white" />
          <button className="ml-6 w-40 h-[90px] bg-[#7B63FF] text-black font-bold rounded-none border-[2px] border-black text-xl" style={{ fontFamily: 'O4B3O, monospace' }}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
