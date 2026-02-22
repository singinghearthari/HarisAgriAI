import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, X, Volume2, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { processVoiceCommand } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Map app language to speech recognition language
  const speechLang = language === 'ta' ? 'ta-IN' : 'en-US';

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results for real-time feedback
    recognition.lang = speechLang;

    recognition.onresult = (event: any) => {
      // Combine interim results
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript;
          setTranscript(text);
          handleCommand(text);
        } else {
          interimTranscript += event.results[i][0].transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setResponse(t("voice.error"));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [speechLang, t]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setIsListening(false);
      }
    } else {
      alert("Voice recognition is not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.9; // Slightly slower for better clarity
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      // Pass current route context to help AI understand "here" or "this page"
      const context = `Current page: ${location.pathname}`;
      const result = await processVoiceCommand(text, speechLang, context);
      
      if (result.spokenResponse) {
        setResponse(result.spokenResponse);
        speak(result.spokenResponse);
      }

      if (result.type === 'NAVIGATION' && result.destination) {
        navigate(result.destination);
        // Close the large overlay after navigation if desired, or keep it open for feedback
      }
    } catch (error) {
      console.error(error);
      setResponse(t("voice.sorry"));
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  // Helper to determine if the assistant is "active" (showing the large UI)
  const isActive = isListening || isProcessing || (response && !isListening);

  return (
    <>
      {/* Full screen overlay when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center md:items-center"
            onClick={() => {
              if (!isProcessing) {
                setResponse('');
                setTranscript('');
                stopListening();
              }
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full md:w-[600px] md:rounded-3xl rounded-t-3xl p-6 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  stopListening();
                  setResponse('');
                  setTranscript('');
                }}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="h-6 w-6 text-slate-600" />
              </button>

              {/* Status Indicator */}
              <div className="flex flex-col items-center gap-2 mt-4">
                {isProcessing ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-50"></div>
                    <div className="bg-white p-4 rounded-full border-4 border-emerald-100 relative z-10">
                      <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                    </div>
                  </div>
                ) : isListening ? (
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20 duration-1000"></span>
                    <span className="absolute inset-[-10px] rounded-full animate-ping bg-red-400 opacity-10 delay-75 duration-1000"></span>
                    <div className="bg-red-50 p-6 rounded-full border-4 border-red-100 relative z-10 shadow-inner">
                      <Mic className="h-10 w-10 text-red-500" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-4 rounded-full border-4 border-emerald-100">
                    <Volume2 className="h-8 w-8 text-emerald-600" />
                  </div>
                )}
                <p className="font-medium text-slate-500 text-lg">
                  {isProcessing 
                    ? t("voice.thinking")
                    : isListening 
                      ? t("voice.listening")
                      : t("voice.assistant")}
                </p>
              </div>

              {/* Transcript / Response Area */}
              <div className="w-full text-center space-y-4 min-h-[100px] flex flex-col justify-center">
                {transcript && (
                  <p className="text-xl text-slate-700 font-medium leading-relaxed">
                    "{transcript}"
                  </p>
                )}
                
                {response && !isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100"
                  >
                    <p className="text-lg text-emerald-900 leading-relaxed font-medium">
                      {response}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 w-full justify-center pt-4 border-t border-slate-100">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-semibold text-slate-700"
                >
                  <Globe className="h-5 w-5" />
                  {language === 'ta' ? 'தமிழ்' : 'English'}
                </button>

                {!isListening && !isProcessing && (
                  <button
                    onClick={startListening}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all transform hover:scale-105"
                  >
                    <Mic className="h-5 w-5" />
                    {t("voice.speak_again")}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Always Visible) */}
      {!isActive && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {/* Language Toggle Mini */}
          <button
            onClick={toggleLanguage}
            className="bg-white text-xs font-bold text-emerald-700 px-3 py-1.5 rounded-full shadow-md border border-emerald-100 hover:bg-emerald-50 transition-colors"
          >
            {language === 'en' ? 'EN' : 'தமிழ்'}
          </button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startListening}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-200 flex items-center justify-center border-4 border-white ring-2 ring-emerald-100"
          >
            <Mic className="h-8 w-8" />
          </motion.button>
        </div>
      )}
    </>
  );
}
