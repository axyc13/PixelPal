
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Header from "./Header";

const characterPrompts: Record<string, string> = {
  mickey:
    "You are Mickey Mouse. Speak with excitement and joy. Use phrases like 'Hot dog!', 'Oh boy!', and always be cheerful and helpful.",
  "tinkerbell":
    "You are Tinker Bell, a magical and mischievous fairy. Speak with sparkle and grace. Use words like 'pixie dust', 'fairy magic', and show gentle curiosity.",
  spongebob:
    "You are SpongeBob SquarePants. Talk with a goofy, cheerful tone. Be overly enthusiastic and positive. Use phrases like 'I'm ready!', 'Best day ever!', and mention jellyfishing or Krabby Patties.",
  "scooby":
    "You are Scooby-Doo, the talking Great Dane. Speak in your signature funny voice. Say 'Ruh-roh!', 'Scooby snacks', and be a little scared but brave with Shaggy.",
  simba:
    "You are Simba, the lion from The Lion King. Speak like a confident yet kind-hearted leader. Use phrases like 'Hakuna Matata', 'I must take my place in the circle of life', and show courage.",
  dora:
    "You are Dora the Explorer. Speak in a friendly and energetic tone. Use bilingual phrases like '¡Hola!' and 'Let's go!'. Ask questions to engage the user and encourage exploration.",
};

const CharacterVoiceChat: React.FC = () => {
  const { characterId } = useParams();
  const location = useLocation();

  const characterName = characterId?.toLowerCase() || "mickey";

  const [chatLog, setChatLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
    }
    window.speechSynthesis.getVoices(); // Preload voices
  }, []);

  useEffect(() => {
    if (transcript) {
      console.log("🎤 Live transcript:", transcript);
    }
  }, [transcript]);

  const startListening = () => {
    resetTranscript();
    console.log("🎙️ Started listening...");
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    console.log("🛑 Stopped listening");
  };

  const handleSendToGPT = async () => {
    if (!transcript.trim()) return;

    stopListening();
    setLoading(true);
    setChatLog((prev) => [...prev, `🧒 You: ${transcript}`]);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                characterPrompts[characterName] || `You are ${characterName}. Respond accordingly.`,
            },
            {
              role: "user",
              content: transcript,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("Invalid response:", data);
        setChatLog((prev) => [...prev, "❌ Error: Invalid GPT response"]);
        return;
      }

      const reply = data.choices[0].message.content.trim();
      setChatLog((prev) => [...prev, `🧚 ${characterName}: ${reply}`]);
      speak(reply);
    } catch (err) {
      console.error("Error from GPT:", err);
      setChatLog((prev) => [...prev, "❌ Error getting response"]);
    } finally {
      setLoading(false);
      resetTranscript();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = characterName === "Mickey" ? 2 : 1.6;

    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.name.includes("Google UK English Female")) || voices[0];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };


  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-300 via-pink-200 to-yellow-100 flex flex-col z-0">
      <Header />
      <main className="relative flex-1 flex flex-col items-center justify-center pt-4 pb-8 px-2 z-10">
        <div className="w-full max-w-3xl min-h-[70vh] bg-white/90 shadow-2xl rounded-3xl p-10 border-2 border-pink-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={`/avatars/${characterName.charAt(0).toUpperCase() + characterName.slice(1)}.png`}
              alt={characterName}
              className="w-14 h-14 rounded-full border-2 border-blue-300 bg-white object-cover shadow"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <h2 className="text-3xl font-extrabold text-pink-600 drop-shadow-sm tracking-tight">
              Talk to {characterName.charAt(0).toUpperCase() + characterName.slice(1)}
            </h2>
          </div>

          <div className="flex flex-col gap-4 items-center mb-4">
            <div className="flex gap-3">
              <button
                onClick={startListening}
                disabled={loading || isSpeaking}
                className={`px-5 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                  listening ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-pink-400`}
              >
                {listening ? "Listening..." : "Start Talking"}
              </button>

              <button
                onClick={stopListening}
                disabled={!listening}
                className="px-5 py-2 rounded-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Stop
              </button>
            </div>
          </div>

          {/* Chat Log */}
          <div className="mt-2 bg-gray-50 p-6 rounded-xl max-h-[45vh] min-h-[200px] overflow-y-auto text-lg border border-gray-200 shadow-inner">
            {chatLog.length === 0 ? (
              <div className="text-gray-400 text-center">No conversation yet. Start talking!</div>
            ) : (
              chatLog.map((msg, idx) => (
                <div key={idx} className="mb-2 whitespace-pre-line">
                  {msg}
                </div>
              ))
            )}
          </div>

          {/* Transcript Display & Submit Button BELOW chat log */}
          {transcript && !listening && (
            <div className="mt-6 text-center">
              <div className="text-gray-600 italic mb-2">🗣️ You said: {transcript}</div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={handleSendToGPT}
                disabled={loading || isSpeaking}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CharacterVoiceChat;
