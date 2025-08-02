import SpongeBobs from "../images/SpongeBob_SquarePants_character.png"

const SpongeBob = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={SpongeBobs}
        alt="Dora the Explorer"
        className="w-64"
      />
      <p className="text-lg font-semibold text-gray-700">SpongeBob SquarePants</p>
    </div>
  );
}

export default SpongeBob