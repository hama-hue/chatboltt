"use client";

import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";

export function VoiceInput({
  onResult,
  disabled,
}: {
  onResult: (text: string) => void;
  disabled?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (disabled || listening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-IN"; // best for Hinglish + English
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      setListening(true);
    };

    recognition.onspeechend = () => {
      console.log("🛑 Speech ended");
      recognition.stop();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("✅ Heard:", transcript);
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Speech error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log("🔚 Recognition ended");
      setListening(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={disabled}
      className={`aspect-square h-8 rounded-lg p-1 transition-colors
        ${listening ? "bg-red-500 text-white" : "hover:bg-accent"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title="Voice input"
    >
      {listening ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
}
