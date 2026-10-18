// src/games/ShapeMatchGame.js
import { BaseGame } from './BaseGame.js';
import { getGameLevels } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';
import { shuffleArray } from '../utils/dom.js';
import { makeDraggable } from '../utils/dragDrop.js';
import { eventBus } from '../core/EventBus.js';

export class ShapeMatchGame extends BaseGame {
  constructor(ageGroup = StorageService.getAgeGroup()) {
    const levels = getGameLevels('shapes', ageGroup);
    const title = ageGroup === '7' ? '🔷 Geometri Datar & Ruang' : '🔷 Pasang Bentuk & Bayangan';
    super('shapes', title, levels);
    this.ageGroup = ageGroup;
    this.slotPlacements = new Map(); // slotIndex -> item
  }

  render() {
    const level = this.levels[this.currentLevel];
    const total = this.levels.length;
    const shuffledSources = shuffleArray(level.items);
    this.slotPlacements.clear();

    const targetSlotsHtml = level.items.map((item, index) => `
      <div class="shape-slot" data-slot-index="${index}" data-target-id="${item.id}" title="Bayangan untuk ${item.name}">
        <span class="slot-shadow">${item.emoji}</span>
        ${this.ageGroup === '7' ? `<span class="slot-title-tag">${item.name}</span>` : ''}
      </div>
    `).join('');

    const sourceShapesHtml = shuffledSources.map(item => `
      <div class="draggable-shape" role="button" tabindex="0" data-shape-id="${item.id}" id="drag-${item.id}" title="${item.name}">
        <span>${item.emoji}</span>
        ${this.ageGroup === '7' ? `<span class="item-name-tag">${item.name}</span>` : ''}
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="play-screen">
        ${this.renderLevelHeader(this.currentLevel, total)}
        <div class="instruction-box" id="speak-box">
          <button class="speak-icon-btn" aria-label="Ulangi Instruksi">🗣️</button>
          <span class="instruction-text">${level.prompt}</span>
        </div>
        <div class="shapes-container">
          <div class="drop-targets-row" id="drop-targets">
            ${targetSlotsHtml}
          </div>
          <div class="shape-sources-row" id="shape-sources">
            ${sourceShapesHtml}
          </div>
        </div>
        <div class="submit-action-bar">
          <button id="btn-submit-answer" class="submit-answer-btn">
            🚀 Periksa Jawaban
          </button>
        </div>
      </div>
    `;

    this.setupInstructionBox(level.prompt);

    const totalItems = level.items.length;
    const draggables = this.container.querySelectorAll('.draggable-shape');
    const slots = this.container.querySelectorAll('.shape-slot');
    const sourcesContainer = this.container.querySelector('#shape-sources');

    draggables.forEach(el => {
      const unbind = makeDraggable(el, slots, (droppedEl, targetSlot) => {
        const shapeId = droppedEl.getAttribute('data-shape-id');
        const slotIndex = parseInt(targetSlot.getAttribute('data-slot-index'), 10);
        const itemObj = level.items.find(i => i.id === shapeId);

        // If target slot already had an item, return previous item back to sources
        const previousItem = this.slotPlacements.get(slotIndex);
        if (previousItem && previousItem.id !== shapeId) {
          const returnCard = document.createElement('div');
          returnCard.className = 'draggable-shape';
          returnCard.setAttribute('role', 'button');
          returnCard.setAttribute('tabindex', '0');
          returnCard.setAttribute('data-shape-id', previousItem.id);
          returnCard.setAttribute('id', `drag-${previousItem.id}`);
          returnCard.setAttribute('title', previousItem.name);
          returnCard.innerHTML = `<span>${previousItem.emoji}</span>${this.ageGroup === '7' ? `<span class="item-name-tag">${previousItem.name}</span>` : ''}`;
          sourcesContainer.appendChild(returnCard);
          this.attachShapeDrag(returnCard, slots, level, sourcesContainer);
        }

        // Place shape into slot without auto-rejection
        targetSlot.classList.add('occupied');
        targetSlot.innerHTML = droppedEl.innerHTML;
        this.slotPlacements.set(slotIndex, itemObj);
        droppedEl.remove();

        eventBus.emit('sound:pop');
        eventBus.emit('feedback:cheer', `Bentuk ${itemObj.name} ditaruh. Jika sudah semua, klik "Periksa Jawaban"!`);
      });
      this.cleanups.push(unbind);
    });

    const submitBtn = this.container.querySelector('#btn-submit-answer');
    const submitHandler = () => {
      if (this.slotPlacements.size < totalItems) {
        eventBus.emit('sound:wrong');
        eventBus.emit('feedback:cheer', 'Ayo pasangkan semua bentuk ke tempatnya terlebih dahulu ya!');
        eventBus.emit('speech:speak', 'Ayo pasangkan semua bentuk terlebih dahulu.');
        submitBtn.classList.add('shake-animation');
        setTimeout(() => submitBtn.classList.remove('shake-animation'), 400);
        return;
      }

      // Evaluate placement
      let correctCount = 0;
      const mistakes = [];

      slots.forEach((slot, index) => {
        const expectedId = slot.getAttribute('data-target-id');
        const placed = this.slotPlacements.get(index);

        if (placed && placed.id === expectedId) {
          correctCount += 1;
          slot.classList.add('eval-correct', 'bounce-success');
          slot.innerHTML += '<span class="status-marker correct">✔️</span>';
        } else {
          slot.classList.add('eval-wrong', 'shake-animation');
          slot.innerHTML += '<span class="status-marker wrong">❌</span>';
          const expectedItem = level.items.find(i => i.id === expectedId);
          mistakes.push(`Bayangan ${expectedItem.name} diisi ${placed ? placed.name : 'kosong'}`);
        }
      });

      const scorePercent = Math.round((correctCount / totalItems) * 100);
      const isSuccess = correctCount === totalItems;

      let explanationText = '';
      if (isSuccess) {
        explanationText = 'Hebat sekali! Semua bentuk terpasang di bayangan yang tepat!';
        eventBus.emit('feedback:cheer', explanationText);
      } else {
        explanationText = `Kamu berhasil mencocokkan ${correctCount} dari ${totalItems} bentuk. Perhatikan baik-baik tepian bayangannya ya!`;
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

  attachShapeDrag(el, slots, level, sourcesContainer) {
    const unbind = makeDraggable(el, slots, (droppedEl, targetSlot) => {
      const shapeId = droppedEl.getAttribute('data-shape-id');
      const slotIndex = parseInt(targetSlot.getAttribute('data-slot-index'), 10);
      const itemObj = level.items.find(i => i.id === shapeId);

      const previousItem = this.slotPlacements.get(slotIndex);
      if (previousItem && previousItem.id !== shapeId) {
        const returnCard = document.createElement('div');
        returnCard.className = 'draggable-shape';
        returnCard.setAttribute('role', 'button');
        returnCard.setAttribute('tabindex', '0');
        returnCard.setAttribute('data-shape-id', previousItem.id);
        returnCard.setAttribute('id', `drag-${previousItem.id}`);
        returnCard.setAttribute('title', previousItem.name);
        returnCard.innerHTML = `<span>${previousItem.emoji}</span>${this.ageGroup === '7' ? `<span class="item-name-tag">${previousItem.name}</span>` : ''}`;
        sourcesContainer.appendChild(returnCard);
        this.attachShapeDrag(returnCard, slots, level, sourcesContainer);
      }

      targetSlot.classList.add('occupied');
      targetSlot.innerHTML = droppedEl.innerHTML;
      this.slotPlacements.set(slotIndex, itemObj);
      droppedEl.remove();

      eventBus.emit('sound:pop');
    });
    this.cleanups.push(unbind);
  }
}
