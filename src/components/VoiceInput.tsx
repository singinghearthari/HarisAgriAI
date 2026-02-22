import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface VoiceInputProps {
  onInput: (text: string) => void;
  className?: string;
  lang?: 'en-US' | 'ta-IN';
}

export default function VoiceInput({ onInput, className, lang }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onInputRef = useRef(onInput);
  const { language } = useLanguage();

  // Determine effective language: prop > context > default
  const effectiveLang = lang || (language === 'ta' ? 'ta-IN' : 'en-US');

  // Update ref when onInput changes, so we don't need to re-run effect
  useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = effectiveLang;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onInputRef.current(text);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return; // Ignore aborted errors
      console.error("Voice input error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [effectiveLang]); // Re-run when language changes

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside a button
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition", err);
      }
    }
  };

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return null; // Hide if not supported
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={cn(
        "p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1",
        isListening 
          ? "bg-red-100 text-red-600 ring-red-200 animate-pulse" 
          : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50",
        className
      )}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
