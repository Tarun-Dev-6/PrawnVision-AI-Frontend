import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Zap, RotateCcw, Image as ImageIcon, Check, Focus, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { countShrimp, dataURLtoBlob, saveCapture } from "@/services/api";
import { ImagePreviewModal } from "@/components/ImagePreviewModal";

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
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!capturedImage) return;
    
    setStep("analyzing");
    const startTime = performance.now();
    
    try {
      // Convert base64 image to blob for upload
      const imageBlob = dataURLtoBlob(capturedImage);
      
      // Call FastAPI backend
      const response = await countShrimp(imageBlob);
      
      const endTime = performance.now();
      const processTime = (endTime - startTime) / 1000;
      
      setResult({
        count: response.count,
        confidence: response.confidence * 100, // Convert to percentage
        processTime: processTime,
        imageUrl: capturedImage,
      });
      setStep("result");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to connect to server. Please check if backend is running.",
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

  const saveResult = async () => {
    if (!result || !capturedImage) return;
    
    setIsSaving(true);
    try {
      const imageBlob = dataURLtoBlob(capturedImage);
      await saveCapture(imageBlob, result.count, result.confidence / 100);
      
      toast({
        title: "Saved!",
        description: `Count of ${result.count.toLocaleString()} saved successfully.`,
      });
      navigate("/history");
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save capture.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Instructions */}
        <div className="px-5 py-4 text-center">
          <p className="text-muted-foreground text-sm">
            {step === "camera" && "Position shrimp seeds in frame and capture"}
            {step === "preview" && "Review your image before analysis"}
            {step === "analyzing" && "Please wait while AI processes..."}
            {step === "result" && "Analysis complete!"}
          </p>
        </div>

        {/* Camera Viewfinder - Main Focus */}
        <div className="flex-1 flex items-center justify-center px-5">
          <div 
            className={`relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-muted shadow-elevated border-4 border-card ${step === "result" ? "cursor-pointer" : ""}`}
            onClick={() => step === "result" && setShowPreview(true)}
          >
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
                
                {/* Corner Brackets */}
                <div className="absolute inset-0 pointer-events-none p-4">
                  {/* Top Left */}
                  <div className="absolute top-4 left-4 w-10 h-10 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                  {/* Top Right */}
                  <div className="absolute top-4 right-4 w-10 h-10 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                  {/* Bottom Left */}
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                  {/* Bottom Right */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-b-3 border-r-3 border-primary rounded-br-lg" />
                  
                  {/* Center Focus */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Focus className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                
                {/* Bottom Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-xs text-center font-medium">Live Camera</p>
                </div>
              </>
            )}

            {/* Preview View */}
            {(step === "preview" || step === "analyzing") && capturedImage && (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {step === "preview" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-xs text-center font-medium">Preview</p>
                  </div>
                )}
              </>
            )}

            {/* Result View */}
            {step === "result" && capturedImage && (
              <>
                <img
                  src={capturedImage}
                  alt="Analyzed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-black/70" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <p className="text-white text-xs font-medium">✓ Analyzed</p>
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <ZoomIn className="h-3 w-3" />
                    <span>Tap to view</span>
                  </div>
                </div>
              </>
            )}

            {/* Analyzing Animation */}
            {step === "analyzing" && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
                    <div className="absolute inset-2 border-4 border-primary/50 rounded-full animate-pulse" />
                    <div className="absolute inset-4 ocean-gradient rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-white text-sm font-semibold">Analyzing...</p>
                  <p className="text-white/60 text-xs mt-1">Counting shrimp seeds</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-5 pb-6 pt-4">
          {step === "camera" && (
            <div className="flex items-center justify-center gap-6">
              {/* Gallery Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-card shadow-soft flex items-center justify-center border border-border">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <span className="text-xs">Gallery</span>
              </button>

              {/* Capture Button */}
              <button
                onClick={captureImage}
                className="group relative"
              >
                <div className="w-20 h-20 rounded-full ocean-gradient shadow-elevated flex items-center justify-center transition-transform active:scale-95 hover:brightness-110">
                  <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <Camera className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
              </button>

              {/* Placeholder for symmetry - now visible as guide */}
              <div className="w-14 h-14 opacity-0">
                <div className="w-14 h-14" />
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="flex gap-4 max-w-sm mx-auto animate-fade-in">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-xl"
                onClick={resetCapture}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1 h-14 rounded-xl"
                onClick={analyzeImage}
              >
                <Zap className="h-5 w-5 mr-2" />
                Analyze
              </Button>
            </div>
          )}

          {step === "result" && result && (
            <div className="max-w-sm mx-auto space-y-4 animate-fade-in">
              {/* Result Card */}
              <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
                <div className="text-center mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Shrimp Seed Count</p>
                  <p className="text-5xl font-bold text-gradient">
                    {result.count.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Confidence</p>
                    <p className="font-semibold text-foreground">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Time</p>
                    <p className="font-semibold text-foreground">{result.processTime.toFixed(1)}s</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 rounded-xl"
                  onClick={resetCapture}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1 h-12 rounded-xl"
                  onClick={saveResult}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
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

      {/* Image Preview Modal */}
      {capturedImage && (
        <ImagePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          imageUrl={capturedImage}
          count={result?.count}
        />
      )}
    </AppLayout>
  );
};

export default CapturePage;
