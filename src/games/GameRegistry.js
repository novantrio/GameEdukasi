import { ShapeMatchGame } from './ShapeMatchGame.js';
import { SizeOrderGame } from './SizeOrderGame.js';
import { PatternMatchGame } from './PatternMatchGame.js';
import { OddOneOutGame } from './OddOneOutGame.js';
import { AnimalHabitatGame } from './AnimalHabitatGame.js';
import { CountingLogicGame } from './CountingLogicGame.js';
import { StorageService } from '../services/StorageService.js';

export class GameRegistry {
  constructor() {
    this.games = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    this.register('shapes', (age) => new ShapeMatchGame(age));
    this.register('sizes', (age) => new SizeOrderGame(age));
    this.register('patterns', (age) => new PatternMatchGame(age));
    this.register('odd-one', (age) => new OddOneOutGame(age));
    this.register('animal-habitats', (age) => new AnimalHabitatGame(age));
    this.register('counting', (age) => new CountingLogicGame(age));
  }

  register(gameId, factory) {
    this.games.set(gameId, factory);
  }

  create(gameId, age = StorageService.getAgeGroup()) {
    const factory = this.games.get(gameId);
    if (!factory) {
      console.warn(`Game factory not found for ${gameId}`);
      return null;
    }
    return factory(age);
  }

  has(gameId) {
    return this.games.has(gameId);
  }
}

export const gameRegistry = new GameRegistry();
