// src/main.js - Application Bootstrap & Dependency Wiring
import './audio/SoundManager.js';
import { Header } from './ui/Header.js';
import { MascotBanner } from './ui/MascotBanner.js';
import { CelebrationModal } from './ui/CelebrationModal.js';
import { TeacherReportModal } from './ui/TeacherReportModal.js';
import { GameRouter } from './core/GameRouter.js';

class App {
  constructor() {
    this.header = new Header();
    this.mascotBanner = new MascotBanner();
    this.celebrationModal = new CelebrationModal();
    this.teacherReportModal = new TeacherReportModal();

    const stageEl = document.getElementById('game-stage');
    this.router = new GameRouter(stageEl);
    this.router.showMenu();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
