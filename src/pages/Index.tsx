
import React, { useState } from 'react';
import Camera from '../components/Camera';
import Solution from '../components/Solution';
import Header from '../components/Header';
import { processMathImage } from '../utils/mathSolver';
import { MathProblem, saveProblem } from '../utils/localStorage';
import { RefreshCw, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { supportedLanguages } from '../utils/translationService';

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [language, setLanguage] = useState<string>('en');
  const [showLanguages, setShowLanguages] = useState(false);

  const handleCapture = async (imageUrl: string, file: File) => {
    try {
      setIsProcessing(true);
      toast.info("Processing your math problem...");
      
      // Process the image and extract the math problem with the selected language
      const problem = await processMathImage(imageUrl, language);
      
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

  const toggleLanguageMenu = () => {
    setShowLanguages(!showLanguages);
  };

  const selectLanguage = (code: string) => {
    setLanguage(code);
    setShowLanguages(false);
    const langName = supportedLanguages.find(l => l.code === code)?.name || code;
    toast.success(`Language set to ${langName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container px-4 pb-16 mx-auto">
        <div className="flex justify-end mb-4">
          <div className="relative">
            <button 
              onClick={toggleLanguageMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Languages size={18} />
              <span>{supportedLanguages.find(l => l.code === language)?.name || 'Language'}</span>
            </button>
            
            {showLanguages && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      lang.code === language ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
