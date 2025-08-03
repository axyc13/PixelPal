import React from 'react';

const DonePage: React.FC = () => {
  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(180deg, #EFE9D1 0%, #F8C3FE 100%)',
        minHeight: '100vh',
        minWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1288,
          height: 494,
          zIndex: 1,
        }}
      >
        <span
        className="text-6xl font-bold mb-4 font-04b"
          style={{
            fontFamily: '04b',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 151,
            lineHeight: '151px',
            textAlign: 'center',
            color: '#3B23BB',
            textShadow: '2px 2px 0 #fff, 4px 4px 0 #000',
            letterSpacing: 2,
            userSelect: 'none',
          }}
        >
          THANK YOU FOR CHATTING
        </span>
      </div>
    </div>
  );
};

export default DonePage;
