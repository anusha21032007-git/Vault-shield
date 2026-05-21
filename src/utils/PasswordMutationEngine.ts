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

    // Deterministic entropy helpers based on input to guarantee same output for same input
    const seed = clean.length + letters.charCodeAt(0) + digits.charCodeAt(0);
    const getSym = (offset: number) => {
      const syms = ['#', '!', '$', '%', '*', '+', '?'];
      return syms[(seed + offset) % syms.length];
    };
    const getSuffix = (offset: number) => {
      const sufs = ['x', 'Q', 'K', 'X9', 'M', 'v2', 'Z'];
      return sufs[(seed + offset) % sufs.length];
    };

    // Helper: Capitalize specific indices
    const capIndices = (str: string, indices: number[]) => {
      return str.split('').map((char, i) => 
        indices.includes(i) ? char.toUpperCase() : char.toLowerCase()
      ).join('');
    };

    // 1. Familiar: Controlled capitalization & compact suffix mutation
    // Example: "AnU@21#4x"
    const famLetters = capIndices(letters, [0, 2]);
    const familiar = `${famLetters}${baseSymbol}${digits}${getSym(1)}${Math.floor((seed % 9)) + 1}${getSuffix(1).toLowerCase()}`;
    const familiarExplanation = "Strategically capitalizes specific letters and appends a compact, unpredictable suffix.";

    // 2. Balanced: Middle-position symbol insertion & unpredictable character placement
    // Example: "aN_u@21!K"
    const midIdx = Math.max(1, Math.floor(letters.length / 2));
    const balLeft = capIndices(letters.slice(0, midIdx), [1]);
    const balRight = letters.slice(midIdx).toLowerCase();
    const balanced = `${balLeft}_${balRight}${baseSymbol}${digits}${getSym(2)}${getSuffix(2).toUpperCase()}`;
    const balancedExplanation = "Inserts a middle-position separator and applies controlled capitalization for structural strength.";

    // 3. Fortress: Original identity preserved with middle entropy and dynamic suffix
    // Example: "Anu#21_X9"
    const fortLetters = capIndices(letters, [0]);
    const fortress = `${fortLetters}${altSymbol}${digits}_${getSuffix(3).toUpperCase()}${Math.floor((seed % 9)) + 1}`;
    const fortressExplanation = "Preserves primary identity while shifting symbols and adding an entropy-rich suffix block.";

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