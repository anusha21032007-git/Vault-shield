"use client";

export interface ThreatGuess {
  guess: string;
  type: string;
  timeToCrack: string;
}

export class ThreatSimulationEngine {
  private static toSuperscript(num: number): string {
    const map: Record<string, string> = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
    return num.toString().split('').map(c => map[c] || c).join('');
  }

  /**
   * Simulates likely attacker guesses based on the user's input password.
   */
  public static simulate(password: string): ThreatGuess[] {
    if (!password) return [];

    const clean = password.trim().toLowerCase();
    const anchor = clean.replace(/[^a-z]/g, '') || 'user';
    const aLen = anchor.length;
    
    // Dynamic math string based on the anchor length.
    const alpha = `26${this.toSuperscript(aLen)}`;

    return [
      {
        guess: `${anchor}123`,
        type: 'Dictionary Suffix Attack',
        timeToCrack: `${alpha} × 10³ ops`
      },
      {
        guess: `${anchor}@123`,
        type: 'Common Symbol Mutation',
        timeToCrack: `${alpha} × 33 × 10³ ops`
      },
      {
        guess: `${anchor}2007`,
        type: 'Birth Year Guessing',
        timeToCrack: `${alpha} × 10² ops`
      },
      {
        guess: `${anchor.charAt(0).toUpperCase() + anchor.slice(1)}@21`,
        type: 'Standard Capitalization',
        timeToCrack: `2 × ${alpha} × 33 × 10² ops`
      }
    ];
  }
}