import DoraImage from "../images/fileDora.png";
import DoraHover from "../images/revealDora.png";

const DoraAvatar = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <img
        src={DoraImage}
        alt="Dora the Explorer"
        className="object-contain"
      /> 
      <img
        src={DoraHover}
        alt="Dora Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
};

export default DoraAvatar;