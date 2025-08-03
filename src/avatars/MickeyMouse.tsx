// MickeyMouse.tsx
import MickyImg from "../images/MickeyMouse.webp";

const MickeyMouse = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={MickyImg}
        alt="Mickey Mouse"
        className="h-4/5 w-auto object-contain"
      />
    </div>
  );
};

export default MickeyMouse;