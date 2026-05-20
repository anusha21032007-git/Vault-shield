"use client";

export class PasswordApplyEngine {
  /**
   * Safely injects a password into a target input element, bypassing framework state tracking
   * and triggering all necessary synthetic events so the website registers the change.
   */
  public static apply(input: HTMLInputElement, value: string): boolean {
    if (!input) return false;

    try {
      const oldValue = input.value;

      // 1. Get the native HTMLInputElement value setter from the prototype
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      
      if (nativeSetter) {
        nativeSetter.call(input, value);
      } else {
        input.value = value;
      }

      // 2. Bypass React 16+ value tracking by updating the internal tracker
      const tracker = (input as any)._valueTracker;
      if (tracker) {
        tracker.setValue(oldValue);
      }

      // 3. Dispatch native events to trigger framework state updates (React, Vue, Angular)
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      input.dispatchEvent(inputEvent);

      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      input.dispatchEvent(changeEvent);

      // 4. Dispatch keyboard events for maximum compatibility with strict validation forms
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }));
      input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, cancelable: true, key: 'Enter' }));
      input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter' }));

      // 5. Ensure the input is focused
      input.focus();

      return true;
    } catch (error) {
      console.error('[VaultShield] Failed to apply password via engine:', error);
      // Fallback to direct assignment
      input.value = value;
      return false;
    }
  }
}