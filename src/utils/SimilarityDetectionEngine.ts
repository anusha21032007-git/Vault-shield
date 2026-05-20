"use client";

export interface SimilarityResult {
  isSimilar: boolean;
  warning?: string;
}

export class SimilarityDetectionEngine {
  private static knownSignatures: Set<string> = new Set();

  /**
   * Generates an anonymous structural signature of a password.
   * E.g., "anu@21" -> "aaa@dd"
   */
  public static getStructuralSignature(password: string): string {
    return password
      .split('')
      .map((char) => {
        if (/[a-z]/.test(char)) return 'a';
        if (/[A-Z]/.test(char)) return 'A';
        if (/\d/.test(char)) return 'd';
        return char;
      })
      .join('');
  }

  /**
   * Checks if the password is structurally similar to previously analyzed passwords.
   */
  public static checkSimilarity(password: string): SimilarityResult {
    if (!password || password.length < 3) return { isSimilar: false };

    const signature = this.getStructuralSignature(password);
    
    if (this.knownSignatures.has(signature)) {
      return {
        isSimilar: true,
        warning: 'Structural password reuse detected. Attackers can easily guess this pattern.'
      };
    }

    // Store signature anonymously
    this.knownSignatures.add(signature);
    return { isSimilar: false };
  }
}