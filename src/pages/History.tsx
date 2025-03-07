
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MathProblem from '../components/MathProblem';
import Solution from '../components/Solution';
import { MathProblem as MathProblemType, getSavedProblems, deleteProblem, clearProblems } from '../utils/localStorage';
import { History as HistoryIcon, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const History: React.FC = () => {
  const [problems, setProblems] = useState<MathProblemType[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<MathProblemType | null>(null);
  
  // Load problems from localStorage
  useEffect(() => {
    setProblems(getSavedProblems());
  }, []);
  
  // Handle problem deletion
  const handleDelete = (id: string) => {
    deleteProblem(id);
    setProblems(prev => prev.filter(problem => problem.id !== id));
    toast.success("Problem deleted");
    
    // If the selected problem is deleted, clear the selection
    if (selectedProblem && selectedProblem.id === id) {
      setSelectedProblem(null);
    }
  };
  
  // Handle clearing all problems
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      clearProblems();
      setProblems([]);
      setSelectedProblem(null);
      toast.success("History cleared");
    }
  };
  
  // Handle problem selection
  const handleProblemClick = (problem: MathProblemType) => {
    setSelectedProblem(problem);
  };
  
  // Handle resetting the selected problem
  const handleResetSelection = () => {
    setSelectedProblem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      {selectedProblem ? (
        <main className="container px-4 pb-16 mx-auto">
          <div className="mb-4">
            <button
              onClick={handleResetSelection}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <X className="w-4 h-4 mr-1" />
              Back to history
            </button>
          </div>
          <Solution problem={selectedProblem} onReset={handleResetSelection} />
        </main>
      ) : (
        <main className="container px-4 pb-16 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-mitphoto-500" />
              Problem History
            </h2>
            
            {problems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          
          {problems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 animate-enter">
              {problems.map(problem => (
                <MathProblem
                  key={problem.id}
                  problem={problem}
                  onDelete={handleDelete}
                  onClick={handleProblemClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-enter">
              <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No problem history</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Solved problems will appear here for quick reference
              </p>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default History;
