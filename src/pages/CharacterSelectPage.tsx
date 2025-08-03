import { useNavigate } from "react-router-dom";
import Tinkerbell from "../avatars/Tinkerbell";
import SpongeBob from "../avatars/SpongeBob";
import MickeyMouse from "../avatars/MickeyMouse";
import ScoobyDoo from "../avatars/ScoobyDoo";
import Simbaa from "../avatars/Simbaa";
import DoraAvatar from "../avatars/DoraAvatar";

const characters = [
  { id: "tinkerbell", name: "Tinkerbell", Component: Tinkerbell },
  { id: "spongebob", name: "SpongeBob", Component: SpongeBob },
  { id: "mickeymouse", name: "Mickey Mouse", Component: MickeyMouse },
  { id: "scoobydoo", name: "Scooby Doo", Component: ScoobyDoo },
  { id: "simbaa", name: "Simba", Component: Simbaa },
  { id: "dora", name: "Dora", Component: DoraAvatar },
];

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6f8] to-[#fdf0f2] flex flex-col items-center py-10 overflow-hidden">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 font-['Press_Start_2P'] tracking-wide text-center">
        CHOOSE YOUR CHARACTER
      </h1>

      {/* Grid of folders */}
      <div className="grid grid-cols-3 gap-y-14 gap-x-10 max-w-6xl mt-12 px-4">
        {characters.map((char) => (
          <div
            key={char.id}
            className="group relative w-72 h-52 bg-[#f2caed] border-[3px] border-black rounded-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center hover:cursor-pointer"
            onClick={() => navigate(`/chat/${char.id}`)}
          >
            {/* Folder Tab */}
            <div className="absolute -top-3 left-0 w-14 h-6 bg-[#7053ff] rounded-t-md border-l-[3px] border-t-[3px] border-r-[3px] border-black z-10" />

            {/* Character inside - silhouette by default */}
            <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
              <div className="transition-transform duration-300 grayscale contrast-200 brightness-50 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-110 w-full h-full flex items-center justify-center">
                <div className="max-w-[150px] max-h-[150px] w-full h-full">
                  <char.Component />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}