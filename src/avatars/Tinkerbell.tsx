// Tinkerbell.tsx
import TinkerBell from "../images/fileTinkerbell.png";
import TinkerbellHover from "../images/revealTinkerbell.png";

const Tinkerbell = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={TinkerBell}
        alt="Tinker Bell"
        className="object-contain"
      />
      <img
        src={TinkerbellHover}
        alt="Tinkerbell Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
};

export default Tinkerbell;