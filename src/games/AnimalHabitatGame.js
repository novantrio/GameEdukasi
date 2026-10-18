// src/games/AnimalHabitatGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { eventBus } from '../core/EventBus.js';

export class AnimalHabitatGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('animal-habitats', ageGroup);
    const title = ageGroup === '7' ? '🌿 Rantai Makanan & Siklus Alam' : '🦁 Logika Alam & Hewan';
    super('animal-habitats', title, levels);
    this.ageGroup = ageGroup;
    this.selectedOption = null;
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    this.selectedOption = null;

    const optionsHtml = level.options.map(opt => `
      <div class="habitat-option-card" data-id="${opt.id}" data-correct="${opt.isCorrect}" data-name="${opt.name}" data-cheer="${opt.cheer}">
        <span class="option-emoji">${opt.emoji}</span>
        <span class="option-text">${opt.name}</span>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🗣️</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="habitat-view">
          <div class="subject-stage">
            <span class="subject-emoji">${level.subject.emoji}</span>
            <span class="subject-name">${level.subject.name}</span>
          </div>
          <div class="habitat-options-grid">
            ${optionsHtml}
          </div>
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-habitat" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const optionCards = this.container.querySelectorAll('.habitat-option-card');
    const submitBtn = this.container.querySelector('#btn-submit-habitat');

    optionCards.forEach(card => {
      const clickHandler = () => {
        eventBus.emit('sound:pop');
        optionCards.forEach(c => c.classList.remove('selected-choice'));
        card.classList.add('selected-choice');
        this.selectedOption = card;

        const name = card.getAttribute('data-name');
        eventBus.emit('feedback:cheer', `Kamu memilih ${name}. Tekan "Periksa Jawaban" untuk mengecek!`);
      };
      card.addEventListener('click', clickHandler);
      this.cleanups.push(() => card.removeEventListener('click', clickHandler));
    });

    const submitHandler = () => {
      if (!this.selectedOption) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Pilih salah satu pilihan terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Pilih salah satu jawaban terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      const isCorrect = this.selectedOption.getAttribute('data-correct') === 'true';
      const chosenName = this.selectedOption.getAttribute('data-name');
      const cheer = this.selectedOption.getAttribute('data-cheer');
      const correctOption = level.options.find(o => o.isCorrect);

      let explanationText = '';
      if (isCorrect) {
        this.selectedOption.classList.add('eval-correct', 'bounce-success');
        explanationText = cheer;
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        this.selectedOption.classList.add('eval-wrong', 'shake-animation');
        const correctCardEl = this.container.querySelector(`.habitat-option-card[data-correct="true"]`);
        if (correctCardEl) {
          correctCardEl.classList.add('eval-correct', 'bounce-success');
        }
        explanationText = `Belum tepat. ${chosenName} kurang sesuai. Jawaban yang benar adalah ${correctOption.name} karena ${correctOption.cheer}`;
        eventBus.emit('feedback:cheer', explanationText);
      }

      this.onLevelEvaluated({
        isSuccess: isCorrect,
        scorePercent: isCorrect ? 100 : 0,
        mistakeDetail: isCorrect ? null : `Memilih ${chosenName} (seharusnya ${correctOption.name})`,
        explanationText
      });
    };

    submitBtn.addEventListener('click', submitHandler);
    this.cleanups.push(() => submitBtn.removeEventListener('click', submitHandler));
  }
}
