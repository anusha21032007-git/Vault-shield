"use client";

export interface MutationCategory {
  password: string;
  type: 'Familiar' | 'Balanced' | 'Fortress';
  description: string;
  explanation: string;
}

export class PasswordMutationEngine {
  /**
   * Generates familiar, human-centered password mutations with hidden structural strength.
   * Completely avoids artificial random words, focusing purely on smart, believable transformations.
   */
  public static generate(input: string): MutationCategory[] {
    if (!input) return [];
    const clean = input.trim();
    if (clean.length === 0) return [];

    // Parse the structural components of the original password
    const letters = clean.replace(/[^a-zA-Z]/g, '') || 'pass';
    const digits = clean.replace(/[^0-9]/g, '') || '09';
    const originalSymbols = clean.replace(/[a-zA-Z0-9]/g, '');

    // Pick a stable, clean symbol
    const baseSymbol = originalSymbols.length > 0 ? originalSymbols[0] : '@';
    const altSymbol = baseSymbol === '@' ? '#' : '!';

    // Helper: Smart capitalization of a character in a specific index
    const smartCapitalize = (str: string, index: number) => {
      if (str.length <= index) return str.charAt(0).toUpperCase() + str.slice(1);
      return str.slice(0, index) + str.charAt(index).toUpperCase() + str.slice(index + 1);
    };

    // 1. Familiar: Strategic Capitalization + Controlled Suffix
    // Examples: "karThi@09", "Karthi@09_x"
    const capitalizedLetters = smartCapitalize(letters, Math.min(3, letters.length - 1));
    const familiar = `${capitalizedLetters}${baseSymbol}${digits}_x`;
    const familiarExplanation = "Preserves your original structure while adding a clean, short suffix.";

    // 2. Balanced: Structural Chunking + Symbol Relocation
    // Examples: "Kar_thi09@", "kar_thi@09"
    const midIndex = Math.floor(letters.length / 2);
    const chunkedLetters = letters.length > 2
      ? letters.slice(0, midIndex) + '_' + letters.slice(midIndex)
      : letters;
    const balancedLetters = chunkedLetters.charAt(0).toUpperCase() + chunkedLetters.slice(1);
    const balanced = `${balancedLetters}${baseSymbol}${digits}`;
    const balancedExplanation = "Introduces structural chunking for high memory retention.";

    // 3. Fortress: Middle Entropy Insertion + Symbol Shift
    // Examples: "karXthi09!", "Ka9rthi@"
    const midChar = 'X';
    const middleEntropyLetters = letters.length > 2
      ? letters.slice(0, midIndex) + midChar + letters.slice(midIndex)
      : letters + midChar;
    const fortressLetters = middleEntropyLetters.charAt(0).toUpperCase() + middleEntropyLetters.slice(1);
    const fortress = `${fortressLetters}${digits}${altSymbol}`;
    const fortressExplanation = "Inserts middle-position entropy to resist dictionary attacks.";

    return [
      {
        password: familiar.slice(0, 32),
        type: 'Familiar',
        description: 'Personally evolved',
        explanation: familiarExplanation
      },
      {
        password: balanced.slice(0, 32),
        type: 'Balanced',
        description: 'Naturally stronger',
        explanation: balancedExplanation
      },
      {
        password: fortress.slice(0, 32),
        type: 'Fortress',
        description: 'Believable security',
        explanation: fortressExplanation
      }
    ];
  }
}