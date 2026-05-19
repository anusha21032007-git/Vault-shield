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

export interface ThreatMetric {
  label: string;
  risk: number; // 0-100
  status: 'Vulnerable' | 'Moderate' | 'Resistant' | 'Highly Resistant';
}

export interface AnalysisResult {
  score: number;
  strength: StrengthLevel;
  crackAttempts: string;
  entropy: number;
  warnings: string[];
  threats: ThreatMetric[];
  metrics: {
    randomness: number;
    guessProtection: number;
    patternSafety: number;
    attackResistance: number;
  };
}

export const analyzePassword = (password: string): AnalysisResult => {
  if (!password) return {
    score: 0, strength: 'Unsafe', crackAttempts: '0', entropy: 0, warnings: [],
    threats: [],
    metrics: { randomness: 0, guessProtection: 0, patternSafety: 0, attackResistance: 0 }
  };

  const result = zxcvbn(password);
  const score = result.score;
  
  const warnings: string[] = [];
  if (result.feedback.warning) warnings.push(result.feedback.warning);
  
  // Custom pattern detection
  if (/\d{4}/.test(password)) warnings.push("Potential birth year detected");
  if (/(.)\1{2,}/.test(password)) warnings.push("Repeated character sequence detected");
  if (/123|abc|qwerty/i.test(password)) warnings.push("Common keyboard pattern detected");

  const strengthMap: Record<number, StrengthLevel> = {
    0: 'Unsafe', 1: 'Risky', 2: 'Risky', 3: 'Secure', 4: 'Fortified',
  };

  const getStatus = (val: number): ThreatMetric['status'] => {
    if (val > 80) return 'Highly Resistant';
    if (val > 60) return 'Resistant';
    if (val > 30) return 'Moderate';
    return 'Vulnerable';
  };

  const threats: ThreatMetric[] = [
    { label: 'Brute Force', risk: Math.min(100, (result.guessesLog10 / 15) * 100), status: 'Vulnerable' },
    { label: 'Dictionary Attack', risk: score >= 3 ? 90 : score * 25, status: 'Vulnerable' },
    { label: 'Pattern Prediction', risk: 100 - (result.sequence.length * 8), status: 'Vulnerable' },
    { label: 'Credential Stuffing', risk: score * 22, status: 'Vulnerable' },
    { label: 'AI Guessing', risk: Math.max(10, score * 20 - 5), status: 'Vulnerable' }
  ];

  threats.forEach(t => t.status = getStatus(t.risk));

  return {
    score,
    strength: strengthMap[score],
    crackAttempts: result.guesses > 1000 ? result.guesses.toExponential(1).replace('e+', ' × 10^') : result.guesses.toString(),
    entropy: Math.round(Math.log2(result.guesses)),
    warnings,
    threats,
    metrics: {
      randomness: Math.min(100, (result.guessesLog10 / 15) * 100),
      guessProtection: score >= 3 ? 90 : score * 25,
      patternSafety: 100 - (result.sequence.length * 8),
      attackResistance: score === 4 ? 98 : score * 20,
    }
  };
};

export const generateMutations = (input: string): string[] => {
  if (!input || input.length < 2) return [];

  const base = input.trim();
  const salt = () => Math.floor(Math.random() * 900 + 100);
  const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '++'];
  const sym = () => symbols[Math.floor(Math.random() * symbols.length)];

  // Mutation 1: Structural Reinforcement
  const m1 = `&${base.charAt(0).toUpperCase()}${base.slice(1)}${sym()}${sym()}${salt()}`;

  // Mutation 2: Entropy Injection
  const m2 = `${sym()}${base.split('').map(c => Math.random() > 0.7 ? c.toUpperCase() : c).join('')}${salt()}${sym()}`;

  // Mutation 3: Complexity Expansion
  const m3 = `${base.replace(/[aeiou]/gi, (m) => m + sym())}${salt()}${sym()}`;

  return [m1, m2, m3].map(s => s.slice(0, 24)); // Cap length
};