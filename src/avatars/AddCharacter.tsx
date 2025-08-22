import React from 'react'
import Character from "../images/fileCharacter.png";
import CharacterHover from "../images/revealCharacter.png";

function AddCharacter() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={Character}
        alt="Add Character"
        className="object-contain"
      /> 
      <img
        src={CharacterHover}
        alt="Add Character Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  )
}

export default AddCharacter
