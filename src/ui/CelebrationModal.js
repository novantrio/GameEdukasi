// src/ui/CelebrationModal.js
import confetti from 'canvas-confetti';
import { eventBus } from '../core/EventBus.js';

export class CelebrationModal {
  constructor() {
    this.modal = document.getElementById('celebration-dialog');
    this.title = document.getElementById('modal-title');
    this.desc = document.getElementById('modal-desc');
    this.homeBtn = document.getElementById('btn-celebration-home');
    this.reportBtn = document.getElementById('btn-celebration-report');

    this.bindEvents();
  }

  bindEvents() {
    if (this.homeBtn) {
      this.homeBtn.addEventListener('click', () => {
        this.modal.close();
        eventBus.emit('sound:pop');
        eventBus.emit('nav:home');
      });
    }

    if (this.reportBtn) {
      this.reportBtn.addEventListener('click', () => {
        this.modal.close();
        eventBus.emit('sound:pop');
        eventBus.emit('report:open');
      });
    }

    eventBus.on('game:celebrate', ({ title, desc }) => {
      this.show(title, desc);
    });
  }

  show(title = 'TUGAS SELESAI! 🎓', desc = 'Tugas ini telah selesai dikerjakan dan dinilai.') {
    eventBus.emit('sound:fanfare');
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });

    this.title.textContent = title;
    this.desc.textContent = desc;
    this.modal.showModal();
    eventBus.emit('speech:speak', 'Tugas ini telah selesai dikerjakan. Silakan kembali ke menu.');
  }
}
