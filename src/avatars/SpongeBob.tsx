// SpongeBob.tsx
import SpongeBobs from "../images/fileSpongebob.png";
import SpongebobHover from "../images/revealSpongebob.png";

const SpongeBob = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={SpongeBobs}
        alt="SpongeBob SquarePants"
        className="object-contain"
      />
      <img
        src={SpongebobHover}
        alt="Spongebob Hover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

    </div>
  );
};

export default SpongeBob;