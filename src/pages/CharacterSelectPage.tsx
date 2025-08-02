import { useNavigate } from "react-router-dom";

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        You are on the Character Page!
      </h1>
      <button
        className="bg-[#7B63FF] text-white font-bold py-3 px-6 rounded border-2 border-black hover:bg-[#5a4bb7] transition mb-2"
        onClick={() => navigate("/chatroom")}
      >
        Go to Chatroom (Temporary)
      </button>
    </div>
  );
}