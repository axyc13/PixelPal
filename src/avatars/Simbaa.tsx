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
    </div>
  );
};

export default Simbaa;