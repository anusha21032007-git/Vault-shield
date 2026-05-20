"use client";

export interface ThreatGuess {
  guess: string;
  type: string;
  timeToCrack: string;
}

export class ThreatSimulationEngine {
  /**
   * Simulates likely attacker guesses based on the user's input password.
   */
  public static simulate(password: string): ThreatGuess[] {
    if (!password) return [];

    const clean = password.trim().toLowerCase();
    const anchor = clean.replace(/[^a-z]/g, '') || 'user';

    return [
      {
        guess: `${anchor}123`,
        type: 'Dictionary Suffix Attack',
        timeToCrack: '< 1 second'
      },
      {
        guess: `${anchor}@123`,
        type: 'Common Symbol Mutation',
        timeToCrack: '< 2 seconds'
      },
      {
        guess: `${anchor}2007`,
        type: 'Birth Year Guessing',
        timeToCrack: '< 5 seconds'
      },
      {
        guess: `${anchor.charAt(0).toUpperCase() + anchor.slice(1)}@21`,
        type: 'Standard Capitalization',
        timeToCrack: '< 10 seconds'
      }
    ];
  }
}