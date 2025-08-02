// src/TestMic.jsx
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function TestMic() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>❌ Browser doesn't support Speech Recognition</span>;
  }

  return (
    <div className="p-4">
      <h1>🎙️ Test Speech Recognition</h1>
      <button onClick={() => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
      }}>
        Start Listening
      </button>

      <p>{listening ? "🎤 Listening..." : "🛑 Not Listening"}</p>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
}
