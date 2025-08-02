export default function CharacterSelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6f8] to-[#fdf0f2] flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-12">
        CHOOSE YOUR CHARACTER
      </h1>

      {/* Grid of character folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {characters.map((CharacterComponent, index) => (
          <div
            key={index}
            className="w-64 h-56 bg-[#efc8f9] border-[4px] border-blue-800 rounded-lg shadow-lg relative overflow-hidden flex items-center justify-center p-4"
          >
            <div className="absolute -top-5 left-4 w-16 h-5 bg-blue-800 rounded-t-md"></div>
            <CharacterComponent />
          </div>
        ))}
      </div>
    </div>
  );
}

// Import your characters
import Tinkerbell from "../avatars/Tinkerbell";
import SpongeBob from "../avatars/SpongeBob";
import MickeyMouse from "../avatars/MickeyMouse";
import ScoobyDoo from "../avatars/ScoobyDoo";
import Simbaa from "../avatars/Simbaa";
import DoraAvatar from "../avatars/DoraAvatar";

const characters = [Tinkerbell, SpongeBob, MickeyMouse, ScoobyDoo, Simbaa, DoraAvatar];