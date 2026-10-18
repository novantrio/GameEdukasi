// src/core/GameState.js
import { eventBus } from './EventBus.js';
import { StorageService } from '../services/StorageService.js';

export class GameState {
  constructor() {
    this.stars = StorageService.getStars();
    this.currentGame = 'menu';
    this.currentLevel = 0;
    this.isMuted = false;
    this.activeInstruction = '';
  }

  addStar(amount = 1) {
    this.stars += amount;
    StorageService.saveStars(this.stars);
    eventBus.emit('stars:updated', this.stars);
  }

  setGame(gameId, level = 0) {
    this.currentGame = gameId;
    this.currentLevel = level;
    if (gameId !== 'menu') {
      StorageService.saveGameProgress(gameId, level);
    }
    eventBus.emit('game:changed', { gameId, level });
  }

  setInstruction(text) {
    this.activeInstruction = text;
    eventBus.emit('instruction:changed', text);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    eventBus.emit('audio:muted', this.isMuted);
    return this.isMuted;
  }
}

export const gameState = new GameState();
