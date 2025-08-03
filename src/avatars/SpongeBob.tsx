// SpongeBob.tsx
import SpongeBobs from "../images/SpongeBob_SquarePants_character.png";

const SpongeBob = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <img
        src={SpongeBobs}
        alt="SpongeBob SquarePants"
        className="h-4/5 w-auto object-contain"
      />
    </div>
  );
};

export default SpongeBob;