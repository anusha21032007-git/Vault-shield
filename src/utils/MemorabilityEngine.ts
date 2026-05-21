"use client";

export interface MemorabilityMetrics {
  securityScore: number; // 0-100
  memorabilityScore: number; // 0-100
  predictabilityResistance: number; // 0-100
  entropyScore: number; // 0-100
  label: string;
  guessDifficulty: string;
  memoryConfidence: string;
}

export class MemorabilityEngine {
  public static analyze(password: string): MemorabilityMetrics {
    if (!password) {
      return {
        securityScore: 0,
        memorabilityScore: 0,
        predictabilityResistance: 0,
        entropyScore: 0,
        label: 'Weak',
        guessDifficulty: '≈ 10⁰ attempts',
        memoryConfidence: 'None'
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

    // Calculate Predictability Resistance & Pattern Reductions
    let predictabilityPenalty = 0;
    let patternReduction = 0; // Exponent reduction for predictable patterns
    
    if (/123|abc|qwerty/i.test(password)) {
      predictabilityPenalty += 30;
      patternReduction += 3;
    }
    if (/\d{4}/.test(password)) {
      predictabilityPenalty += 15; // Birth year pattern
      patternReduction += 2; // e.g. 1999 is only ~100 common years, so 10^2 instead of 10^4
    }
    const repeatMatch = password.match(/(.)\1{2,}/);
    if (repeatMatch) {
      predictabilityPenalty += 20; // Repeated chars
      patternReduction += (repeatMatch[0].length - 1); 
    }
    
    const predictabilityResistance = Math.max(10, 100 - predictabilityPenalty);

    // Calculate Memorability Score
    const wordCount = (password.match(/[A-Z][a-z]+/g) || []).length;
    let memorabilityScore = 50;
    if (wordCount >= 2) memorabilityScore += 30;
    if (len < 16) memorabilityScore += 15; 
    if (hasSpecial) memorabilityScore -= 10; 
    memorabilityScore = Math.min(100, Math.max(20, memorabilityScore));

    // Calculate Overall Security Score
    const securityScore = Math.min(100, Math.round((entropyScore * 0.6) + (predictabilityResistance * 0.4)));

    // Determine Smart, Confidence-building Labels
    let label = 'Weak';
    if (securityScore > 75) {
      label = 'Strong';
    } else if (securityScore > 40) {
      label = 'Balanced';
    }

    // Determine Human-Friendly Metrics
    let memoryConfidence = 'Low';
    if (memorabilityScore > 80) memoryConfidence = 'Exceptional';
    else if (memorabilityScore > 60) memoryConfidence = 'High';
    else if (memorabilityScore > 40) memoryConfidence = 'Moderate';

    // Calculate realistic guess attempts based on base-10 exponent
    // base-10 exponent = len * log10(poolSize)
    let rawExponent = len * Math.log10(poolSize || 1);
    
    // Severely punish raw exponent if the password is just a dictionary word with no real entropy
    if (poolSize === 26 && len < 10) {
       // A single short dictionary word isn't 26^L attempts, it's ~10^5
       rawExponent = Math.min(rawExponent, 5);
    }
    
    // Apply predictable pattern reductions
    let finalExponent = Math.max(0, Math.round(rawExponent - patternReduction));
    
    // Format exponent nicely (e.g. 10⁶)
    const map: Record<string, string> = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
    const exponentStr = finalExponent.toString().split('').map(c => map[c] || c).join('');
    const guessDifficulty = `≈ 10${exponentStr} attempts`;

    return {
      securityScore,
      memorabilityScore,
      predictabilityResistance,
      entropyScore,
      label,
      guessDifficulty,
      memoryConfidence
    };
  }
}