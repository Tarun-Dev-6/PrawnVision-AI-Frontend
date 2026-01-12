import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Zap, RotateCcw, Image as ImageIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";

type CaptureStep = "camera" | "preview" | "analyzing" | "result";

interface DetectionResult {
  count: number;
  confidence: number;
  processTime: number;
  imageUrl: string;
}

export const CapturePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<CaptureStep>("camera");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please grant permission.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        setStep("preview");
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        setStep("preview");
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setStep("analyzing");
    
    // Simulate API call to your FastAPI backend
    // Replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Mock result - replace with actual API response
      setResult({
        count: Math.floor(Math.random() * 5000) + 1000,
        confidence: 95 + Math.random() * 4,
        processTime: 1.2 + Math.random(),
        imageUrl: capturedImage || "",
      });
      setStep("result");
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze image. Please try again.",
        variant: "destructive",
      });
      setStep("preview");
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
    setStep("camera");
    startCamera();
  };

  const saveResult = () => {
    toast({
      title: "Saved!",
      description: `Count of ${result?.count.toLocaleString()} saved successfully.`,
    });
    navigate("/history");
  };

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center px-5 py-6">
        {/* Camera/Preview Container */}
        <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-foreground shadow-elevated">
          {/* Camera View */}
          {step === "camera" && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/30 rounded-2xl" />
                <div className="absolute top-1/2 left-4 right-4 h-px bg-white/20" />
                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/20" />
              </div>
            </>
          )}

          {/* Preview View */}
          {(step === "preview" || step === "analyzing") && capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Result View */}
          {step === "result" && capturedImage && (
            <div className="absolute inset-0">
              <img
                src={capturedImage}
                alt="Analyzed"
                className="w-full h-full object-cover"
              />
              {/* Overlay with detection boxes simulation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/60" />
            </div>
          )}

          {/* Analyzing Animation */}
          {step === "analyzing" && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 ocean-gradient rounded-full animate-pulse-ring opacity-30" />
                  <div className="absolute inset-3 ocean-gradient rounded-full animate-pulse-ring opacity-50 animation-delay-200" />
                  <div className="absolute inset-6 ocean-gradient rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-foreground animate-pulse" />
                  </div>
                </div>
                <p className="text-primary-foreground text-base font-semibold">Analyzing...</p>
                <p className="text-primary-foreground/70 text-xs mt-1">
                  AI is counting shrimp seeds
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md mt-6">
          {step === "camera" && (
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <ImageIcon className="h-5 w-5" />
                Gallery
              </Button>
              <Button
                variant="capture"
                size="icon-lg"
                className="w-16 h-16 rounded-full"
                onClick={captureImage}
              >
                <Camera className="h-7 w-7" />
              </Button>
              <div className="w-[88px]" /> {/* Spacer for alignment */}
            </div>
          )}

          {step === "preview" && (
            <div className="flex gap-3 animate-slide-up">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetCapture}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={analyzeImage}
              >
                <Zap className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          )}

          {step === "result" && result && (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
                <p className="text-sm text-muted-foreground mb-1">Detected Count</p>
                <p className="text-4xl font-bold text-gradient">
                  {result.count.toLocaleString()}
                </p>
                <div className="flex items-center justify-center gap-4 mt-2 text-sm">
                  <span className="text-muted-foreground">
                    Confidence: <strong className="text-foreground">{result.confidence.toFixed(1)}%</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Time: <strong className="text-foreground">{result.processTime.toFixed(1)}s</strong>
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetCapture}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={saveResult}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden elements */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </AppLayout>
  );
};

export default CapturePage;
