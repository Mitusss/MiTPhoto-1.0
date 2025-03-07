
// Type definitions for our math problems
export interface MathProblem {
  id: string;
  imageUrl: string;
  problem: string;
  solution: string;
  steps: string[];
  timestamp: number;
  language?: string; // Add language field
}

// Key for localStorage
const STORAGE_KEY = 'mitphoto_history';

// Get all saved problems
export const getSavedProblems = (): MathProblem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error retrieving saved problems:', error);
    return [];
  }
};

// Save a new problem
export const saveProblem = (problem: MathProblem): void => {
  try {
    const currentProblems = getSavedProblems();
    const updatedProblems = [problem, ...currentProblems];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProblems));
  } catch (error) {
    console.error('Error saving problem:', error);
  }
};

// Delete a problem by ID
export const deleteProblem = (id: string): void => {
  try {
    const currentProblems = getSavedProblems();
    const updatedProblems = currentProblems.filter(problem => problem.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProblems));
  } catch (error) {
    console.error('Error deleting problem:', error);
  }
};

// Clear all problems
export const clearProblems = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing problems:', error);
  }
};
