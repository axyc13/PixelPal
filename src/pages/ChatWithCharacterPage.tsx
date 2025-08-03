import { useParams } from "react-router-dom";
import CharacterVoiceChat from "../components/CharacterVoiceChat";


const ChatWithCharacterPage = () => {
  const { character } = useParams();

  return (
    <div className="p-4">
      <CharacterVoiceChat character={character} />
    </div>
  );
};

export default ChatWithCharacterPage;
