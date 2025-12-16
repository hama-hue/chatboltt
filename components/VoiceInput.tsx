"use client";

import { Mic, MicOff } from "lucide-react";
import { useState } from "react";

export function VoiceInput({
  onResult,
  disabled,
}: {
  onResult: (text: string) => void;
  disabled?: boolean;
}) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (disabled) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      onResult(event.results[0][0].transcript);
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
