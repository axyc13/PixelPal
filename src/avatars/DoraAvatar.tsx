import DoraImage from "../images/Dora_photo1.webp";
const DoraAvatar = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={DoraImage}
        alt="Dora the Explorer"
        className="w-64"
      />
      <p className="text-lg font-semibold text-gray-700">Dora the Explorer</p>
    </div>
  );
};

export default DoraAvatar;
