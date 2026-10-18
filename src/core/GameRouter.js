// src/core/GameRouter.js
import { eventBus } from './EventBus.js';
import { gameState } from './GameState.js';
import { gameRegistry } from '../games/GameRegistry.js';
import { GAMES_INFO } from '../constants/gameData.js';
import { StorageService } from '../services/StorageService.js';

export class GameRouter {
  constructor(stageElement) {
    this.stage = stageElement;
    this.activeGameInstance = null;

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('nav:home', () => {
      this.showMenu();
    });

    eventBus.on('age:changed', () => {
      if (gameState.currentGame === 'menu') {
        this.renderMenuView();
      }
    });

    eventBus.on('game:changed', ({ gameId, level }) => {
      if (gameId === 'menu') {
        this.renderMenuView();
      } else {
        this.launchGame(gameId, level);
      }
    });
  }

  showMenu() {
    gameState.setGame('menu', 0);
  }

  renderMenuView() {
    if (this.activeGameInstance) {
      this.activeGameInstance.destroy();
      this.activeGameInstance = null;
    }

    const ageGroup = StorageService.getAgeGroup();
    const isAge7 = ageGroup === '7';
    const completedGames = StorageService.getCompletedGames(ageGroup);
    const allCompleted = GAMES_INFO.every(g => completedGames.includes(g.id));

    const defaultPrompt = allCompleted
      ? 'Hebat! Semua tugas asesmen telah selesai dikerjakan. Buka Rapor Guru untuk melihat evaluasi!'
      : (isAge7 ? 'Pilih tantangan logika & sains SD Kelas 1-2 di bawah ini ya!' : 'Pilih tugas logika PAUD yang belum selesai di bawah ini ya!');
    gameState.setInstruction(defaultPrompt);

    const cardsHtml = GAMES_INFO.map(game => {
      const isCompleted = completedGames.includes(game.id);
      const subtitle = isAge7 ? game.subtitleAge7 : game.subtitleAge4;

      if (isCompleted) {
        return `
          <div class="game-card completed-locked" data-id="${game.id}" data-completed="true" style="--card-theme-color: #94a3b8;">
            <span class="card-badge badge-locked">✔️ Sudah Selesai</span>
            <div class="card-icon" style="filter: grayscale(80%); opacity: 0.65;">${game.icon}</div>
            <h3 class="card-title" style="color: #64748b;">${game.title}</h3>
            <p class="card-desc" style="color: #94a3b8;">Tugas ${isAge7 ? 'fase SD' : 'fase PAUD'} ini telah dinilai.</p>
          </div>
        `;
      }

      return `
        <div class="game-card" data-id="${game.id}" data-completed="false" style="--card-theme-color: ${game.color};">
          <span class="card-badge">${game.badge}</span>
          <div class="card-icon">${game.icon}</div>
          <h3 class="card-title">${game.title}</h3>
          <p class="card-desc">${subtitle}</p>
        </div>
      `;
    }).join('');

    const completedBannerHtml = allCompleted
      ? `<div class="all-completed-banner">
           <h3>🎓 Semua 6 Tugas Asesmen (${isAge7 ? 'SD Kelas 1-2' : 'PAUD / TK-A'}) Telah Lengkap!</h3>
           <p>Seluruh aspek logika kognitif telah diobservasi. Klik tombol <strong>👩‍🏫 Rapor Guru</strong> di atas untuk menelaah laporan perkembangan dan mencetak dokumen.</p>
         </div>`
      : '';

    this.stage.innerHTML = `
      <div class="menu-view">
        <div class="hero-banner">
          <h1 class="hero-title">${isAge7 ? 'Tantangan Nalar & Sains Cilik 🚀' : 'Petualangan Logika Cilik 🎈'}</h1>
          <p class="hero-subtitle">${isAge7 ? 'Asesmen Logika, Penalaran Matematika & Sains Usia 7 Tahun (SD Kelas 1-2)' : 'Asesmen Kognitif Mandiri Anak Usia 4 Tahun (PAUD / TK-A)'}</p>
          
          <div class="age-switcher-container">
            <span class="age-switcher-label">Pilih Kelompok Usia:</span>
            <div class="age-switcher-pills">
              <button class="age-pill-btn ${!isAge7 ? 'active' : ''}" data-target-age="4">
                🎈 Usia 4 Tahun (PAUD / TK-A)
              </button>
              <button class="age-pill-btn ${isAge7 ? 'active' : ''}" data-target-age="7">
                🚀 Usia 7 Tahun (SD Kelas 1-2)
              </button>
            </div>
          </div>
        </div>

        ${completedBannerHtml}
        <div class="games-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    // Bind age switcher buttons
    this.stage.querySelectorAll('.age-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetAge = btn.getAttribute('data-target-age');
        if (targetAge !== StorageService.getAgeGroup()) {
          StorageService.saveAgeGroup(targetAge);
          eventBus.emit('sound:pop');
          eventBus.emit('age:changed', targetAge);
          eventBus.emit('feedback:cheer', targetAge === '7'
            ? 'Beralih ke tantangan logika & sains untuk usia 7 tahun (SD Kelas 1-2)!'
            : 'Beralih ke petualangan logika untuk usia 4 tahun (PAUD / TK-A)!'
          );
          this.renderMenuView();
        }
      });
    });

    this.stage.querySelectorAll('.game-card').forEach(card => {
      const isCompleted = card.getAttribute('data-completed') === 'true';

      if (isCompleted) {
        card.addEventListener('click', () => {
          eventBus.emit('sound:wrong');
          eventBus.emit('feedback:cheer', 'Tugas ini sudah selesai dikerjakan dan dinilai. Pilih tugas lain ya!');
          eventBus.emit('speech:speak', 'Tugas ini sudah selesai dikerjakan.');
          card.classList.add('shake-animation');
          setTimeout(() => card.classList.remove('shake-animation'), 400);
        });
      } else {
        card.addEventListener('click', () => {
          eventBus.emit('sound:pop');
          const gameId = card.getAttribute('data-id');
          this.launchGame(gameId, 0);
        });
      }
    });
  }

  launchGame(gameId, levelIndex = 0) {
    const ageGroup = StorageService.getAgeGroup();
    if (StorageService.isGameCompleted(gameId, ageGroup)) {
      this.showMenu();
      return;
    }

    if (this.activeGameInstance) {
      this.activeGameInstance.destroy();
    }

    const game = gameRegistry.create(gameId, ageGroup);
    if (!game) {
      console.warn(`Game not found: ${gameId}`);
      this.showMenu();
      return;
    }

    this.activeGameInstance = game;
    gameState.currentGame = gameId;
    gameState.currentLevel = levelIndex;
    game.mount(this.stage, levelIndex);
  }
}
