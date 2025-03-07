
import { MathProblem } from './localStorage';

// This is a simplified implementation.
// In a real-world app, you would use a proper math recognition and solving library
// or connect to a service that can process mathematical expressions from images.

// Function to generate a random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Function to convert an image to a base64 string
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Some example problems and solutions for demo purposes
const exampleProblems = [
  {
    problem: "1+1",
    solution: "2",
    steps: [
      "Start with the expression: 1+1",
      "Addition of 1 and 1 gives us 2",
      "Therefore, 1+1 = 2"
    ]
  },
  {
    problem: "2+2",
    solution: "4",
    steps: [
      "Start with the expression: 2+2",
      "Addition of 2 and 2 gives us 4",
      "Therefore, 2+2 = 4"
    ]
  },
  {
    problem: "2x + 3 = 7",
    solution: "x = 2",
    steps: [
      "Start with the equation: 2x + 3 = 7",
      "Subtract 3 from both sides: 2x = 4",
      "Divide both sides by 2: x = 2"
    ]
  },
  {
    problem: "x^2 - 4 = 0",
    solution: "x = 2 or x = -2",
    steps: [
      "Start with the equation: x^2 - 4 = 0",
      "Rearrange to standard form: x^2 = 4",
      "Take the square root of both sides: x = ±2",
      "Therefore, x = 2 or x = -2"
    ]
  },
  {
    problem: "3x - 7 = 5x + 3",
    solution: "x = -5",
    steps: [
      "Start with the equation: 3x - 7 = 5x + 3",
      "Subtract 5x from both sides: -2x - 7 = 3",
      "Add 7 to both sides: -2x = 10",
      "Divide both sides by -2: x = -5"
    ]
  },
  {
    problem: "\\frac{1}{2}x + 3 = 7",
    solution: "x = 8",
    steps: [
      "Start with the equation: \\frac{1}{2}x + 3 = 7",
      "Subtract 3 from both sides: \\frac{1}{2}x = 4",
      "Multiply both sides by 2: x = 8"
    ]
  }
];

// Simple OCR simulation for demo purposes - check for basic patterns
export const extractProblemFromImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // For demo purposes, randomly select based on a simple pattern:
      // If the image URL contains a timestamp that's divisible by 2, return "1+1"
      const timestamp = new Date().getTime();
      
      if (timestamp % 3 === 0) {
        resolve("1+1");
      } else if (timestamp % 3 === 1) {
        resolve("2+2");
      } else {
        const randomIndex = Math.floor(Math.random() * (exampleProblems.length - 2)) + 2;
        resolve(exampleProblems[randomIndex].problem);
      }
    }, 1500);
  });
};

// Function to solve a math problem
export const solveMathProblem = (problem: string): Promise<{ solution: string; steps: string[] }> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // Exact match for basic problems
      if (problem === "1+1") {
        resolve({
          solution: "2",
          steps: [
            "Start with the expression: 1+1",
            "Addition of 1 and 1 gives us 2",
            "Therefore, 1+1 = 2"
          ]
        });
        return;
      }
      
      if (problem === "2+2") {
        resolve({
          solution: "4",
          steps: [
            "Start with the expression: 2+2",
            "Addition of 2 and 2 gives us 4",
            "Therefore, 2+2 = 4"
          ]
        });
        return;
      }
      
      // For other problems, find the matching problem in our examples
      const matchingProblem = exampleProblems.find(p => p.problem === problem);
      
      if (matchingProblem) {
        resolve({
          solution: matchingProblem.solution,
          steps: matchingProblem.steps
        });
      } else {
        // Fallback for unrecognized problems
        resolve({
          solution: "Could not solve this problem",
          steps: ["The problem format was not recognized"]
        });
      }
    }, 1000);
  });
};

// Main function to process an image and solve the math problem
export const processMathImage = async (imageUrl: string): Promise<MathProblem> => {
  // Extract problem from image
  const problem = await extractProblemFromImage(imageUrl);
  
  // Solve the problem
  const { solution, steps } = await solveMathProblem(problem);
  
  // Create a new MathProblem object
  const mathProblem: MathProblem = {
    id: generateId(),
    imageUrl,
    problem,
    solution,
    steps,
    timestamp: Date.now()
  };
  
  return mathProblem;
};
