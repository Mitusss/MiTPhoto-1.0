
import React from 'react';
import { MathProblem } from '../utils/localStorage';
import { Check, ArrowRight } from 'lucide-react';

interface SolutionProps {
  problem: MathProblem;
  onReset: () => void;
}

const Solution: React.FC<SolutionProps> = ({ problem, onReset }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-elegant overflow-hidden animate-enter">
      <div className="p-6">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={problem.imageUrl} 
              alt="Math problem" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-mitphoto-100 text-mitphoto-700 mb-2">
              <Check className="w-3 h-3 mr-1" />
              Problem Solved
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {problem.problem}
            </h3>
            <p className="text-lg font-medium text-mitphoto-600 mt-1">
              {problem.solution}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-2 p-6 pt-0">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Step-by-step solution</h4>
        <div className="space-y-3">
          {problem.steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-mitphoto-200 text-mitphoto-700 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 pt-2">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-mitphoto-100 hover:bg-mitphoto-200 text-mitphoto-700 font-medium py-3 px-4 rounded-xl transition-all duration-300"
        >
          Solve another problem
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Solution;
