import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingAssistant from '../components/FloatingAssistant';
import { PasswordFieldManager } from '../utils/PasswordFieldManager';
import { PasswordApplyEngine } from '../utils/PasswordApplyEngine';

class VaultShieldManager {
  private fieldManager: PasswordFieldManager | null = null;
  private container: HTMLDivElement | null = null;
  private root: any = null;
  private isEnabled: boolean = true;

  constructor() {
    this.init();
  }

  private async init() {
    // Initial state check
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get(['vaultShieldActive']);
      this.isEnabled = result.vaultShieldActive !== false;

      // Listen for state changes
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.vaultShieldActive) {
          this.isEnabled = changes.vaultShieldActive.newValue;
          if (!this.isEnabled) {
            this.handleBlur();
          }
        }
      });
    }

    // Initialize PasswordFieldManager to track active focused fields
    this.fieldManager = new PasswordFieldManager(
      (input) => this.handleFocus(input),
      () => this.handleBlur()
    );

    window.addEventListener('scroll', () => this.updatePosition(), true);
    window.addEventListener('resize', () => this.updatePosition());
  }

  private handleFocus(input: HTMLInputElement) {
    if (!this.isEnabled) return;
    this.mountAssistant();
    input.addEventListener('input', this.handleInput);
  }

  private handleBlur() {
    const activeInput = this.fieldManager?.getActiveInput();
    if (activeInput) {
      activeInput.removeEventListener('input', this.handleInput);
    }
    this.unmountAssistant();
  }

  private handleInput = () => {
    if (!this.isEnabled) return;
    this.renderAssistant();
  };

  private mountAssistant() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'vault-shield-assistant-root';
      // Make the host element layout-invisible so it cannot affect the host page
      this.container.style.cssText = 'all: initial !important; position: absolute !important; width: 0 !important; height: 0 !important; overflow: visible !important; pointer-events: none !important;';

      const shadow = this.container.attachShadow({ mode: 'open' });

      // Isolation reset: fully decouple extension UI from host page styles.
      // :host prevents layout interference; .assistant-wrapper resets inherited
      // properties (font, color, line-height) that cross Shadow DOM boundaries.
      const isolationStyle = document.createElement('style');
      isolationStyle.textContent = `
        :host {
          all: initial !important;
          position: absolute !important;
          width: 0 !important;
          height: 0 !important;
          overflow: visible !important;
          pointer-events: none !important;
          opacity: 1 !important;
          filter: none !important;
          transform: none !important;
          clip: auto !important;
          clip-path: none !important;
          visibility: visible !important;
        }

        .assistant-wrapper {
          all: initial;
          display: block;
          position: fixed;
          z-index: 2147483647;
          pointer-events: none;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #cbd5e1;
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0;
          text-shadow: none;
          text-align: left;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .assistant-wrapper *, .assistant-wrapper *::before, .assistant-wrapper *::after {
          box-sizing: border-box;
        }
      `;
      shadow.appendChild(isolationStyle);

      // Load Tailwind utilities inside Shadow DOM — fully scoped, cannot leak to host page
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL('assets/main.css') : '';
      shadow.appendChild(styleLink);

      const wrapper = document.createElement('div');
      wrapper.className = 'assistant-wrapper';
      shadow.appendChild(wrapper);

      document.body.appendChild(this.container);
      this.root = createRoot(wrapper);
    }
    this.renderAssistant();
    this.updatePosition();
  }

  private unmountAssistant() {
    if (this.root) this.root.render(null);
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.root = null;
    }
  }

  private renderAssistant(overrideValue?: string) {
    const activeInput = this.fieldManager?.getActiveInput();
    if (!this.root || !activeInput || !this.isEnabled) return;

    const currentValue = overrideValue !== undefined ? overrideValue : activeInput.value;

    this.root.render(
      <FloatingAssistant 
        passwordValue={currentValue} 
        onApply={(val) => {
          const input = this.fieldManager?.getActiveInput();
          if (input) {
            // Use the robust PasswordApplyEngine to inject the password
            PasswordApplyEngine.apply(input, val);

            // Explicitly re-render assistant with the new value immediately
            this.renderAssistant(val);

            // Schedule a re-render after a short delay to capture any framework-level updates
            setTimeout(() => {
              this.renderAssistant();
            }, 50);
          }
        }}
      />
    );
  }

  private updatePosition() {
    const activeInput = this.fieldManager?.getActiveInput();
    if (!activeInput || !this.container) return;
    const rect = activeInput.getBoundingClientRect();
    const wrapper = this.container.shadowRoot?.querySelector('.assistant-wrapper') as HTMLElement;
    
    if (wrapper) {
      // Position the glowing circle cleanly below-left of the password field
      wrapper.style.top = `${rect.bottom + 6}px`;
      wrapper.style.left = `${rect.left + 4}px`;
    }
  }
}

new VaultShieldManager();