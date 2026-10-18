// src/games/PatternMatchGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { eventBus } from '../core/EventBus.js';
import { renderVisual, visualLabel } from '../utils/animalVisuals.js';

export class PatternMatchGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('patterns', ageGroup);
    const title = ageGroup === '7' ? '🔢 Deret Pola Bilangan' : '🔶 Tebak Pola Seru';
    super('patterns', title, levels);
    this.ageGroup = ageGroup;
    this.selectedOption = null;
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    this.selectedOption = null;

    const seqHtml = level.sequence.map(item => {
      if (item === '?') {
        return `<div class="pattern-cell target-blank" id="preview-blank">❓</div>`;
      }
      return `<div class="pattern-cell">${renderVisual(item)}</div>`;
    }).join('');

    const optionsHtml = level.options.map(opt => `
      <button class="pattern-option-btn" data-value="${opt}" aria-label="Pilih ${visualLabel(opt)}">
        ${renderVisual(opt)}
      </button>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🔈</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="pattern-board">
          <div class="pattern-sequence-row">
            ${seqHtml}
          </div>
          <div class="pattern-options-row">
            ${optionsHtml}
          </div>
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-pattern" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const blankCell = this.container.querySelector('#preview-blank');
    const optionBtns = this.container.querySelectorAll('.pattern-option-btn');
    const submitBtn = this.container.querySelector('#btn-submit-pattern');

    optionBtns.forEach(btn => {
      const clickHandler = () => {
        eventBus.emit('sound:pop');
        optionBtns.forEach(b => b.classList.remove('selected-choice'));
        btn.classList.add('selected-choice');

        this.selectedOption = btn.getAttribute('data-value');
        blankCell.innerHTML = renderVisual(this.selectedOption);
        blankCell.classList.add('preview-active');
        eventBus.emit('feedback:cheer', `Kamu memilih ${visualLabel(this.selectedOption)}. Klik "Periksa Jawaban" untuk memastikan!`);
      };
      btn.addEventListener('click', clickHandler);
      this.cleanups.push(() => btn.removeEventListener('click', clickHandler));
    });

    const submitHandler = () => {
      if (!this.selectedOption) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Pilih salah satu gambar di atas terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Pilih salah satu gambar terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      const isSuccess = this.selectedOption === level.answer;
      let explanationText = '';

      if (isSuccess) {
        blankCell.classList.remove('target-blank');
        blankCell.classList.add('eval-correct', 'bounce-success');
        explanationText = `Benar sekali! ${level.reason}`;
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        blankCell.classList.remove('target-blank');
        blankCell.classList.add('eval-wrong', 'shake-animation');
        explanationText = `Kurang tepat. Jawaban yang benar adalah ${visualLabel(level.answer)}. ${level.reason}`;
        eventBus.emit('feedback:cheer', explanationText);
        setTimeout(() => {
          blankCell.innerHTML = renderVisual(level.answer);
          blankCell.classList.remove('eval-wrong');
          blankCell.classList.add('eval-correct');
        }, 800);
      }

      this.onLevelEvaluated({
        isSuccess,
        scorePercent: isSuccess ? 100 : 0,
        mistakeDetail: isSuccess ? null : `Memilih ${visualLabel(this.selectedOption)} (seharusnya ${visualLabel(level.answer)})`,
        explanationText
      });
    };

    submitBtn.addEventListener('click', submitHandler);
    this.cleanups.push(() => submitBtn.removeEventListener('click', submitHandler));
  }
}
