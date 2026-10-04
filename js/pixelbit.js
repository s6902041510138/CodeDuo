/**
 * CodeDuo - "Pixel-Bit" Mascot Controller
 * Interactive Cyber-Robot with dynamic SVGs, facial expressions, and speech bubble hints.
 */

class PixelBitMascot {
  constructor(containerId = 'mascot-container', bubbleId = 'mascot-bubble') {
    this.container = document.getElementById(containerId);
    this.bubble = document.getElementById(bubbleId);
    this.currentMood = 'idle';
  }

  getSvg(mood = 'idle', skin = 'cyber-bot') {
    let eyeLeft = `<rect x="36" y="42" width="8" height="12" rx="2" fill="#00f0ff" />`;
    let eyeRight = `<rect x="56" y="42" width="8" height="12" rx="2" fill="#00f0ff" />`;
    let mouth = `<path d="M42 62 Q50 68 58 62" stroke="#00f0ff" stroke-width="3" fill="none" stroke-linecap="round" />`;
    let bodyColor = skin === 'matrix-gold' ? '#d97706' : '#1e293b';
    let accentColor = skin === 'matrix-gold' ? '#f59e0b' : '#06b6d4';
    let screenColor = '#090d16';
    let antennaLight = accentColor;
    let extraEffect = '';

    if (mood === 'correct' || mood === 'happy' || mood === 'celebrate') {
      eyeLeft = `<path d="M34 48 Q40 38 46 48" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round" />`;
      eyeRight = `<path d="M54 48 Q60 38 66 48" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round" />`;
      mouth = `<path d="M40 60 Q50 72 60 60" stroke="#10b981" stroke-width="4" fill="#10b981" opacity="0.3" stroke-linecap="round" />`;
      antennaLight = '#10b981';
      accentColor = '#10b981';
      extraEffect = `
        <circle cx="15" cy="30" r="4" fill="#f59e0b" class="animate-ping" />
        <circle cx="85" cy="25" r="3" fill="#10b981" class="animate-ping" />
      `;
    } else if (mood === 'incorrect' || mood === 'glitch' || mood === 'sad') {
      eyeLeft = `<path d="M34 40 L44 50 M44 40 L34 50" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />`;
      eyeRight = `<path d="M56 40 L66 50 M66 40 L56 50" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />`;
      mouth = `<path d="M42 64 Q50 56 58 64" stroke="#ef4444" stroke-width="3" fill="none" stroke-linecap="round" />`;
      antennaLight = '#ef4444';
      screenColor = '#2a0808';
    } else if (mood === 'boss') {
      eyeLeft = `<polygon points="32,45 46,41 46,47 32,51" fill="#ec4899" />`;
      eyeRight = `<polygon points="68,45 54,41 54,47 68,51" fill="#ec4899" />`;
      mouth = `<line x1="42" y1="62" x2="58" y2="62" stroke="#ec4899" stroke-width="3" />`;
      antennaLight = '#ec4899';
      accentColor = '#ec4899';
    } else if (mood === 'thinking') {
      eyeLeft = `<circle cx="40" cy="48" r="5" fill="#8b5cf6" />`;
      eyeRight = `<circle cx="60" cy="44" r="5" fill="#8b5cf6" />`;
      mouth = `<circle cx="50" cy="62" r="3" fill="#8b5cf6" />`;
      antennaLight = '#8b5cf6';
    }

    return `
      <svg viewBox="0 0 100 110" width="100%" height="100%" class="drop-shadow-lg transition-transform duration-300">
        <!-- Floating Thruster Glow -->
        <ellipse cx="50" cy="102" rx="18" ry="4" fill="${accentColor}" opacity="0.4" class="animate-pulse" />
        
        <!-- Antenna -->
        <line x1="50" y1="20" x2="50" y2="6" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
        <circle cx="50" cy="5" r="5" fill="${antennaLight}" filter="drop-shadow(0 0 6px ${antennaLight})" />
        
        <!-- Ears / Audio Sensors -->
        <rect x="14" y="38" width="6" height="20" rx="3" fill="${accentColor}" />
        <rect x="80" y="38" width="6" height="20" rx="3" fill="${accentColor}" />
        
        <!-- Head Chassis -->
        <rect x="20" y="20" width="60" height="56" rx="16" fill="${bodyColor}" stroke="${accentColor}" stroke-width="2.5" />
        
        <!-- Cyber Visor / Screen -->
        <rect x="26" y="28" width="48" height="42" rx="10" fill="${screenColor}" stroke="#334155" stroke-width="1.5" />
        
        <!-- Screen Scanlines -->
        <line x1="28" y1="36" x2="72" y2="36" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="28" y1="44" x2="72" y2="44" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="28" y1="52" x2="72" y2="52" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="28" y1="60" x2="72" y2="60" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        
        <!-- Eyes & Mouth -->
        ${eyeLeft}
        ${eyeRight}
        ${mouth}
        
        <!-- Body / Torso -->
        <path d="M34 78 L66 78 L60 96 L40 96 Z" fill="${bodyColor}" stroke="${accentColor}" stroke-width="2" />
        <!-- Core Reactor -->
        <circle cx="50" cy="87" r="4" fill="${antennaLight}" filter="drop-shadow(0 0 4px ${antennaLight})" />
        
        <!-- Extra Mood Sparks -->
        ${extraEffect}
      </svg>
    `;
  }

  setMood(mood, speechText = null) {
    this.currentMood = mood;
    if (!this.container) {
      this.container = document.getElementById('mascot-container');
    }
    if (!this.bubble) {
      this.bubble = document.getElementById('mascot-bubble');
    }

    if (this.container) {
      const activeSkin = window.appState ? window.appState.data.inventory.activeSkin : 'cyber-bot';
      this.container.innerHTML = this.getSvg(mood, activeSkin);

      // Animation classes
      this.container.className = 'w-24 h-28 relative flex items-center justify-center';
      if (mood === 'correct' || mood === 'celebrate') {
        this.container.classList.add('mascot-celebrate');
      } else if (mood === 'incorrect') {
        this.container.classList.add('mascot-sad');
      } else {
        this.container.classList.add('mascot-float');
      }
    }

    if (this.bubble && speechText) {
      this.bubble.textContent = speechText;
      this.bubble.classList.remove('opacity-0');
      this.bubble.classList.add('opacity-100');
    }
  }

  say(text) {
    if (!this.bubble) this.bubble = document.getElementById('mascot-bubble');
    if (this.bubble) {
      this.bubble.textContent = text;
      this.bubble.classList.remove('opacity-0');
      this.bubble.classList.add('opacity-100');
    }
  }
}

window.pixelBit = new PixelBitMascot();
