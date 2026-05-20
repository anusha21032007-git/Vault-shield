"use client";

export class PasswordApplyEngine {
  /**
   * Inject password into target element bypassing virtual DOM state tracking.
   * Dispatches both native events and framework-specific trigger hooks.
   */
  public static apply(input: HTMLInputElement, value: string): boolean {
    if (!input) return false;

    try {
      // 1. Ensure the element is focused
      input.focus();

      const oldValue = input.value;

      // 2. Override native prototype value setter (essential for React 15/16+)
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      
      if (nativeSetter) {
        nativeSetter.call(input, value);
      } else {
        input.value = value;
      }

      // 3. Update React's internal value tracker if it exists
      const tracker = (input as any)._valueTracker;
      if (tracker) {
        tracker.setValue(oldValue);
      }

      // 4. Dispatch InputEvent with standard inputType and data properties (Vue & React 17/18 compatibility)
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: value
      });
      input.dispatchEvent(inputEvent);

      // 5. Dispatch standard change event
      const changeEvent = new Event('change', { 
        bubbles: true, 
        cancelable: true 
      });
      input.dispatchEvent(changeEvent);

      // 6. Trigger keyboard simulation to satisfy strict validator listeners (e.g. key up detection)
      const keyEvents = ['keydown', 'keypress', 'keyup'];
      keyEvents.forEach((type) => {
        const keyEv = new KeyboardEvent(type, {
          bubbles: true,
          cancelable: true,
          key: 'a',
          code: 'KeyA',
          keyCode: 65,
          which: 65
        });
        input.dispatchEvent(keyEv);
      });

      // 7. Dispatch blur then focus again to trigger any dirty/validation states
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      input.focus();

      return true;
    } catch (error) {
      console.error('[VaultShield] Error applying password with engine:', error);
      input.value = value;
      return false;
    }
  }
}