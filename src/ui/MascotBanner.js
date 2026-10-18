// src/ui/MascotBanner.js
import { eventBus } from '../core/EventBus.js';

export class MascotBanner {
  constructor() {
    this.textEl = document.getElementById('feedback-text');
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('feedback:cheer', (text) => {
      this.setText(text);
    });

    eventBus.on('instruction:changed', (text) => {
      this.setText(text);
    });
  }

  setText(text) {
    if (this.textEl) {
      this.textEl.textContent = text;
    }
  }
}
