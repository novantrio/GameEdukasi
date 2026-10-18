// src/audio/SoundManager.js
import { AudioSynthesizer } from './AudioSynthesizer.js';
import { SpeechService } from './SpeechService.js';
import { eventBus } from '../core/EventBus.js';

export class SoundManager {
  constructor() {
    this.synth = new AudioSynthesizer();
    this.speech = new SpeechService();
    this.isMuted = false;

    eventBus.on('audio:muted', muted => {
      this.isMuted = muted;
      if (muted) {
        this.speech.stop();
      }
    });

    eventBus.on('sound:pop', () => this.playPop());
    eventBus.on('sound:correct', () => this.playCorrect());
    eventBus.on('sound:wrong', () => this.playWrong());
    eventBus.on('sound:star', () => this.playStar());
    eventBus.on('sound:whoosh', () => this.playWhoosh());
    eventBus.on('sound:fanfare', () => this.playFanfare());

    eventBus.on('speech:speak', payload => {
      if (typeof payload === 'string') {
        this.speak(payload);
      } else if (payload && payload.text) {
        this.speak(payload.text, payload.onComplete);
      }
    });
  }

  playPop() {
    if (!this.isMuted) this.synth.playPop();
  }

  playCorrect() {
    if (!this.isMuted) this.synth.playCorrect();
  }

  playWrong() {
    if (!this.isMuted) this.synth.playWrong();
  }

  playStar() {
    if (!this.isMuted) this.synth.playStar();
  }

  playWhoosh() {
    if (!this.isMuted) this.synth.playWhoosh();
  }

  playFanfare() {
    if (!this.isMuted) this.synth.playFanfare();
  }

  speak(text, onComplete = null) {
    if (this.isMuted) {
      const waitTime = Math.min(2500, Math.max(1200, (text || '').length * 55));
      if (onComplete) setTimeout(onComplete, waitTime);
      return;
    }
    this.speech.speak(text, onComplete);
  }
}

export const soundManager = new SoundManager();
