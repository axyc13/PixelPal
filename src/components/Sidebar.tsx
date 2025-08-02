import React from 'react';

const Sidebar = () => (
  <aside className="fixed left-0 top-0 h-full" style={{ width: 467, minHeight: '100vh', zIndex: 50 }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="467"
      height="100vh"
      viewBox="0 0 467 1016"
      fill="none"
      style={{ display: 'block', height: '100vh', width: '100%' }}
    >
      <path
        d="M221.129 1.5L311.447 86.9873L311.881 87.3975H465.5V1078.5H1.5V1.5H221.129Z"
        fill="#EFE9D1"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
    {/* Sidebar content will go here */}
  </aside>
);

export default Sidebar;
