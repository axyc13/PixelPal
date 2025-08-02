// src/components/CardComponent.tsx
import React from 'react';

interface CardComponentProps {
  title?: string;
  children?: React.ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({ title = 'name', children }) => {
  return (
    <div className="inline-block text-center font-mono">
      <div className="border-2 border-black px-4 py-2 mb-2 text-lg font-bold">
        {title}
      </div>
      <div className="relative bg-white border-2 border-black rounded-2xl w-64 h-72 p-4 box-border">
        <div className="border-2 border-black rounded-xl w-full h-full">
          {children}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xl">
        </div>
      </div>
    </div>
  );
};

export default CardComponent;