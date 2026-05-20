import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingAssistant from '../components/FloatingAssistant';

class VaultShieldManager {
  private activeInput: HTMLInputElement | null = null;
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

    // Monitor for focus on password fields
    document.addEventListener('focusin', (e) => {
      if (!this.isEnabled) return;
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        this.handleFocus(target);
      }
    }, true);

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        setTimeout(() => {
          const shadowRoot = this.container?.shadowRoot;
          const activeInShadow = shadowRoot?.activeElement;
          
          if (document.activeElement !== this.activeInput && !activeInShadow) {
            this.handleBlur();
          }
        }, 200);
      }
    }, true);

    window.addEventListener('scroll', () => this.updatePosition(), true);
    window.addEventListener('resize', () => this.updatePosition());
  }

  private handleFocus(input: HTMLInputElement) {
    if (!this.isEnabled) return;
    this.activeInput = input;
    this.mountAssistant();
    input.addEventListener('input', this.handleInput);
  }

  private handleBlur() {
    if (this.activeInput) {
      this.activeInput.removeEventListener('input', this.handleInput);
    }
    this.unmountAssistant();
    this.activeInput = null;
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
    if (!this.root || !this.activeInput || !this.isEnabled) return;

    const currentValue = overrideValue !== undefined ? overrideValue : this.activeInput.value;

    this.root.render(
      <FloatingAssistant 
        passwordValue={currentValue} 
        onApply={(val) => {
          if (this.activeInput) {
            const input = this.activeInput;
            
            // Extremely robust native setter to bypass React/Vue/Angular state tracking
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (nativeSetter) {
              nativeSetter.call(input, val);
            } else {
              input.value = val;
            }

            // Dispatch events to trigger framework state updates
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Keyboard events
            input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
            input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, key: 'Enter' }));
            input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
            
            input.focus();

            // Explicitly re-render assistant with the new value immediately
            this.renderAssistant(val);

            // Also schedule a re-render after a short delay to capture any framework-level updates
            setTimeout(() => {
              this.renderAssistant();
            }, 50);
          }
        }}
      />
    );
  }

  private updatePosition() {
    if (!this.activeInput || !this.container) return;
    const rect = this.activeInput.getBoundingClientRect();
    const wrapper = this.container.shadowRoot?.querySelector('.assistant-wrapper') as HTMLElement;
    
    if (wrapper) {
      // Position the glowing circle cleanly below-left of the password field
      wrapper.style.top = `${rect.bottom + 6}px`;
      wrapper.style.left = `${rect.left + 4}px`;
    }
  }
}

new VaultShieldManager();