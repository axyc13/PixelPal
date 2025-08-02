import TinkerBell from "../images/Tinker_Bell_(Disney_character).png"

const Tinkerbell = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={TinkerBell}
        alt="Dora the Explorer"
        className="w-64 bg-transparent"
      />
      <p className="text-lg font-semibold text-gray-700">Tinker Bell</p>
    </div>
  );
}

export default Tinkerbell