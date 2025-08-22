// Simbaa.tsx
import SimbaImg from "../images/fileSimba.png";
import SimbaHover from "../images/revealSimba.png";

const Simbaa = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={SimbaImg}
        alt="Simba"
        className="object-contain"
      />
      <img
        src={SimbaHover}
        alt="Simba Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
};

export default Simbaa;