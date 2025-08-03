// src/pages/ChatWithCharacterPage.tsx
import { useParams } from "react-router-dom";
import CharacterVoiceChat from "../components/CharacterVoiceChat";

const ChatWithCharacterPage = () => {
  const { characterId } = useParams();

  return (
    <div className="p-4">
      <CharacterVoiceChat character={characterId} />
    </div>
  );
};

export default ChatWithCharacterPage;
