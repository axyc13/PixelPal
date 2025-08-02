import DoraImage from "../images/Dora_photo1.webp";

const DoraAvatar = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={DoraImage}
        alt="Dora the Explorer"
        className="h-4/5 w-auto object-contain"
      />
      <p className="text-sm text-gray-700 mt-1 text-center">Dora the Explorer</p>
    </div>
  );
};

export default DoraAvatar;
