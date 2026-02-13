"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// Speech Recognition Hook
type SpeechRecognitionOptions = {
  lang?: string;
}
type SpeechRecognitionHook = {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  isSupported: boolean;
};

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false; 
      recognition.lang = options.lang || 'en-US';

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const finalTranscript = lastResult[0].transcript.trim();
          setTranscript(finalTranscript);
          stopListening();
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech' || event.error === 'aborted') {
          // These are not critical errors, just ignore them.
        } else {
            setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };
      
      recognition.onend = () => {
        // Only set to false if it's not already being stopped manually
        if (recognitionRef.current) {
            setIsListening(false);
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, [options.lang]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        if (e instanceof DOMException && e.name === 'NotAllowedError') {
             setError("Microphone permission was denied.");
        } else {
            setError("Speech recognition could not start.");
        }
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    isSupported: !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)),
  };
};

// Text-to-Speech Hook
type TextToSpeechHook = {
  speak: (text: string, options?: Partial<SpeechSynthesisUtterance>) => void;
  isSpeaking: boolean;
  isSupported: boolean;
};

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
       // Cleanup function to cancel speech when component unmounts
      return () => {
        if (synthRef.current) {
          synthRef.current.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback((text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if (synthRef.current && text) {
      // Cancel any previous speech to prevent overlap
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (options) {
        Object.assign(utterance, options);
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  }, []);

  return { 
    speak, 
    isSpeaking,
    isSupported: !!(typeof window !== 'undefined' && 'speechSynthesis' in window)
  };
};
