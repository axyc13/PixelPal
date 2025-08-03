import DoraImage from "../images/Dora_photo1.webp";

const DoraAvatar = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <img
        src={DoraImage}
        alt="Dora the Explorer"
        className="h-4/5 w-auto object-contain"
      />
    </div>
  );
};

export default DoraAvatar;