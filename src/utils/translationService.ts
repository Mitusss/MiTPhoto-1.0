
// Supported languages with their codes and names
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese (Portugal)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'el', name: 'Greek' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' }
];

// Portuguese translations for common math-related phrases
const ptTranslations: Record<string, string> = {
  "Start with the expression": "Começar com a expressão",
  "Start with the equation": "Começar com a equação",
  "Addition of": "Adição de",
  "Subtraction of": "Subtração de",
  "Multiplication of": "Multiplicação de",
  "Division of": "Divisão de",
  "gives us": "dá-nos",
  "Therefore": "Portanto",
  "Evaluate the expression": "Avaliar a expressão",
  "Rearrange to standard form": "Reorganizar para a forma padrão",
  "Take the square root of both sides": "Tirar a raiz quadrada de ambos os lados",
  "Subtract": "Subtrair",
  "Add": "Adicionar",
  "Multiply": "Multiplicar",
  "Divide": "Dividir",
  "from both sides": "de ambos os lados",
  "to both sides": "a ambos os lados",
  "both sides by": "ambos os lados por",
  "or": "ou",
  "The problem format was not recognized": "O formato do problema não foi reconhecido",
  "Could not solve this problem": "Não foi possível resolver este problema"
};

// Simple translation function - in a real app, you'd use a translation API
export const getTranslation = async (text: string, targetLanguage: string): Promise<string> => {
  // For demo purposes, only implement Portuguese translations
  if (targetLanguage === 'pt') {
    // Check for exact match
    if (ptTranslations[text]) {
      return ptTranslations[text];
    }
    
    // Replace known phrases
    let translatedText = text;
    
    for (const [english, portuguese] of Object.entries(ptTranslations)) {
      translatedText = translatedText.replace(new RegExp(english, 'g'), portuguese);
    }
    
    // Replace some common math terms
    translatedText = translatedText
      .replace(/equals/g, "equals")
      .replace(/equal to/g, "igual a")
      .replace(/x = /g, "x = ")
      .replace(/Therefore, /g, "Portanto, ");
    
    return translatedText;
  }
  
  // For all other languages, return the original text (in a real app, you'd call a translation API)
  return text;
};

// Get the language name from code
export const getLanguageName = (code: string): string => {
  const language = supportedLanguages.find(lang => lang.code === code);
  return language ? language.name : 'Unknown';
};
