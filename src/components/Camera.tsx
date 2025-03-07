
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, Upload, RefreshCw, X, Check } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CameraProps {
  onCapture: (imageUrl: string, file: File) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for image cropping
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<ReactCrop.PixelCrop | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Initialize camera with better error handling
  const initCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // First check if we have camera permissions
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        
        // More robust video loading handler with promises and timeouts
        try {
          await new Promise((resolve, reject) => {
            if (!videoRef.current) return reject("Video element not found");
            
            const timeoutId = setTimeout(() => {
              reject(new Error("Video load timeout"));
            }, 10000);
            
            videoRef.current.onloadedmetadata = () => {
              clearTimeout(timeoutId);
              resolve(true);
            };
            
            videoRef.current.onerror = (err) => {
              clearTimeout(timeoutId);
              reject(err);
            };
          });
          
          await videoRef.current.play();
          setIsCameraActive(true);
          setIsCameraAvailable(true);
        } catch (err) {
          console.error("Error playing video:", err);
          setIsCameraAvailable(false);
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stream]);

  useEffect(() => {
    initCamera().catch(err => {
      console.error("Camera initialization failed:", err);
      setIsCameraAvailable(false);
    });
    
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
          
          // Use for cropping
          setUploadedImage(imageUrl);
          setIsCropping(true);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Center and initialize the crop when the image is loaded
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget) {
      const { width, height } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 70,
          },
          1,
          width,
          height
        ),
        width,
        height
      );
      setCrop(crop);
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setUploadedImage(imageUrl);
      setIsCropping(true);
    };
    
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate cropped image
  const getCroppedImg = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    // Get the data URL
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Create a file from the cropped image
    canvas.toBlob((blob) => {
      if (blob && uploadedImage) {
        const file = new File([blob], "cropped-math-problem.jpg", { type: 'image/jpeg' });
        onCapture(croppedImageUrl, file);
        
        // Reset cropping state
        resetCropState();
      }
    }, 'image/jpeg', 0.95);
  }, [completedCrop, onCapture, uploadedImage]);

  // Reset crop state
  const resetCropState = () => {
    setIsCropping(false);
    setUploadedImage(null);
    setCompletedCrop(null);
  };

  // Determine what to render
  const renderContent = () => {
    if (isCropping && uploadedImage) {
      return (
        <div className="w-full">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Crop your math problem</h3>
            <p className="text-sm text-gray-500">Adjust the crop area to focus on the math problem</p>
          </div>
          
          <div className="mb-4 overflow-hidden max-h-[60vh] bg-gray-50 rounded-lg p-2">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
              className="max-w-full mx-auto"
              minHeight={50}
              minWidth={50}
            >
              <img
                ref={imgRef}
                src={uploadedImage}
                alt="Upload"
                className="max-w-full max-h-[60vh] object-contain"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={resetCropState}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={getCroppedImg}
              className="flex items-center gap-2 px-4 py-2 bg-mitphoto-500 text-white rounded-lg hover:bg-mitphoto-600 transition-colors"
              disabled={!completedCrop?.width || !completedCrop?.height}
            >
              <Check size={18} />
              Crop & Analyze
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <>
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
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          {isCameraAvailable && isCameraActive && (
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
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          {isCameraAvailable && isCameraActive 
            ? "Capture or upload a photo of your math problem" 
            : "Upload a photo of your math problem"}
        </p>
        
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
      </>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-enter">
      {renderContent()}
    </div>
  );
};

export default Camera;
