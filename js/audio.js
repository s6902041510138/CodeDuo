/**
 * CodeDuo - Retro 8-bit / Cyberpunk Audio Synthesizer (Web Audio API)
 * Zero external audio files required. Works immediately in any browser!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('codeduo_muted') === 'true';
    this.volume = 0.25;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('codeduo_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Helper to create simple tone
  playTone(freq, type = 'square', duration = 0.1, delay = 0, gainVal = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // 1. Subtle UI Click
  playClick() {
    this.playTone(800, 'sine', 0.04, 0, 0.1);
  }

  // 2. Select Node / Chip
  playSelect() {
    this.playTone(523.25, 'triangle', 0.06, 0, 0.15); // C5
    this.playTone(659.25, 'triangle', 0.08, 0.05, 0.15); // E5
  }

  // 3. Correct Answer Jingle (Duolingo style uplifting chiptune)
  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.08, t: 0.0 },    // C5
      { f: 659.25, d: 0.08, t: 0.08 },   // E5
      { f: 783.99, d: 0.1, t: 0.16 },    // G5
      { f: 1046.50, d: 0.25, t: 0.24 }   // C6
    ];

    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.t, 0.25);
      this.playTone(n.f * 0.5, 'sine', n.d, n.t, 0.15); // warm bass
    });
  }

  // 4. Incorrect Answer Buzz (Retro arcade glitch buzzer)
  playIncorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, startTime);
    osc.frequency.linearRampToValueAtTime(110, startTime + 0.28);

    gain.gain.setValueAtTime(0.25 * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.3);
  }

  // 5. Coin Collect Sound
  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.playTone(987.77, 'square', 0.08, 0, 0.15);     // B5
    this.playTone(1318.51, 'square', 0.25, 0.08, 0.2);  // E6
  }

  // 6. Boss Hit Impact Laser
  playBossHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, startTime);
    osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.25);

    gain.gain.setValueAtTime(0.3 * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }

  // 7. Victory Fanfare (Stage Complete)
  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.12, t: 0.00 }, // C5
      { f: 523.25, d: 0.12, t: 0.12 }, // C5
      { f: 523.25, d: 0.12, t: 0.24 }, // C5
      { f: 659.25, d: 0.24, t: 0.36 }, // E5
      { f: 783.99, d: 0.18, t: 0.60 }, // G5
      { f: 1046.50, d: 0.45, t: 0.78 } // C6
    ];

    melody.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.t, 0.25);
    });
  }

  // 8. Level Up Shimmer
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.12, idx * 0.06, 0.18);
    });
  }
}

// Global Sound Instance
window.sound = new SoundEngine();
