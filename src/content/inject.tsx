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
      const shadow = this.container.attachShadow({ mode: 'open' });
      
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL('assets/main.css') : '';
      shadow.appendChild(styleLink);

      const wrapper = document.createElement('div');
      wrapper.className = 'assistant-wrapper';
      wrapper.style.cssText = 'position: fixed; z-index: 2147483647; pointer-events: none;';
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