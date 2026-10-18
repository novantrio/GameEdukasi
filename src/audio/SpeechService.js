// src/audio/SpeechService.js

export class SpeechService {
  constructor() {
    this.voice = null;
    this.currentUtterance = null;
    this.fallbackTimer = null;
    this.initVoice();
  }

  initVoice() {
    if ('speechSynthesis' in window) {
      this.loadVoice();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => this.loadVoice());
    }
  }

  loadVoice() {
    const indonesianVoices = window.speechSynthesis.getVoices().filter(voice =>
      /^id(?:-|$)/i.test(voice.lang.replace('_', '-'))
    );
    // Prefer higher quality Indonesian voices when the browser provides them.
    const quality = voice => {
      const name = voice.name.toLowerCase();
      return (/(natural|neural|enhanced|premium)/.test(name) ? 4 : 0) +
        (/(google|microsoft|siri)/.test(name) ? 2 : 0) +
        (voice.lang.toLowerCase().replace('_', '-') === 'id-id' ? 1 : 0);
    };
    indonesianVoices.sort((a, b) => quality(b) - quality(a));
    this.voice = indonesianVoices[0] || null;
  }

  speak(text, onComplete = null) {
    if (!('speechSynthesis' in window) || !text) {
      if (onComplete) setTimeout(onComplete, 1200);
      return;
    }

    try {
      if (this.fallbackTimer) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      // Short delay after cancel prevents Safari/Chrome speech queue lockup
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        this.loadVoice();
        if (this.voice) {
          utterance.voice = this.voice;
        }
        utterance.rate = 0.92;
        utterance.pitch = 1;
        utterance.lang = 'id-ID';

        let finished = false;
        const handleComplete = () => {
          if (!finished) {
            finished = true;
            if (this.fallbackTimer) {
              clearTimeout(this.fallbackTimer);
              this.fallbackTimer = null;
            }
            this.currentUtterance = null;
            if (onComplete) onComplete();
          }
        };

        utterance.onend = handleComplete;
        utterance.onerror = (e) => {
          console.warn('Speech error event:', e);
          handleComplete();
        };

        this.currentUtterance = utterance;

        // Chrome bug fallback: synthesize duration ~ 3.5 words/sec + 1.5s grace
        const words = text.split(/\s+/).length;
        const estimatedMs = Math.max(1800, (words / 2.2) * 1000 + 1200);
        this.fallbackTimer = setTimeout(handleComplete, estimatedMs);

        window.speechSynthesis.speak(utterance);
      }, 60);
    } catch (e) {
      console.warn('Speech synthesis exception:', e);
      if (onComplete) setTimeout(onComplete, 1200);
    }
  }

  stop() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }
}
