"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition, useTextToSpeech } from "@/hooks/use-speech";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Mock AI response logic
  const getAIResponse = (text: string) => {
    setIsAnswering(true);
    setQuery(text);
    setTimeout(() => {
      let aiResponse = "I'm sorry, I don't understand. Please try again.";
      if (text.toLowerCase().includes("weather")) {
        aiResponse = "The weather is currently 32 degrees Celsius and sunny.";
      } else if (text.toLowerCase().includes("tomato price") || text.toLowerCase().includes("टमाटर का भाव")) {
        aiResponse = "Today's market price for tomatoes is 25 rupees per kilogram.";
      } else if (text.toLowerCase().includes("fertilizer for corn")) {
          aiResponse = "For corn, you should use a balanced NPK fertilizer. For one acre, about 50 kilograms of Urea is recommended during the growth stage."
      }
      setResponse(aiResponse);
      setIsAnswering(false);
    }, 1500);
  };
  
  const { speak, isSpeaking } = useTextToSpeech();
  const { isListening, transcript, startListening, stopListening, error, isSupported } = useSpeechRecognition({lang: i18n.language});
  
  // When listening stops, process the transcript
  useEffect(() => {
    if (!isListening && transcript) {
      getAIResponse(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  // When a new AI response is generated, speak it out
  useEffect(() => {
    if (response && !isAnswering) {
      speak(response);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isAnswering]);
  
  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", title: t('assistant_error_title'), description: error });
    }
  }, [error, toast, t]);

  const handleMicClick = () => {
    setQuery("");
    setResponse("");
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-12 w-12" onClick={() => router.back()}>
        <X size={32}/>
      </Button>
      <div className="w-full max-w-2xl text-center">

        <p className={cn(
            "text-2xl md:text-4xl font-bold transition-opacity duration-300 min-h-[80px]",
            isListening || query ? 'opacity-100' : 'opacity-0'
        )}>
            {isListening ? t('assistant_listening') : `“${query}”`}
        </p>

        <div className="my-20">
            <Button
              onClick={handleMicClick}
              aria-label={isListening ? t('stop_listening') : t('start_listening')}
              className={cn(
                "h-36 w-36 rounded-full text-5xl transition-all duration-300 shadow-2xl",
                isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'
              )}
            >
              {isListening ? <MicOff size={70} /> : <Mic size={70} />}
            </Button>
        </div>

         <div className={cn(
            "text-xl md:text-3xl text-muted-foreground transition-opacity duration-500 min-h-[100px]",
            response || isAnswering ? "opacity-100" : "opacity-0"
        )}>
            {isAnswering ? t('assistant_thinking') : response}
            {response && !isAnswering && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    aria-label={t('read_response_aloud')}
                    onClick={() => speak(response)}
                >
                    <Volume2 className={isSpeaking ? "text-accent" : ""}/>
                </Button>
            )}
        </div>
        
        {!isSupported && <p className="text-red-500 mt-4">{t('assistant_unsupported')}</p>}
      </div>
    </div>
  );
}
