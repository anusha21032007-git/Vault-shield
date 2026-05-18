import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as en from '@zxcvbn-ts/language-en';

const options = {
  translations: en.translations,
  graphs: common.adjacencyGraphs,
  dictionary: {
    ...common.dictionary,
    ...en.dictionary,
  },
};
zxcvbnOptions.setOptions(options);

export type StrengthLevel = 'Unsafe' | 'Risky' | 'Secure' | 'Fortified';

export interface AnalysisResult {
  score: number;
  strength: StrengthLevel;
  crackAttempts: string;
  entropy: number;
  feedback: {
    warning?: string;
    suggestions: string[];
  };
  metrics: {
    randomness: number; // 0-100
    guessProtection: number;
    patternSafety: number;
    attackResistance: number;
  };
}

export const analyzePassword = (password: string): AnalysisResult => {
  if (!password) {
    return {
      score: 0,
      strength: 'Unsafe',
      crackAttempts: '0',
      entropy: 0,
      feedback: { suggestions: [] },
      metrics: { randomness: 0, guessProtection: 0, patternSafety: 0, attackResistance: 0 }
    };
  }

  const result = zxcvbn(password);
  const score = result.score;
  
  const strengthMap: Record<number, StrengthLevel> = {
    0: 'Unsafe',
    1: 'Risky',
    2: 'Risky',
    3: 'Secure',
    4: 'Fortified',
  };

  // Scientific notation for crack attempts
  const attempts = result.guesses;
  const crackAttempts = attempts > 1000 ? attempts.toExponential(1).replace('e+', ' × 10^') : attempts.toString();

  return {
    score,
    strength: strengthMap[score],
    crackAttempts,
    entropy: Math.round(Math.log2(attempts)),
    feedback: {
      warning: result.feedback.warning || undefined,
      suggestions: result.feedback.suggestions,
    },
    metrics: {
      randomness: Math.min(100, (result.guessesLog10 / 15) * 100),
      guessProtection: score >= 3 ? 90 : score * 25,
      patternSafety: result.sequence.length < 3 ? 95 : 100 - (result.sequence.length * 10),
      attackResistance: score === 4 ? 98 : score * 20,
    }
  };
};

export const generateSmartSuggestions = (input: string): string[] => {
  if (!input || input.length < 2) return ['Vault#Secure!2024', 'Shield_Alpha_99', 'Cyber*Guard*7'];

  const base = input.replace(/[^a-zA-Z0-9]/g, '');
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
  
  const suffixes = ['Vault', 'Shield', 'Secure', 'Cyber', 'Neo', 'Alpha'];
  const symbols = ['#', '!', '@', '*', '_', '$'];
  const years = ['2024', '2025', '77', '07', '99'];

  const suggestions: string[] = [
    `${capitalized}${symbols[0]}Vault${years[0]}`,
    `${capitalized.slice(0, Math.ceil(base.length/2))}_${symbols[1]}${capitalized.slice(Math.ceil(base.length/2))}Secure`,
    `${symbols[2]}${capitalized}${years[1]}X`,
    `Neo${symbols[3]}${capitalized}${symbols[4]}Shield`,
  ];

  return suggestions.slice(0, 4);
};