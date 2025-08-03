import { useNavigate } from "react-router-dom";
import Tinkerbell from "../avatars/Tinkerbell";
import SpongeBob from "../avatars/SpongeBob";
import MickeyMouse from "../avatars/MickeyMouse";
import ScoobyDoo from "../avatars/ScoobyDoo";
import Simbaa from "../avatars/Simbaa";
import DoraAvatar from "../avatars/DoraAvatar";
import clouds from "../assets/clouds.png";
import "../global.css";
import AddCharacter from "../avatars/AddCharacter";
import Header from "../components/Header";

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
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-b from-[#EFE9D1] to-[#ECD3E8] flex flex-col items-center py-10 overflow-hidden">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#3B23BB] font-04b pt-3 tracking-wide text-center">
        CHOOSE YOUR CHARACTER
      </h1>
      <img src = {clouds} alt="Clouds" className="absolute top-40 right-0 w-80 h-80" />
      <img src = {clouds} alt="Clouds" className="absolute top-40 left-0 w-80 h-80 scale-x-[-1]" />
      {/* Grid of folders */}
      <div className="grid grid-cols-3 pt-20 transform scale-150">
        {characters.map((char) => (
          <div
            key={char.id}
            className="group relative w-full h-full rounded-sm flex items-center justify-center hover:cursor-pointer"
            onClick={() => navigate(`/chat/${char.id}`)}
          >
            {/* Character inside - silhouette by default */}
            <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
              <div className="transition-transform duration-300 group-hover:scale-110 w-full h-full flex items-center justify-center">
                <div className="max-w-[150px] max-h-[150px] w-full h-full">
                  <char.Component />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Empty column 1 */}
        <div />

        {/* Centered AddCharacter — must include .group wrapper like others */}
        <div className="group relative w-full h-full rounded-sm flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
            <div className="transition-transform duration-300 hover:cursor-pointer group-hover:scale-110 w-full h-full flex items-center justify-center">
              <div className="max-w-[150px] max-h-[150px] w-full h-full">
                <AddCharacter />
              </div>
            </div>
          </div>
        </div>

        {/* Empty column 3 */}
        <div />
      </div>
    </div>
    </>
  );
}