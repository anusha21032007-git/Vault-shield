import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as en from '@zxcvbn-ts/language-en';

const options = {
  translations: en.translations,
  graphs: common.adjacencyGraphs,
  dictionary: { ...common.dictionary, ...en.dictionary },
};
zxcvbnOptions.setOptions(options);

export type StrengthLevel = 'Unsafe' | 'Risky' | 'Secure' | 'Fortified';

export interface AnalysisResult {
  score: number;
  strength: StrengthLevel;
  crackAttempts: string;
  entropy: number;
  metrics: {
    randomness: number;
    guessProtection: number;
    patternSafety: number;
    attackResistance: number;
  };
}

export const analyzePassword = (password: string): AnalysisResult => {
  if (!password) return {
    score: 0, strength: 'Unsafe', crackAttempts: '0', entropy: 0,
    metrics: { randomness: 0, guessProtection: 0, patternSafety: 0, attackResistance: 0 }
  };

  const result = zxcvbn(password);
  const score = result.score;
  const strengthMap: Record<number, StrengthLevel> = {
    0: 'Unsafe', 1: 'Risky', 2: 'Risky', 3: 'Secure', 4: 'Fortified',
  };

  return {
    score,
    strength: strengthMap[score],
    crackAttempts: result.guesses > 1000 ? result.guesses.toExponential(1).replace('e+', ' × 10^') : result.guesses.toString(),
    entropy: Math.round(Math.log2(result.guesses)),
    metrics: {
      randomness: Math.min(100, (result.guessesLog10 / 15) * 100),
      guessProtection: score >= 3 ? 90 : score * 25,
      patternSafety: result.sequence.length < 3 ? 95 : 100 - (result.sequence.length * 10),
      attackResistance: score === 4 ? 98 : score * 20,
    }
  };
};

export const mutatePassword = (input: string): { balanced: string, cyber: string, fortified: string } => {
  if (!input) return { balanced: '', cyber: '', fortified: '' };

  const base = input.trim();
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
  
  // Mutation 1: Balanced Secure (Memorable + Symbols)
  const balanced = `${capitalized.replace(/[aA]/g, '@').replace(/[sS]/g, '$')}#${Math.floor(Math.random() * 90 + 10)}`;

  // Mutation 2: Cyber Mutation (Stretched + Separators)
  const cyber = `&${base.split('').join('.')}!!X${Math.floor(Math.random() * 9 + 1)}`;

  // Mutation 3: Fortified Chaos (High Entropy Transformation)
  const fortified = `@${capitalized.split('').map(c => Math.random() > 0.7 ? c + '*' : c).join('')}$%${Date.now().toString().slice(-3)}`;

  return { balanced, cyber, fortified };
};