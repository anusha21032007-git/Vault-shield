"use client";

export interface MemorabilityMetrics {
  securityScore: number; // 0-100
  memorabilityScore: number; // 0-100
  predictabilityResistance: number; // 0-100
  entropyScore: number; // 0-100
  label: string;
}

export class MemorabilityEngine {
  public static analyze(password: string): MemorabilityMetrics {
    if (!password) {
      return {
        securityScore: 0,
        memorabilityScore: 0,
        predictabilityResistance: 0,
        entropyScore: 0,
        label: 'Predictable'
      };
    }

    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Calculate Entropy Score
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigit) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    const entropy = len * Math.log2(poolSize || 1);
    const entropyScore = Math.min(100, Math.round((entropy / 120) * 100));

    // Calculate Predictability Resistance
    let predictabilityPenalty = 0;
    if (/123|abc|qwerty/i.test(password)) predictabilityPenalty += 30;
    if (/\d{4}/.test(password)) predictabilityPenalty += 15; // Birth year pattern
    if (/(.)\1{2,}/.test(password)) predictabilityPenalty += 20; // Repeated chars
    const predictabilityResistance = Math.max(10, 100 - predictabilityPenalty);

    // Calculate Memorability Score
    // Human-centered passwords with readable words are highly memorable
    const wordCount = (password.match(/[A-Z][a-z]+/g) || []).length;
    let memorabilityScore = 50;
    if (wordCount >= 2) memorabilityScore += 30;
    if (len < 16) memorabilityScore += 15; // Shorter is easier to remember
    if (hasSpecial) memorabilityScore -= 10; // Special characters reduce memorability slightly
    memorabilityScore = Math.min(100, Math.max(20, memorabilityScore));

    // Calculate Overall Security Score
    const securityScore = Math.min(100, Math.round((entropyScore * 0.6) + (predictabilityResistance * 0.4)));

    // Determine Smart Label
    let label = 'Predictable';
    if (securityScore > 85) {
      label = 'High Resistance';
    } else if (securityScore > 70) {
      label = 'Strongly Balanced';
    } else if (securityScore > 50) {
      label = 'Unsafe Structure';
    } else if (securityScore > 30) {
      label = 'Easily Guessable';
    }

    return {
      securityScore,
      memorabilityScore,
      predictabilityResistance,
      entropyScore,
      label
    };
  }
}