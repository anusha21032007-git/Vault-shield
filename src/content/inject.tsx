import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingShield from '../components/FloatingShield';

class VaultShieldManager {
  private activeInput: HTMLInputElement | null = null;
  private container: HTMLDivElement | null = null;
  private root: any = null;
  private shadowRoot: ShadowRoot | null = null;

  constructor() {
    this.init();
  }

  private init() {
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        this.handleFocus(target);
      }
    }, true);

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'password') {
        // Small delay to allow clicking the dialog
        setTimeout(() => {
          if (document.activeElement !== this.activeInput) {
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
    this.mountDialog();
    
    input.addEventListener('input', this.handleInput);
  }

  private handleBlur() {
    if (this.activeInput) {
      this.activeInput.removeEventListener('input', this.handleInput);
    }
    this.unmountDialog();
    this.activeInput = null;
  }

  private handleInput = () => {
    this.renderDialog();
  };

  private mountDialog() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'vault-shield-root';
      this.shadowRoot = this.container.attachShadow({ mode: 'open' });
      
      // Inject Tailwind styles into Shadow DOM
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = (window as any).vaultShieldStyleUrl || ''; // In a real extension, this would be chrome.runtime.getURL
      this.shadowRoot.appendChild(styleLink);

      // Add a style tag for basic positioning and font
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        :host { all: initial; }
        .shield-wrapper { position: fixed; pointer-events: auto; z-index: 2147483647; }
      `;
      this.shadowRoot.appendChild(styleTag);

      document.body.appendChild(this.container);
      this.root = createRoot(this.shadowRoot);
    }
    this.renderDialog();
    this.updatePosition();
  }

  private unmountDialog() {
    if (this.root) {
      this.root.render(null);
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.root = null;
    }
  }

  private renderDialog() {
    if (!this.root || !this.activeInput) return;

    this.root.render(
      <div className="shield-wrapper">
        <FloatingShield 
          passwordValue={this.activeInput.value} 
          onApply={(val) => {
            if (this.activeInput) {
              this.activeInput.value = val;
              this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
              this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
              this.activeInput.focus();
            }
          }}
        />
      </div>
    );
  }

  private updatePosition() {
    if (!this.activeInput || !this.shadowRoot) return;
    
    const rect = this.activeInput.getBoundingClientRect();
    const wrapper = this.shadowRoot.querySelector('.shield-wrapper') as HTMLElement;
    
    if (wrapper) {
      // Position to the right of the input
      let top = rect.top;
      let left = rect.right + 15;

      // Check if it goes off screen
      if (left + 320 > window.innerWidth) {
        left = rect.left - 335; // Position to the left
      }
      
      if (top + 400 > window.innerHeight) {
        top = window.innerHeight - 420;
      }

      wrapper.style.top = `${Math.max(10, top)}px`;
      wrapper.style.left = `${Math.max(10, left)}px`;
    }
  }
}

// Initialize
new VaultShieldManager();