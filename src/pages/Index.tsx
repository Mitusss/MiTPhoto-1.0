
import React, { useState } from 'react';
import Camera from '../components/Camera';
import Solution from '../components/Solution';
import Header from '../components/Header';
import { processMathImage } from '../utils/mathSolver';
import { MathProblem, saveProblem } from '../utils/localStorage';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);

  const handleCapture = async (imageUrl: string, file: File) => {
    try {
      setIsProcessing(true);
      
      // Process the image and extract the math problem
      const problem = await processMathImage(imageUrl);
      
      // Save the problem to localStorage
      saveProblem(problem);
      
      // Set the current problem
      setCurrentProblem(problem);
      
      // Show success toast
      toast.success("Problem solved successfully!");
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to process the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentProblem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container px-4 pb-16 mx-auto">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-20 animate-enter">
            <RefreshCw className="h-12 w-12 text-mitphoto-500 animate-spin mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Processing your problem</h2>
            <p className="text-gray-500 text-center max-w-xs">
              We're analyzing your math problem and calculating the solution...
            </p>
          </div>
        ) : currentProblem ? (
          <Solution problem={currentProblem} onReset={handleReset} />
        ) : (
          <Camera onCapture={handleCapture} />
        )}
      </main>
    </div>
  );
};

export default Index;
