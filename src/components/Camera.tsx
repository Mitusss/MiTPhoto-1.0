
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, Upload, RefreshCw, Image } from 'lucide-react';

interface CameraProps {
  onCapture: (imageUrl: string, file: File) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: { facingMode: facingMode }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      
      setIsCameraActive(true);
      setIsCameraAvailable(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stream]);

  useEffect(() => {
    initCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, initCamera]);

  // Switch camera
  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL and blob
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = canvas.toDataURL('image/jpeg');
          const file = new File([blob], "math-problem.jpg", { type: "image/jpeg" });
          onCapture(imageUrl, file);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageUrl = reader.result as string;
      onCapture(imageUrl, file);
    };
    
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-enter">
      <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-3xl shadow-elegant">
        {isCameraActive ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-cover bg-gray-100"
            playsInline
            muted
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              {isLoading ? (
                <RefreshCw className="h-10 w-10 mx-auto text-mitphoto-400 animate-spin" />
              ) : (
                <>
                  <CameraIcon className="h-12 w-12 mx-auto text-mitphoto-400 mb-4" />
                  <p className="text-gray-500">
                    {isCameraAvailable 
                      ? "Camera initializing..." 
                      : "Camera not available. Please upload an image instead."}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Hidden file input */}
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      
      <div className="flex justify-center gap-4">
        {isCameraAvailable && (
          <>
            <button
              onClick={switchCamera}
              className="p-4 rounded-full bg-white shadow-elegant hover:bg-gray-50 transition-all duration-300 active:scale-95"
              aria-label="Switch Camera"
            >
              <RefreshCw className="h-6 w-6 text-mitphoto-600" />
            </button>
            
            <button
              onClick={capturePhoto}
              className="p-5 rounded-full bg-mitphoto-500 shadow-lg hover:bg-mitphoto-600 transition-all duration-300 active:scale-95"
              aria-label="Take Photo"
            >
              <CameraIcon className="h-7 w-7 text-white" />
            </button>
          </>
        )}
        
        <button
          onClick={triggerFileInput}
          className="p-4 rounded-full bg-white shadow-elegant hover:bg-gray-50 transition-all duration-300 active:scale-95"
          aria-label="Upload Image"
        >
          <Upload className="h-6 w-6 text-mitphoto-600" />
        </button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Capture or upload a photo of your math problem
      </p>
    </div>
  );
};

export default Camera;
