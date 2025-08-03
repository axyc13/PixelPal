import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

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
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Talk to {characterName}</h2>

      <div className="flex flex-col gap-3 items-center">
        <div className="flex gap-3">
          <button
            onClick={startListening}
            disabled={loading || isSpeaking}
            className={`px-4 py-2 rounded font-semibold ${
              listening ? "bg-red-500" : "bg-blue-600"
            } text-white`}
          >
            {listening ? "Listening..." : "Start Talking"}
          </button>

          <button
            onClick={stopListening}
            disabled={!listening}
            className="px-4 py-2 rounded font-semibold bg-gray-500 text-white"
          >
            Stop
          </button>
        </div>
      </div>

      {/* Chat Log */}
      <div className="mt-5 bg-gray-100 p-3 rounded max-h-64 overflow-y-auto text-sm">
        {chatLog.map((msg, idx) => (
          <div key={idx} className="mb-2">
            {msg}
          </div>
        ))}
      </div>

      {/* Transcript Display & Submit Button BELOW chat log */}
      {transcript && !listening && (
        <div className="mt-4 text-center">
          <div className="text-gray-600 italic mb-2">🗣️ You said: {transcript}</div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSendToGPT}
            disabled={loading || isSpeaking}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterVoiceChat;
