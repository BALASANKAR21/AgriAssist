"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Loader2, AlertTriangle, Wind, Siren, ScanLine, Volume2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useTextToSpeech } from "@/hooks/use-speech";

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
      speak(`Diagnosis: ${newDiagnosis.name}. Treatment: ${newDiagnosis.treatment}`);
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
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><ScanLine/> Crop Disease Detection</CardTitle>
          <CardDescription>Capture or upload a photo of a plant leaf to diagnose diseases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
                <video ref={videoRef} className={cn("w-full h-full object-cover", hasCameraPermission ? 'block' : 'hidden')} autoPlay muted playsInline />
                {!hasCameraPermission && (
                  <div className="text-center text-muted-foreground p-4">
                    <Camera size={48} className="mx-auto mb-2"/>
                    <p>Camera not available or permission denied.</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full h-14 text-xl btn-48">
                  <Camera className="mr-2 h-6 w-6" /> Capture
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 text-xl btn-48" variant="secondary">
                   <Upload className="mr-2 h-6 w-6" /> Upload Photo
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
                  {isDiagnosing ? "Diagnosing..." : "Diagnose Plant"}
                </Button>
              )}

              {diagnosis && (
                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-2xl">Diagnosis: {diagnosis.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-bold text-lg">Recommended Treatment:</h3>
                        <p className="text-lg">{diagnosis.treatment}</p>
                        {isSupported && <Button variant="ghost" size="icon" onClick={() => speak(diagnosis.treatment)} aria-label="Read treatment aloud"><Volume2 className={isSpeaking ? "text-accent" : ""}/></Button>}
                    </CardContent>
                </Card>
              )}

              <Button onClick={reset} variant="outline" className="w-full h-14 text-xl btn-48">
                Take Another Photo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
