"use client";

export class PasswordFieldManager {
  private activeInput: HTMLInputElement | null = null;
  private onFocusCallback: (input: HTMLInputElement) => void = () => {};
  private onBlurCallback: () => void = () => {};
  private observer: MutationObserver | null = null;

  constructor(
    onFocus: (input: HTMLInputElement) => void,
    onBlur: () => void
  ) {
    this.onFocusCallback = onFocus;
    this.onBlurCallback = onBlur;
    this.init();
  }

  private init() {
    // Listen for focus events globally (capturing phase to catch dynamic elements)
    document.addEventListener('focusin', this.handleFocusIn, true);
    document.addEventListener('focusout', this.handleFocusOut, true);

    // Set up MutationObserver to detect dynamically added password fields
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.scanForPasswordFields(node);
            }
          });
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private handleFocusIn = (e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    if (this.isPasswordField(target)) {
      this.activeInput = target;
      this.onFocusCallback(target);
    }
  };

  private handleFocusOut = (e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    if (this.isPasswordField(target)) {
      // Small delay to allow focus to transition to the assistant UI without triggering blur
      setTimeout(() => {
        if (document.activeElement !== this.activeInput) {
          this.onBlurCallback();
        }
      }, 150);
    }
  };

  private isPasswordField(element: HTMLElement | null): element is HTMLInputElement {
    if (!element) return false;
    return (
      element.tagName === 'INPUT' &&
      (element as HTMLInputElement).type === 'password'
    );
  }

  private scanForPasswordFields(root: HTMLElement) {
    const passwordInputs = root.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
      // We can attach specific listeners or prepare them if needed
    });
  }

  public getActiveInput(): HTMLInputElement | null {
    return this.activeInput;
  }

  public destroy() {
    document.removeEventListener('focusin', this.handleFocusIn, true);
    document.removeEventListener('focusout', this.handleFocusOut, true);
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}