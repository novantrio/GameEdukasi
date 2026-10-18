// src/games/OddOneOutGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { eventBus } from '../core/EventBus.js';

export class OddOneOutGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('odd-one', ageGroup);
    const title = ageGroup === '7' ? '🧬 Klasifikasi Taksonomi & Sains' : '🔍 Cari yang Berbeda';
    super('odd-one', title, levels);
    this.ageGroup = ageGroup;
    this.selectedCard = null;
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    this.selectedCard = null;

    const cardsHtml = level.items.map(item => `
      <div class="odd-card" data-id="${item.id}" data-is-odd="${item.isOdd}" data-name="${item.name}" data-reason="${item.reason}">
        <span class="odd-emoji">${item.emoji}</span>
        <span class="odd-name">${item.name}</span>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🗣️</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="odd-grid">
          ${cardsHtml}
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-odd" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const oddCards = this.container.querySelectorAll('.odd-card');
    const submitBtn = this.container.querySelector('#btn-submit-odd');

    oddCards.forEach(card => {
      const clickHandler = () => {
        eventBus.emit('sound:pop');
        oddCards.forEach(c => c.classList.remove('selected-choice'));
        card.classList.add('selected-choice');
        this.selectedCard = card;

        const name = card.getAttribute('data-name');
        eventBus.emit('feedback:cheer', `Kamu memilih ${name}. Klik "Periksa Jawaban" untuk mengecek!`);
      };
      card.addEventListener('click', clickHandler);
      this.cleanups.push(() => card.removeEventListener('click', clickHandler));
    });

    const submitHandler = () => {
      if (!this.selectedCard) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Pilih salah satu gambar yang menurutmu berbeda terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Pilih salah satu gambar terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      const isOdd = this.selectedCard.getAttribute('data-is-odd') === 'true';
      const chosenName = this.selectedCard.getAttribute('data-name');
      const correctItem = level.items.find(i => i.isOdd);

      let explanationText = '';
      if (isOdd) {
        this.selectedCard.classList.add('eval-correct', 'bounce-success');
        explanationText = `Benar sekali! ${this.selectedCard.getAttribute('data-reason')}`;
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        this.selectedCard.classList.add('eval-wrong', 'shake-animation');
        const correctCardEl = this.container.querySelector(`.odd-card[data-is-odd="true"]`);
        if (correctCardEl) {
          correctCardEl.classList.add('eval-correct', 'bounce-success');
        }
        explanationText = `Kurang tepat. ${chosenName} masih termasuk kelompok yang sama. Yang berbeda adalah ${correctItem.name} karena ${correctItem.reason}`;
        eventBus.emit('feedback:cheer', explanationText);
      }

      this.onLevelEvaluated({
        isSuccess: isOdd,
        scorePercent: isOdd ? 100 : 0,
        mistakeDetail: isOdd ? null : `Memilih ${chosenName} (seharusnya ${correctItem.name})`,
        explanationText
      });
    };

    submitBtn.addEventListener('click', submitHandler);
    this.cleanups.push(() => submitBtn.removeEventListener('click', submitHandler));
  }
}
