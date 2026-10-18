// src/games/SizeOrderGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { shuffleArray } from '../utils/dom.js';
import { makeDraggable } from '../utils/dragDrop.js';
import { eventBus } from '../core/EventBus.js';
import { renderVisual } from '../utils/animalVisuals.js';

export class SizeOrderGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('sizes', ageGroup);
    const title = ageGroup === '7' ? '⚖️ Seriasi Bobot, Waktu & Nilai' : '🧩 Urutan Besar & Kecil';
    super('sizes', title, levels);
    this.ageGroup = ageGroup;
    this.slotPlacements = new Map(); // slotIndex -> item
  }

  renderItemContents(item) {
    return `
      <span class="size-item-visual" style="--visual-size: ${(item.scale * 3.15).toFixed(3)}rem; --visual-size-mobile: ${(item.scale * 2.1).toFixed(3)}rem;">${renderVisual(item.emoji)}</span>
      ${item.label ? `<span class="size-item-label">${item.label}</span>` : ''}
    `;
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    const slotsCount = level.items.length;
    this.slotPlacements.clear();

    const slotsHtml = Array.from({ length: slotsCount }, (_, i) => `
      <div class="size-slot" data-slot-index="${i}" data-rank="${i + 1}">
        <span class="slot-label-tag">Urutan ${i + 1}</span>
      </div>
    `).join('');

    const shuffledItems = shuffleArray(level.items);
    const itemsHtml = shuffledItems.map(item => `
      <div class="draggable-size-item" role="button" tabindex="0" data-id="${item.id}" data-rank="${item.sizeRank}">
        ${this.renderItemContents(item)}
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🔈</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="sizes-container">
          <div class="size-slots-lane" id="size-slots">
            ${slotsHtml}
          </div>
          <div class="size-items-pool" id="size-pool">
            ${itemsHtml}
          </div>
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-size-answer" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const draggables = this.container.querySelectorAll('.draggable-size-item');
    const slots = this.container.querySelectorAll('.size-slot');
    const pool = this.container.querySelector('#size-pool');

    draggables.forEach(el => {
      const unbind = makeDraggable(el, slots, (droppedEl, targetSlot) => {
        const itemId = droppedEl.getAttribute('data-id');
        const slotIndex = parseInt(targetSlot.getAttribute('data-slot-index'), 10);
        const itemObj = level.items.find(i => i.id === itemId);

        const previousItem = this.slotPlacements.get(slotIndex);
        if (previousItem && previousItem.id !== itemId) {
          const returnCard = document.createElement('div');
          returnCard.className = 'draggable-size-item';
          returnCard.setAttribute('role', 'button');
          returnCard.setAttribute('tabindex', '0');
          returnCard.setAttribute('data-id', previousItem.id);
          returnCard.setAttribute('data-rank', previousItem.sizeRank);
          returnCard.innerHTML = this.renderItemContents(previousItem);
          pool.appendChild(returnCard);
          this.attachSizeDrag(returnCard, slots, level, pool);
        }

        targetSlot.classList.add('occupied');
        targetSlot.innerHTML = `<span class="slot-label-tag">Urutan ${slotIndex + 1}</span>${droppedEl.innerHTML}`;
        this.slotPlacements.set(slotIndex, itemObj);
        droppedEl.remove();

        eventBus.emit('sound:pop');
        eventBus.emit('feedback:cheer', `Item ditaruh pada urutan ${slotIndex + 1}. Jika sudah selesai, klik "Periksa Jawaban"!`);
      });
      this.cleanups.push(unbind);
    });

    const submitBtn = this.container.querySelector('#btn-submit-size-answer');
    const submitHandler = () => {
      if (this.slotPlacements.size < slotsCount) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Ayo susun semua item ke dalam kotak urutan terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Ayo susun semua item terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      let correctCount = 0;
      const mistakes = [];

      slots.forEach((slot, index) => {
        const expectedRank = index + 1;
        const placed = this.slotPlacements.get(index);

        if (placed && placed.sizeRank === expectedRank) {
          correctCount += 1;
          slot.classList.add('eval-correct', 'bounce-success');
          slot.innerHTML += '<span class="status-marker correct">✔️</span>';
        } else {
          slot.classList.add('eval-wrong', 'shake-animation');
          slot.innerHTML += '<span class="status-marker wrong">❌</span>';
          mistakes.push(`Posisi ${index + 1} keliru diisi ukuran tingkat ${placed ? placed.sizeRank : 'kosong'}`);
        }
      });

      const scorePercent = Math.round((correctCount / slotsCount) * 100);
      const isSuccess = correctCount === slotsCount;

      let explanationText = '';
      if (isSuccess) {
        explanationText = level.type === 'descending'
          ? 'Luar biasa! Urutan dari yang paling besar ke paling kecil sudah tepat!'
          : 'Luar biasa! Urutan dari yang paling kecil ke paling besar sudah tepat!';
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        explanationText = `Kamu berhasil mengurutkan ${correctCount} dari ${slotsCount} posisi dengan benar. Ayo perhatikan perbedaan ukuran dengan teliti!`;
        eventBus.emit('feedback:cheer', explanationText);
      }

      this.onLevelEvaluated({
        isSuccess,
        scorePercent,
        mistakeDetail: mistakes.length > 0 ? mistakes.join(', ') : null,
        explanationText
      });
    };

    submitBtn.addEventListener('click', submitHandler);
    this.cleanups.push(() => submitBtn.removeEventListener('click', submitHandler));
  }

  attachSizeDrag(el, slots, level, pool) {
    const unbind = makeDraggable(el, slots, (droppedEl, targetSlot) => {
      const itemId = droppedEl.getAttribute('data-id');
      const slotIndex = parseInt(targetSlot.getAttribute('data-slot-index'), 10);
      const itemObj = level.items.find(i => i.id === itemId);

      const previousItem = this.slotPlacements.get(slotIndex);
      if (previousItem && previousItem.id !== itemId) {
        const returnCard = document.createElement('div');
        returnCard.className = 'draggable-size-item';
        returnCard.setAttribute('role', 'button');
        returnCard.setAttribute('tabindex', '0');
        returnCard.setAttribute('data-id', previousItem.id);
        returnCard.setAttribute('data-rank', previousItem.sizeRank);
        returnCard.innerHTML = this.renderItemContents(previousItem);
        pool.appendChild(returnCard);
        this.attachSizeDrag(returnCard, slots, level, pool);
      }

      targetSlot.classList.add('occupied');
      targetSlot.innerHTML = `<span class="slot-label-tag">Urutan ${slotIndex + 1}</span>${droppedEl.innerHTML}`;
      this.slotPlacements.set(slotIndex, itemObj);
      droppedEl.remove();

      eventBus.emit('sound:pop');
    });
    this.cleanups.push(unbind);
  }
}
