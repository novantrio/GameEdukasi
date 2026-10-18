import { eventBus } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { assessmentEngine } from '../core/AssessmentEngine.js';
import { StorageService } from '../services/StorageService.js';

export class BaseGame {
  constructor(gameId, title, levels) {
    this.gameId = gameId;
    this.title = title;
    this.levels = levels;
    this.currentLevel = 0;
    this.cleanups = [];
    this.isTransitioning = false;
    this.levelStartTime = Date.now();
  }

  mount(container, levelIndex = 0) {
    this.container = container;
    this.currentLevel = levelIndex;
    this.isTransitioning = false;
    this.levelStartTime = Date.now();

    if (this.container) {
      this.container.style.pointerEvents = '';
    }
    this.cleanup();
    this.render();
  }

  cleanup() {
    this.cleanups.forEach(fn => {
      try { fn(); } catch (e) { console.warn('Cleanup error:', e); }
    });
    this.cleanups = [];
  }

  destroy() {
    this.cleanup();
    if (this.container) {
      this.container.style.pointerEvents = '';
      this.container.innerHTML = '';
    }
  }

  renderLevelHeader(current, total) {
    const dotsHtml = Array.from({ length: total }, (_, i) => {
      const cls = i < current ? 'dot completed' : i === current ? 'dot active' : 'dot';
      return `<span class="${cls}"></span>`;
    }).join('');

    return `
      <div class="level-indicator">
        <div class="game-title-tag">
          <span>${this.title}</span>
        </div>
        <div class="level-dots">
          ${dotsHtml}
        </div>
      </div>
    `;
  }

  setupInstructionBox(promptText) {
    gameState.setInstruction(promptText);
    eventBus.emit('speech:speak', promptText);

    const speakBox = this.container.querySelector('#speak-box');
    if (speakBox) {
      const clickHandler = () => eventBus.emit('speech:speak', promptText);
      speakBox.addEventListener('click', clickHandler);
      this.cleanups.push(() => speakBox.removeEventListener('click', clickHandler));
    }
  }

  onLevelEvaluated({ isSuccess, scorePercent, mistakeDetail, explanationText }) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const timeSpentMs = Date.now() - (this.levelStartTime || Date.now());

    // Record objective pedagogical telemetry into AssessmentEngine
    assessmentEngine.recordTrial({
      gameId: this.gameId,
      levelIndex: this.currentLevel,
      timeSpentMs,
      isSuccess: Boolean(isSuccess),
      scorePercent: typeof scorePercent === 'number' ? scorePercent : (isSuccess ? 100 : 0),
      mistakeDetail
    });

    if (isSuccess) {
      eventBus.emit('sound:correct');
      gameState.addStar(1);
    } else {
      eventBus.emit('sound:wrong');
    }

    // Disable clicks during evaluation feedback
    if (this.container) {
      this.container.style.pointerEvents = 'none';
    }

    const advance = () => {
      if (this.currentLevel + 1 < this.levels.length) {
        this.mount(this.container, this.currentLevel + 1);
      } else {
        if (this.container) {
          this.container.style.pointerEvents = '';
        }
        StorageService.markGameCompleted(this.gameId);
        eventBus.emit('game:celebrate', {
          title: 'TUGAS SELESAI! 🎓',
          desc: 'Tugas ini telah selesai dikerjakan dan dinilai. Tugas ini dinonaktifkan di menu agar hasil asesmen objektif.',
          gameId: this.gameId
        });
      }
    };

    if (explanationText) {
      eventBus.emit('speech:speak', {
        text: explanationText,
        onComplete: () => {
          setTimeout(advance, 800);
        }
      });
    } else {
      setTimeout(advance, 1400);
    }
  }

  render() {
    throw new Error('render() must be implemented by subclass');
  }
}
