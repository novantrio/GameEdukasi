// src/games/CountingLogicGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { eventBus } from '../core/EventBus.js';

export class CountingLogicGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('counting', ageGroup);
    const title = ageGroup === '7' ? '📐 Teka-Teki Logika Matematika' : '🍎 Hitung Teman Lucu';
    super('counting', title, levels);
    this.ageGroup = ageGroup;
    this.selectedNumber = null;
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    this.selectedNumber = null;

    let itemsFieldHtml = '';
    if (level.equationText) {
      itemsFieldHtml = `
        <div class="algebra-board">
          <div class="algebra-equation-card">
            <span class="algebra-icon">🧮</span>
            <span class="algebra-text">${level.equationText}</span>
          </div>
        </div>
      `;
    } else {
      const itemsBadgesHtml = Array.from({ length: level.count }, (_, i) => `
        <div class="count-item-badge" data-index="${i + 1}" role="button" tabindex="0">
          <span>${level.emoji || '⭐'}</span>
        </div>
      `).join('');
      itemsFieldHtml = `<div class="counting-items-field" id="items-field">${itemsBadgesHtml}</div>`;
    }

    const choicesHtml = level.options.map(num => `
      <button class="number-choice-btn" data-number="${num}">
        ${num}
      </button>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🗣️</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="counting-view">
          ${itemsFieldHtml}
          <div class="count-options-row">
            ${choicesHtml}
          </div>
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-counting" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const countedSet = new Set();
    const badges = this.container.querySelectorAll('.count-item-badge');
    badges.forEach(item => {
      const clickHandler = () => {
        eventBus.emit('sound:pop');
        const idx = item.getAttribute('data-index');
        if (!countedSet.has(idx)) {
          countedSet.add(idx);
          item.classList.add('counted');
          const tag = document.createElement('span');
          tag.className = 'count-order-tag';
          tag.textContent = idx;
          item.appendChild(tag);
          eventBus.emit('speech:speak', idx);
        }
      };
      item.addEventListener('click', clickHandler);
      this.cleanups.push(() => item.removeEventListener('click', clickHandler));
    });

    const choiceBtns = this.container.querySelectorAll('.number-choice-btn');
    const submitBtn = this.container.querySelector('#btn-submit-counting');

    choiceBtns.forEach(btn => {
      const clickHandler = () => {
        eventBus.emit('sound:pop');
        choiceBtns.forEach(b => b.classList.remove('selected-choice'));
        btn.classList.add('selected-choice');
        this.selectedNumber = parseInt(btn.getAttribute('data-number'), 10);
        eventBus.emit('feedback:cheer', `Kamu memilih angka ${this.selectedNumber}. Klik "Periksa Jawaban" untuk mengecek!`);
      };
      btn.addEventListener('click', clickHandler);
      this.cleanups.push(() => btn.removeEventListener('click', clickHandler));
    });

    const submitHandler = () => {
      if (this.selectedNumber === null) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Pilih salah satu angka jawaban terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Pilih salah satu angka terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      const isSuccess = this.selectedNumber === level.count;
      const selectedBtn = this.container.querySelector(`.number-choice-btn[data-number="${this.selectedNumber}"]`);
      const correctBtn = this.container.querySelector(`.number-choice-btn[data-number="${level.count}"]`);

      let explanationText = '';
      if (isSuccess) {
        if (selectedBtn) selectedBtn.classList.add('eval-correct', 'bounce-success');
        explanationText = `Pintar sekali! ${level.speech}`;
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        if (selectedBtn) selectedBtn.classList.add('eval-wrong', 'shake-animation');
        if (correctBtn) correctBtn.classList.add('eval-correct', 'bounce-success');
        explanationText = `Belum tepat. Jumlah yang benar adalah ${level.count}. Mari hitung kembali bersama!`;
        eventBus.emit('feedback:cheer', explanationText);
      }

      this.onLevelEvaluated({
        isSuccess,
        scorePercent: isSuccess ? 100 : 0,
        mistakeDetail: isSuccess ? null : `Menjawab ${this.selectedNumber} (seharusnya ${level.count})`,
        explanationText
      });
    };

    submitBtn.addEventListener('click', submitHandler);
    this.cleanups.push(() => submitBtn.removeEventListener('click', submitHandler));
  }
}
