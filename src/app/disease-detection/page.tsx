"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Loader2, ScanLine, Volume2 } from "lucide-react";
import Image from "next/image";
import { useTextToSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<{ name: string; treatment: string } | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { speak, isSupported, isSpeaking } = useTextToSpeech();
  const { t } = useTranslation();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);
      setDiagnosis(null);
      
      if(video.srcObject){
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = () => {
    if (!image) return;
    setIsDiagnosing(true);
    // Mock AI diagnosis
    setTimeout(() => {
      const newDiagnosis = {
        name: "Late Blight",
        treatment: "Apply a fungicide containing mancozeb or chlorothalonil. Ensure proper spacing between plants for better air circulation. Avoid overhead irrigation.",
      };
      setDiagnosis(newDiagnosis);
      setIsDiagnosing(false);
      speak(`${t('diagnosis_result', { diagnosisName: newDiagnosis.name })}. ${t('recommended_treatment')} ${newDiagnosis.treatment}`);
    }, 1500);
  };
  
  const reset = async () => {
    setImage(null);
    setDiagnosis(null);
    if(hasCameraPermission && videoRef.current) {
       try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if(videoRef.current) videoRef.current.srcObject = stream;
       } catch (error) {
        console.error("Error restarting camera:", error);
       }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><ScanLine/> {t('disease_detection_title')}</CardTitle>
          <CardDescription>{t('disease_detection_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
                <video ref={videoRef} className={cn("w-full h-full object-cover", hasCameraPermission ? 'block' : 'hidden')} autoPlay muted playsInline />
                {!hasCameraPermission && (
                  <div className="text-center text-muted-foreground p-4">
                    <Camera size={48} className="mx-auto mb-2"/>
                    <p>{t('camera_denied')}</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full h-14 text-xl btn-48">
                  <Camera className="mr-2 h-6 w-6" /> {t('capture')}
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 text-xl btn-48" variant="secondary">
                   <Upload className="mr-2 h-6 w-6" /> {t('upload_photo')}
                </Button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative border">
                <Image src={image} alt="Captured plant leaf" layout="fill" objectFit="contain" />
              </div>
              
              {!diagnosis && (
                <Button onClick={handleDiagnose} disabled={isDiagnosing} className="w-full h-14 text-xl btn-48">
                  {isDiagnosing ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <ScanLine className="mr-2 h-6 w-6" />}
                  {isDiagnosing ? t('diagnosing') : t('diagnose_plant')}
                </Button>
              )}

              {diagnosis && (
                <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('diagnosis_result', { diagnosisName: diagnosis.name })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-bold text-lg">{t('recommended_treatment')}</h3>
                        <p className="text-lg">{diagnosis.treatment}</p>
                        {isSupported && <Button variant="ghost" size="icon" onClick={() => speak(diagnosis.treatment)} aria-label={t('read_treatment_aloud')}><Volume2 className={isSpeaking ? "text-accent" : ""}/></Button>}
                    </CardContent>
                </Card>
              )}

              <Button onClick={reset} variant="outline" className="w-full h-14 text-xl btn-48">
                {t('take_another_photo')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
