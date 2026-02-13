"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Loader2, AlertTriangle, Wind, Siren } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<{ name: string; treatment: string } | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

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
      
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
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
      setDiagnosis({
        name: "Late Blight",
        treatment: "Apply a fungicide containing mancozeb or chlorothalonil. Ensure proper spacing between plants for better air circulation. Avoid overhead irrigation.",
      });
      setIsDiagnosing(false);
    }, 1500);
  };
  
  const reset = () => {
    setImage(null);
    setDiagnosis(null);
    if(hasCameraPermission && videoRef.current) {
       navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
        if(videoRef.current) videoRef.current.srcObject = stream;
       });
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Crop Disease Detection</CardTitle>
          <CardDescription>Capture or upload a photo of a plant leaf to diagnose diseases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <Siren className="h-4 w-4" />
                  <AlertTitle>Camera Not Available</AlertTitle>
                  <AlertDescription>
                    Camera access is required for live capture. You can still upload a photo.
                  </Aler