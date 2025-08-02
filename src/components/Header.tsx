import React from 'react'
import exit from '../assets/exit.png'
import full from '../assets/full.png'
import minimise from '../assets/minimise.png'


function header() {
  return (
    <div className = "w-full h-10 bg-[#7B63FF] px-4 border-b-2"> 
        <div className="flex absolute right-3 gap-1 pt-1">
            <img src={minimise} className="w-8 h-8 cursor-pointer" alt="minimise" />
            <img src={full} className="w-8 h-8 cursor-pointer" alt="full" />
            <img src={exit} className="w-8 h-8 cursor-pointer" alt="exit" />
        </div>
    </div>
  )
}

export default header
