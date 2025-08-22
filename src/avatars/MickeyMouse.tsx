// MickeyMouse.tsx
import MickyImg from "../images/fileMickeyMouse.png";
import MickeyHover from "../images/revealMickeyMouse.png";

const MickeyMouse = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={MickyImg}
        alt="Mickey Mouse"
        className="object-contain"
      />
      <img
        src={MickeyHover}
        alt="Mickey Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
};

export default MickeyMouse;