// src/ui/Header.js
import { eventBus } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { StorageService } from '../services/StorageService.js';

export class Header {
  constructor() {
    this.starCountEl = document.getElementById('star-count');
    this.homeBtn = document.getElementById('btn-home');
    this.soundBtn = document.getElementById('btn-sound');
    this.helpBtn = document.getElementById('btn-help');
    this.teacherReportBtn = document.getElementById('btn-teacher-report');

    // Student profile & age
    this.studentBadge = document.getElementById('btn-student-name');
    this.displayStudentName = document.getElementById('display-student-name');
    this.nameDialog = document.getElementById('student-name-dialog');
    this.nameInput = document.getElementById('input-student-name');
    this.saveNameBtn = document.getElementById('btn-save-student-name');
    this.cancelNameBtn = document.getElementById('btn-cancel-student-name');

    this.headerAgeBtn = document.getElementById('btn-header-age');
    this.headerAgeText = document.getElementById('header-age-text');

    this.initStudentProfile();
    this.bindEvents();
  }

  initStudentProfile() {
    const currentName = StorageService.getStudentName();
    if (this.displayStudentName) {
      this.displayStudentName.textContent = currentName;
    }
    this.updateAgeDisplay(StorageService.getAgeGroup());
  }

  updateAgeDisplay(age) {
    if (this.headerAgeText) {
      this.headerAgeText.textContent = age === '7' ? '🚀 Usia 7 Th (SD)' : '🎈 Usia 4 Th (PAUD)';
    }
  }

  bindEvents() {
    // Student Name & Age Modal
    if (this.studentBadge && this.nameDialog) {
      this.studentBadge.addEventListener('click', () => {
        eventBus.emit('sound:pop');
        this.nameInput.value = StorageService.getStudentName();

        // Select the active radio in modal
        const currentAge = StorageService.getAgeGroup();
        const radio = this.nameDialog.querySelector(`input[name="modal-age-select"][value="${currentAge}"]`);
        if (radio) radio.checked = true;

        this.nameDialog.showModal();
        setTimeout(() => this.nameInput.focus(), 50);
      });

      this.saveNameBtn.addEventListener('click', () => {
        const val = (this.nameInput.value || '').trim();
        if (val) {
          StorageService.saveStudentName(val);
          this.displayStudentName.textContent = val;
        }

        const selectedRadio = this.nameDialog.querySelector('input[name="modal-age-select"]:checked');
        if (selectedRadio) {
          const selectedAge = selectedRadio.value;
          const prevAge = StorageService.getAgeGroup();
          if (selectedAge !== prevAge) {
            StorageService.saveAgeGroup(selectedAge);
            this.updateAgeDisplay(selectedAge);
            eventBus.emit('age:changed', selectedAge);
          }
        }

        eventBus.emit('sound:correct');
        eventBus.emit('feedback:cheer', `Data peserta diperbarui: ${val || StorageService.getStudentName()}`);
        this.nameDialog.close();
      });

      this.cancelNameBtn.addEventListener('click', () => {
        eventBus.emit('sound:pop');
        this.nameDialog.close();
      });

      this.nameDialog.addEventListener('click', (e) => {
        if (e.target === this.nameDialog) {
          this.nameDialog.close();
        }
      });
    }

    // Direct toggle on header age button
    if (this.headerAgeBtn) {
      this.headerAgeBtn.addEventListener('click', () => {
        const currentAge = StorageService.getAgeGroup();
        const nextAge = currentAge === '7' ? '4' : '7';
        StorageService.saveAgeGroup(nextAge);
        this.updateAgeDisplay(nextAge);
        eventBus.emit('sound:pop');
        eventBus.emit('age:changed', nextAge);
        eventBus.emit('feedback:cheer', nextAge === '7'
          ? 'Beralih ke level tantangan nalar & sains untuk usia 7 tahun (SD Kelas 1-2)!'
          : 'Beralih ke petualangan logika untuk usia 4 tahun (PAUD / TK-A)!'
        );
      });
    }

    eventBus.on('age:changed', (age) => {
      this.updateAgeDisplay(age);
    });

    if (this.teacherReportBtn) {
      this.teacherReportBtn.addEventListener('click', () => {
        eventBus.emit('sound:pop');
        eventBus.emit('report:open');
      });
    }

    this.homeBtn.addEventListener('click', () => {
      eventBus.emit('sound:pop');
      eventBus.emit('nav:home');
    });

    this.soundBtn.addEventListener('click', () => {
      const isMuted = gameState.toggleMute();
      this.soundBtn.textContent = isMuted ? '🔇' : '🔊';
      eventBus.emit('sound:pop');
    });

    this.helpBtn.addEventListener('click', () => {
      if (gameState.activeInstruction) {
        eventBus.emit('sound:pop');
        eventBus.emit('speech:speak', gameState.activeInstruction);
      }
    });

    eventBus.on('stars:updated', stars => {
      this.starCountEl.textContent = stars;
    });

    this.starCountEl.textContent = gameState.stars;
  }
}
