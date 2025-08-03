// ScoobyDoo.tsx
import ScoobyImg from "../images/a1b3db49a235f7991f0ce3525d39253a.png";

const ScoobyDoo = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={ScoobyImg}
        alt="Scooby Doo"
        className="h-4/5 w-auto object-contain"
      />
    </div>
  );
};

export default ScoobyDoo;