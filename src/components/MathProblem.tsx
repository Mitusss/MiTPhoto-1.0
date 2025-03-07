
import React from 'react';
import { MathProblem as MathProblemType } from '../utils/localStorage';
import { Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MathProblemProps {
  problem: MathProblemType;
  onDelete: (id: string) => void;
  onClick: (problem: MathProblemType) => void;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, onDelete, onClick }) => {
  // Format the timestamp
  const formattedDate = format(new Date(problem.timestamp), 'MMM d, yyyy');
  const formattedTime = format(new Date(problem.timestamp), 'h:mm a');
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(problem.id);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-elegant transition-all duration-300 hover:shadow-lg group animate-scale-in cursor-pointer"
      onClick={() => onClick(problem)}
    >
      <div className="flex overflow-hidden">
        <div className="w-24 h-24 overflow-hidden flex-shrink-0">
          <img 
            src={problem.imageUrl} 
            alt="Math problem" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        
        <div className="flex-1 p-4">
          <h3 className="font-medium text-gray-900 line-clamp-1">{problem.problem}</h3>
          <p className="text-mitphoto-600 font-medium mt-1 text-sm">{problem.solution}</p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate}, {formattedTime}
            </div>
            
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full opacity-0 group-hover:opacity-100"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathProblem;
