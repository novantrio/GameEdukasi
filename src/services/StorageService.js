// src/services/StorageService.js
import { getGameLevels } from '../constants/gameData.js';

const STARS_KEY = 'kid_logic_stars';
const PROGRESS_KEY = 'kid_logic_progress';
const STUDENT_NAME_KEY = 'kid_student_name';
const AGE_GROUP_KEY = 'kid_selected_age_group';
const PREVIOUS_LEVEL_COUNTS = { shapes: 3, sizes: 3, patterns: 4, 'odd-one': 4, 'animal-habitats': 4, counting: 4 };

export class StorageService {
  static getAgeGroup() {
    try {
      const val = localStorage.getItem(AGE_GROUP_KEY);
      return val === '7' ? '7' : '4';
    } catch {
      return '4';
    }
  }

  static saveAgeGroup(age) {
    try {
      localStorage.setItem(AGE_GROUP_KEY, age === '7' ? '7' : '4');
    } catch (e) {
      console.warn('Storage save age error:', e);
    }
  }

  static getStudentName() {
    try {
      return localStorage.getItem(STUDENT_NAME_KEY) || 'Ananda Cerdas';
    } catch {
      return 'Ananda Cerdas';
    }
  }

  static saveStudentName(name) {
    try {
      localStorage.setItem(STUDENT_NAME_KEY, name.trim());
    } catch (e) {
      console.warn('Storage save student name error:', e);
    }
  }

  static getStars() {
    try {
      const val = localStorage.getItem(STARS_KEY);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  static saveStars(count) {
    try {
      localStorage.setItem(STARS_KEY, count.toString());
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  static saveGameProgress(gameId, level, age = this.getAgeGroup()) {
    try {
      const key = `kid_progress_${age}_${gameId}`;
      localStorage.setItem(key, level.toString());
    } catch (e) {
      console.warn('Storage save game progress error:', e);
    }
  }

  static getGameProgress(gameId, age = this.getAgeGroup()) {
    try {
      const key = `kid_progress_${age}_${gameId}`;
      const val = localStorage.getItem(key);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  static getCompletedGames(age = this.getAgeGroup()) {
    return this.getRecordedCompletedGames(age).filter(gameId => {
      const total = getGameLevels(gameId, age).length;
      return total > 0 && this.getCompletedLevelCount(gameId, age) >= total;
    });
  }

  static getRecordedCompletedGames(age = this.getAgeGroup()) {
    try {
      const key = `kid_completed_games_v2_${age}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  static getCompletedLevelCount(gameId, age = this.getAgeGroup()) {
    try {
      const saved = localStorage.getItem(`kid_completed_level_count_${age}_${gameId}`);
      return saved === null ? (PREVIOUS_LEVEL_COUNTS[gameId] || 0) : parseInt(saved, 10);
    } catch {
      return PREVIOUS_LEVEL_COUNTS[gameId] || 0;
    }
  }

  static getResumeLevel(gameId, age = this.getAgeGroup()) {
    const total = getGameLevels(gameId, age).length;
    const previousCompletion = this.getRecordedCompletedGames(age).includes(gameId)
      ? this.getCompletedLevelCount(gameId, age) : 0;
    return Math.min(Math.max(this.getGameProgress(gameId, age), previousCompletion), Math.max(0, total - 1));
  }

  static isGameCompleted(gameId, age = this.getAgeGroup()) {
    const list = this.getCompletedGames(age);
    return list.includes(gameId);
  }

  static markGameCompleted(gameId, age = this.getAgeGroup()) {
    try {
      const list = this.getRecordedCompletedGames(age);
      if (!list.includes(gameId)) {
        list.push(gameId);
        localStorage.setItem(`kid_completed_games_v2_${age}`, JSON.stringify(list));
      }
      localStorage.setItem(`kid_completed_level_count_${age}_${gameId}`, String(getGameLevels(gameId, age).length));
    } catch (e) {
      console.warn('Storage mark completed error:', e);
    }
  }

  static resetCompletedGames(age = this.getAgeGroup()) {
    try {
      localStorage.removeItem(`kid_completed_games_v2_${age}`);
      Object.keys(PREVIOUS_LEVEL_COUNTS).forEach(gameId => {
        localStorage.removeItem(`kid_completed_level_count_${age}_${gameId}`);
        localStorage.removeItem(`kid_progress_${age}_${gameId}`);
      });
    } catch (e) {
      console.warn('Storage reset completed error:', e);
    }
  }
}
