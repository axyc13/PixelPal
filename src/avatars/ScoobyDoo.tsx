import ScoobyImg from "../images/a1b3db49a235f7991f0ce3525d39253a.png"
const ScoobyDoo = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={ScoobyImg}
        alt="Dora the Explorer"
        className="w-64 bg-transparent"
      />
      <p className="text-lg font-semibold text-gray-700">Scooby Dooby</p>
    </div>
  );
}

export default ScoobyDoo