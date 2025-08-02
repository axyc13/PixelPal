import MickyImg from "../images/MickeyMouse.webp"

const MickeyMouse = () => {
 return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={MickyImg}
        alt="Dora the Explorer"
        className="w-64 bg-transparent"
      />
      <p className="text-lg font-semibold text-gray-700">Micky Mouse</p>
    </div>
  );
}

export default MickeyMouse