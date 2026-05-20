"use client";

export interface MutationCategory {
  password: string;
  type: 'Familiar' | 'Balanced' | 'Fortress';
  description: string;
  explanation: string;
}

export class PasswordMutationEngine {
  private static nouns = ['Volt', 'Shield', 'River', 'Sky', 'Quantum', 'Peak', 'Nova', 'Crest', 'Ridge', 'Glade', 'Spire', 'Forge'];
  private static adjectives = ['Swift', 'Calm', 'Bright', 'Deep', 'Vast', 'Bold', 'True', 'Pure', 'Safe', 'Wise', 'Keen', 'Grand'];

  /**
   * Generates human-centered, memorable password mutations based on a user's memory anchor.
   */
  public static generate(input: string): MutationCategory[] {
    if (!input) return [];
    const clean = input.trim();
    if (clean.length === 0) return [];

    // Extract a memory anchor (alphabetic part of the input)
    const anchorMatch = clean.match(/[a-zA-Z]+/);
    const anchor = anchorMatch ? anchorMatch[0] : 'Vault';
    const capitalizedAnchor = anchor.charAt(0).toUpperCase() + anchor.slice(1).toLowerCase();

    // Extract any numbers present in the original input
    const numberMatch = clean.match(/\d+/);
    const originalNum = numberMatch ? numberMatch[0] : '21';

    // Select random words for generation
    const noun = this.nouns[Math.abs(this.hashCode(clean)) % this.nouns.length];
    const adj = this.adjectives[Math.abs(this.hashCode(clean + 'adj')) % this.adjectives.length];

    // 1. Familiar Mode: Easiest to remember, closest to original structure
    const familiar = `${capitalizedAnchor}${noun}#${originalNum}`;
    
    // 2. Balanced Mode: Ideal entropy/memory balance (Default)
    const balanced = `${adj}_${capitalizedAnchor}#${originalNum}!`;

    // 3. Fortress Mode: Highest security, lower memorability
    const fortress = `${adj}${capitalizedAnchor}${noun}@${originalNum}x!`;

    return [
      {
        password: familiar.slice(0, 32),
        type: 'Familiar',
        description: 'Easiest to remember',
        explanation: 'Preserves your original memory anchor and appends a simple, structured word.'
      },
      {
        password: balanced.slice(0, 32),
        type: 'Balanced',
        description: 'Ideal balance',
        explanation: 'Inserts a clean adjective prefix and breaks predictable suffix patterns.'
      },
      {
        password: fortress.slice(0, 32),
        type: 'Fortress',
        description: 'Maximum security',
        explanation: 'Combines multiple word anchors with complex separators to resist advanced GPU cracking.'
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