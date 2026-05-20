"use client";

export class BreachPatternEngine {
  private static commonBreachedPatterns = [
    'password123',
    'qwerty',
    'admin@123',
    'iloveyou',
    '123456',
    'password',
    'letmein',
    'welcome'
  ];

  /**
   * Checks if the password pattern appears frequently in breach datasets.
   */
  public static checkBreach(password: string): boolean {
    if (!password) return false;
    const clean = password.trim().toLowerCase();
    return this.commonBreachedPatterns.some((pattern) => clean.includes(pattern));
  }
}