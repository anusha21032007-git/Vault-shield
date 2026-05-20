"use client";

export interface MutationCategory {
  password: string;
  type: 'Familiar' | 'Balanced' | 'Fortress';
  description: string;
  explanation: string;
}

export class PasswordMutationEngine {
  private static humanWords = ['Sky', 'Nova', 'Orbit', 'River', 'Volt', 'Echo', 'Blue', 'Titan', 'Apex', 'Star', 'Zenith', 'Dawn'];

  /**
   * Generates human-centered, memorable password mutations based on a user's memory anchor.
   * Focuses on premium, recognizable chunks and typing rhythm.
   */
  public static generate(input: string): MutationCategory[] {
    if (!input) return [];
    const clean = input.trim();
    if (clean.length === 0) return [];

    // Parse the input for alphabetical anchor and numerical parts
    const anchorMatch = clean.match(/[a-zA-Z]+/g);
    const primaryAnchor = anchorMatch ? anchorMatch[0] : 'Anu';
    const secondaryAnchor = (anchorMatch && anchorMatch.length > 1) ? anchorMatch[1] : '';
    
    // Capitalize the anchor properly for readability
    const capAnchor = primaryAnchor.charAt(0).toUpperCase() + primaryAnchor.slice(1).toLowerCase();
    const capSecAnchor = secondaryAnchor ? secondaryAnchor.toUpperCase() : '';

    const numberMatch = clean.match(/\d+/);
    const originalNum = numberMatch ? numberMatch[0] : '21';

    // Seeded word selection
    const seed = Math.abs(this.hashCode(clean));
    const word1 = this.humanWords[seed % this.humanWords.length];
    const word2 = this.humanWords[(seed + 3) % this.humanWords.length];

    // 1. Familiar: Easiest to remember. Closest to original, adds a clean premium word.
    // e.g. "AnuBlue#21"
    const familiar = `${capAnchor}${word1}#${originalNum}`;
    const familiarExplanation = "Keeps your original memory anchor and appends a simple, memorable suffix.";

    // 2. Balanced: Ideal entropy and memory balance. Breaks suffix patterns.
    // e.g. "Anu21!SHA#Orbit" or "SkyAnu!21"
    const balanced = capSecAnchor 
      ? `${capAnchor}${originalNum}!${capSecAnchor}#${word2}`
      : `Sky${capAnchor}!${originalNum}`;
    const balancedExplanation = "Inserts middle entropy and removes predictable suffix patterns.";

    // 3. Fortress: Maximum safety, structurally safe but still memorable.
    // e.g. "AnuRiver@47"
    const fortress = `${word1}${capAnchor}_${word2}@${originalNum}`;
    const fortressExplanation = "Combines multiple human-friendly anchors with structural division.";

    return [
      {
        password: familiar.slice(0, 32),
        type: 'Familiar',
        description: 'Easiest to remember',
        explanation: familiarExplanation
      },
      {
        password: balanced.slice(0, 32),
        type: 'Balanced',
        description: 'Ideal balance',
        explanation: balancedExplanation
      },
      {
        password: fortress.slice(0, 32),
        type: 'Fortress',
        description: 'Maximum security',
        explanation: fortressExplanation
      }
    ];
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
}