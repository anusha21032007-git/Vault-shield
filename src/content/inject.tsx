import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingAssistant from '../components/FloatingAssistant';

class VaultShieldManager {
  private activeInput: HTMLInputElement | null = null;
  private container: HTMLDivElement | null = null;
  private root: any = null;

  constructor() {
    this.init();
  }

  private init() {
    // Monitor for focus on password fields
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        this.handleFocus(target);
      }
    }, true);

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        // Small delay to check if focus moved to the assistant itself
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
    this.renderAssistant();
  };

  private mountAssistant() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'vault-shield-assistant-root';
      const shadow = this.container.attachShadow({ mode: 'open' });
      
      // Inject Tailwind styles
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

  private renderAssistant() {
    if (!this.root || !this.activeInput) return;

    this.root.render(
      <FloatingAssistant 
        passwordValue={this.activeInput.value} 
        onApply={(val) => {
          if (this.activeInput) {
            // Robust value setting for React/Vue/Angular sites
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(this.activeInput, val);
            } else {
              this.activeInput.value = val;
            }

            // Trigger events so the website knows the value changed
            this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
            this.activeInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
            this.activeInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
            
            this.activeInput.focus();
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
      wrapper.style.top = `${rect.bottom + 10}px`;
      wrapper.style.left = `${rect.left}px`;
    }
  }
}

new VaultShieldManager();