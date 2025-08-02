// Tinkerbell.tsx
import TinkerBell from "../images/Tinker_Bell_(Disney_character).png";

const Tinkerbell = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={TinkerBell}
        alt="Tinker Bell"
        className="h-4/5 w-auto object-contain"
      />
      <p className="text-sm text-gray-700 mt-1 text-center">Tinker Bell</p>
    </div>
  );
};

export default Tinkerbell;