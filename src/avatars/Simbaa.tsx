// Simbaa.tsx
import SimbaImg from "../images/Simba-PNG-Image-Background.png";

const Simbaa = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={SimbaImg}
        alt="Simba"
        className="h-4/5 w-auto object-contain"
      />
      <p className="text-sm text-gray-700 mt-1 text-center">Simba</p>
    </div>
  );
};

export default Simbaa;