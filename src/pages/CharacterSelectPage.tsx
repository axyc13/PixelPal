import { useNavigate } from "react-router-dom";
import MickeyMouse from "../avatars/MickeyMouse";
import Tinkerbell from "../avatars/Tinkerbell";
import SpongeBob from "../avatars/SpongeBob";
import ScoobyDoo from "../avatars/ScoobyDoo";
import Simbaa from "../avatars/Simbaa";
import DoraAvatar from "../avatars/DoraAvatar";

const characters = [
  { name: "Mickey", component: MickeyMouse },
  { name: "Tinker Bell", component: Tinkerbell },
  { name: "SpongeBob", component: SpongeBob },
  { name: "Scooby-Doo", component: ScoobyDoo },
  { name: "Simba", component: Simbaa },
  { name: "Dora", component: DoraAvatar },
];

const CharacterSelectPage = () => {
  const navigate = useNavigate();

  const handleSelect = (character: string) => {
    navigate(`/chat/${character}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6f8] to-[#fdf0f2] flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-12">
        CHOOSE YOUR CHARACTER
      </h1>

      {/* Grid of character folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {characters.map(({ name, component: CharacterComponent }, index) => (
          <div
            key={index}
            onClick={() => handleSelect(name)}
            className="cursor-pointer w-64 h-56 bg-[#efc8f9] border-[4px] border-blue-800 rounded-lg shadow-lg relative overflow-hidden flex items-center justify-center p-4 hover:scale-105 transition-transform duration-200"
          >
            <div className="absolute -top-5 left-4 w-16 h-5 bg-blue-800 rounded-t-md"></div>
            <CharacterComponent />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelectPage;
