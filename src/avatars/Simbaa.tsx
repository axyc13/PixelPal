import SimbaImg from "../images/Simba-PNG-Image-Background.png"

const Simbaa = () => {
   return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={SimbaImg}
        alt="Dora the Explorer"
        className="w-64"
      />
      <p className="text-lg font-semibold text-gray-700">Simba</p>
    </div>
  );
}

export default Simbaa