/**
 * CodeDuo - Main Application Controller
 * Handles Navigation, Map Rendering, Lesson Game Loop, Practice Arena, Shop, and Profile.
 */

class CodeDuoApp {
  constructor() {
    this.currentView = 'learn'; // 'learn' | 'practice' | 'leaderboard' | 'shop' | 'profile'
    this.activeLesson = null;
    this.lessonState = {
      stageId: null,
      questions: [],
      currentIndex: 0,
      errors: 0,
      userAnswers: {},
      reorderState: { pool: [], placed: [] },
      selectedOption: null,
      terminalValue: '',
      isAnswerChecked: false,
      isCorrect: false,
      bossHp: 100
    };

    // Practice Arena State
    this.practiceGame = {
      active: false,
      timer: 60,
      score: 0,
      interval: null,
      currentQ: null
    };

    this.init();
  }

  init() {
    // Subscribe to state changes to update header and UI
    window.appState.subscribe(() => {
      this.updateHeaderStats();
    });

    // Initial render
    this.updateHeaderStats();
    this.setupEventListeners();
    this.renderLearnMap();
    this.renderDailyQuests();

    // Check audio mute state
    this.updateAudioButtonState();
  }

  // --- Top Header Updates ---
  updateHeaderStats() {
    const user = window.appState.data.user;

    // Level & XP Bar
    const lvlEl = document.getElementById('header-level');
    const xpTextEl = document.getElementById('header-xp-text');
    const xpBarEl = document.getElementById('header-xp-bar');
    if (lvlEl) lvlEl.textContent = `LVL ${user.level}`;
    if (xpTextEl) xpTextEl.textContent = `${user.xp} / ${user.xpToNext} XP`;
    if (xpBarEl) {
      const pct = Math.min(100, Math.floor((user.xp / user.xpToNext) * 100));
      xpBarEl.style.width = `${pct}%`;
    }

    // Streak Days
    const streakEl = document.getElementById('header-streak');
    if (streakEl) streakEl.textContent = user.streak;

    // Byte Coins
    const coinsEl = document.getElementById('header-coins');
    if (coinsEl) coinsEl.textContent = user.coins;

    // Energy / Health Battery
    const energyEl = document.getElementById('header-energy');
    const energyCellsEl = document.getElementById('header-energy-cells');
    if (energyEl) energyEl.textContent = `${user.energy}/${user.maxEnergy}`;
    if (energyCellsEl) {
      let cellsHtml = '';
      for (let i = 1; i <= user.maxEnergy; i++) {
        const isFull = i <= user.energy;
        cellsHtml += `<div class="h-3 w-2 rounded-sm transition-all duration-300 ${isFull ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-700'}"></div>`;
      }
      energyCellsEl.innerHTML = cellsHtml;
    }

    // Language Selector
    const langSelect = document.getElementById('language-select');
    if (langSelect && langSelect.value !== user.language) {
      langSelect.value = user.language;
    }
  }

  updateAudioButtonState() {
    const btn = document.getElementById('btn-audio-toggle');
    if (!btn) return;
    const isMuted = window.sound.isMuted();
    btn.innerHTML = isMuted 
      ? '<i data-lucide="volume-x" class="w-5 h-5 text-slate-400"></i>' 
      : '<i data-lucide="volume-2" class="w-5 h-5 text-emerald-400 animate-pulse"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-nav-target');
        this.switchView(target);
      });
    });

    // Audio Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        window.sound.toggleMute();
        this.updateAudioButtonState();
        if (!window.sound.isMuted()) window.sound.playSelect();
      });
    }

    // CRT Scanlines Toggle
    const crtBtn = document.getElementById('btn-crt-toggle');
    const crtOverlay = document.getElementById('crt-overlay');
    if (crtBtn && crtOverlay) {
      crtBtn.addEventListener('click', () => {
        crtOverlay.classList.toggle('hidden');
        crtBtn.classList.toggle('text-cyan-400');
        window.sound.playClick();
      });
    }

    // Language Selector
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        window.appState.setLanguage(e.target.value);
        window.sound.playSelect();
        this.renderLearnMap();
      });
    }

    // Keyboard Shortcuts (Enter to check/continue)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const lessonModal = document.getElementById('lesson-modal');
        if (lessonModal && !lessonModal.classList.contains('hidden')) {
          if (!this.lessonState.isAnswerChecked) {
            this.handleCheckAnswer();
          } else {
            this.handleContinueLesson();
          }
        }
      }
    });

    // Window resize to redraw connectors
    window.addEventListener('resize', () => {
      this.drawCircuitConnections();
    });
  }

  // --- View Switcher ---
  switchView(viewName) {
    this.currentView = viewName;
    window.sound.playClick();

    // Update active nav styling
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      const target = btn.getAttribute('data-nav-target');
      if (target === viewName) {
        btn.classList.add('bg-slate-800', 'text-cyan-400', 'border-l-4', 'border-cyan-400');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('bg-slate-800', 'text-cyan-400', 'border-l-4', 'border-cyan-400');
        btn.classList.add('text-slate-400');
      }
    });

    // Hide all view containers
    document.querySelectorAll('.app-view-container').forEach(v => v.classList.add('hidden'));

    // Show target view
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) targetEl.classList.remove('hidden');

    // Specific view init
    if (viewName === 'learn') {
      this.renderLearnMap();
      this.renderDailyQuests();
    } else if (viewName === 'practice') {
      this.initPracticeArena();
    } else if (viewName === 'leaderboard') {
      this.renderLeaderboard();
    } else if (viewName === 'shop') {
      this.renderShop();
    } else if (viewName === 'profile') {
      this.renderProfile();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Learn Map Rendering ---
  renderLearnMap() {
    const container = document.getElementById('map-nodes-container');
    if (!container) return;

    const stages = window.appState.data.stages;
    let html = '';

    stages.forEach((stage, idx) => {
      const isCompleted = stage.status === 'completed';
      const isUnlocked = stage.status === 'unlocked';
      const isLocked = stage.status === 'locked';
      const isBoss = stage.type === 'boss';

      let stateClass = 'locked';
      if (isCompleted) stateClass = 'completed';
      else if (isUnlocked) stateClass = 'active-unlocked';

      let icon = 'lock';
      if (isCompleted) icon = 'check';
      else if (isBoss) icon = 'skull';
      else if (isUnlocked) icon = 'terminal';

      let starsHtml = '';
      if (isCompleted) {
        starsHtml = `
          <div class="absolute -bottom-6 flex items-center justify-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-amber-500/40">
            ${[1, 2, 3].map(s => `
              <i data-lucide="star" class="w-3 h-3 ${s <= (stage.stars || 3) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}"></i>
            `).join('')}
          </div>
        `;
      }

      let startTag = '';
      if (isUnlocked && !isCompleted) {
        startTag = `
          <div class="absolute -top-7 px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-arcade text-[10px] rounded-md tracking-wider animate-bounce shadow-[0_0_10px_#8b5cf6]">
            START
          </div>
        `;
      }

      html += `
        <div class="flex flex-col items-center relative ${stage.offset}" id="stage-node-wrapper-${stage.id}">
          <button 
            class="map-node ${stateClass} ${isBoss ? 'boss-node' : ''}" 
            data-stage-id="${stage.id}"
            title="${stage.title}"
            id="node-btn-${stage.id}"
          >
            ${startTag}
            <i data-lucide="${icon}" class="w-8 h-8 ${isBoss ? 'w-10 h-10 text-white animate-pulse' : 'text-slate-100'}"></i>
            ${starsHtml}
          </button>
          
          <!-- Node Label -->
          <div class="mt-3 text-center pointer-events-none">
            <h4 class="font-arcade text-xs ${isCompleted ? 'text-emerald-400' : isUnlocked ? 'text-purple-300 text-glow-purple' : 'text-slate-500'}">
              ${stage.title}
            </h4>
            <p class="text-xs text-slate-400 font-mono mt-0.5">${stage.subtitle}</p>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Node click handlers
    document.querySelectorAll('.map-node').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stageId = parseInt(e.currentTarget.getAttribute('data-stage-id'));
        this.handleNodeClick(stageId);
      });
    });

    setTimeout(() => {
      this.drawCircuitConnections();
    }, 100);
  }

  drawCircuitConnections() {
    const svg = document.getElementById('circuit-svg');
    const container = document.getElementById('map-nodes-container');
    if (!svg || !container) return;

    const stages = window.appState.data.stages;
    svg.setAttribute('width', container.offsetWidth);
    svg.setAttribute('height', container.offsetHeight);

    let pathD = '';
    const points = [];

    stages.forEach(stage => {
      const btn = document.getElementById(`node-btn-${stage.id}`);
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        const x = (btnRect.left + btnRect.width / 2) - contRect.left;
        const y = (btnRect.top + btnRect.height / 2) - contRect.top;
        points.push({ x, y, status: stage.status });
      }
    });

    if (points.length < 2) return;

    let pathsHtml = '';
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;

      const d = `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
      const isActive = p2.status !== 'locked';

      pathsHtml += `
        <path d="${d}" stroke="${isActive ? '#8b5cf6' : '#1e293b'}" stroke-width="${isActive ? '5' : '4'}" fill="none" stroke-linecap="round" stroke-dasharray="${isActive ? '8 4' : 'none'}" class="${isActive ? 'animate-pulse' : ''}" />
      `;
    }

    svg.innerHTML = pathsHtml;
  }

  // --- Node Click / Stage Preview Modal ---
  handleNodeClick(stageId) {
    const stage = window.appState.data.stages.find(s => s.id === stageId);
    if (!stage) return;

    if (stage.status === 'locked') {
      window.sound.playIncorrect();
      this.showToast('NODE ENCRYPTED! Complete preceding nodes to unlock this stage.', 'error');
      return;
    }

    window.sound.playSelect();
    this.openStagePreviewModal(stage);
  }

  openStagePreviewModal(stage) {
    const modal = document.getElementById('stage-preview-modal');
    if (!modal) return;

    document.getElementById('preview-title').textContent = stage.title;
    document.getElementById('preview-subtitle').textContent = stage.subtitle;
    document.getElementById('preview-desc').textContent = stage.description;
    document.getElementById('preview-xp').textContent = `+${stage.xpReward} XP`;
    document.getElementById('preview-coins').textContent = `+${stage.coinReward} 🪙`;

    const startBtn = document.getElementById('btn-start-stage');
    startBtn.onclick = () => {
      this.closeStagePreviewModal();
      this.startLesson(stage.id);
    };

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }

  closeStagePreviewModal() {
    const modal = document.getElementById('stage-preview-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  // --- Daily Quests Card ---
  renderDailyQuests() {
    const container = document.getElementById('daily-quests-list');
    if (!container) return;

    const quests = window.appState.data.dailyQuests;
    let html = '';

    quests.forEach(q => {
      const pct = Math.min(100, Math.floor((q.progress / q.target) * 100));
      html += `
        <div class="p-3 bg-slate-900/80 rounded-xl border ${q.completed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800'}">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="font-bold ${q.completed ? 'text-emerald-400' : 'text-slate-200'}">${q.title}</span>
            <span class="font-mono text-amber-400">+${q.reward} 🪙</span>
          </div>
          <p class="text-xs text-slate-400 mb-2">${q.desc}</p>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500" style="width: ${pct}%"></div>
          </div>
          <div class="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
            <span>${q.progress}/${q.target}</span>
            <span>${q.completed ? 'COMPLETED ✓' : `${pct}%`}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // --- Core Game: Interactive Lesson Screen ---
  startLesson(stageId) {
    if (window.appState.data.user.energy <= 0) {
      window.sound.playIncorrect();
      this.showToast('BATTERY DEPLETED! Refill energy in the Cyber Shop to continue hacking.', 'error');
      this.switchView('shop');
      return;
    }

    const lang = window.appState.data.user.language || 'javascript';
    const questions = window.QUESTION_DATA[lang][stageId];

    if (!questions || questions.length === 0) {
      this.showToast('No questions loaded for this node yet.', 'error');
      return;
    }

    const stage = window.appState.data.stages.find(s => s.id === stageId);

    this.lessonState = {
      stageId: stageId,
      stage: stage,
      questions: JSON.parse(JSON.stringify(questions)),
      currentIndex: 0,
      errors: 0,
      userAnswers: {},
      reorderState: { pool: [], placed: [] },
      selectedOption: null,
      terminalValue: '',
      isAnswerChecked: false,
      isCorrect: false,
      bossHp: 100
    };

    const modal = document.getElementById('lesson-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Show/hide Boss HUD
    const bossHud = document.getElementById('lesson-boss-hud');
    if (stage.type === 'boss') {
      bossHud.classList.remove('hidden');
      this.updateBossHp(100);
      window.pixelBit.setMood('boss', 'BEWARE! The Glitch King corrupted the core loop. Destroy it with clean code!');
    } else {
      bossHud.classList.add('hidden');
      window.pixelBit.setMood('idle', questions[0].mascotTip || 'Analyze the syntax carefully, NetRunner!');
    }

    this.renderCurrentQuestion();
    window.sound.playSelect();
  }

  updateBossHp(hp) {
    this.lessonState.bossHp = Math.max(0, hp);
    const bar = document.getElementById('boss-hp-bar');
    const text = document.getElementById('boss-hp-text');
    if (bar) bar.style.width = `${this.lessonState.bossHp}%`;
    if (text) text.textContent = `${this.lessonState.bossHp}/100 HP`;

    if (this.lessonState.bossHp <= 30) {
      if (bar) bar.className = 'h-full bg-red-600 animate-pulse transition-all duration-500';
    }
  }

  renderCurrentQuestion() {
    const q = this.lessonState.questions[this.lessonState.currentIndex];
    const totalQ = this.lessonState.questions.length;
    const progressPct = ((this.lessonState.currentIndex) / totalQ) * 100;

    // Progress bar
    const progBar = document.getElementById('lesson-progress-bar');
    if (progBar) progBar.style.width = `${progressPct}%`;

    // Question meta
    document.getElementById('lesson-q-title').textContent = q.title;
    document.getElementById('lesson-q-instruction').textContent = q.instruction;

    // Mascot tip
    if (this.lessonState.stage.type === 'boss') {
      window.pixelBit.setMood('boss', q.mascotTip || 'Break the boss defense loops!');
    } else {
      window.pixelBit.setMood('idle', q.mascotTip || 'Scan for syntax anomalies!');
    }

    // Reset interaction state
    this.lessonState.isAnswerChecked = false;
    this.lessonState.selectedOption = null;
    this.lessonState.terminalValue = '';
    this.hideFeedbackDrawer();

    const bodyContainer = document.getElementById('lesson-question-body');

    if (q.type === 'reorder') {
      this.renderReorderQuestion(q, bodyContainer);
    } else if (q.type === 'bug_fix') {
      this.renderBugFixQuestion(q, bodyContainer);
    } else if (q.type === 'terminal') {
      this.renderTerminalQuestion(q, bodyContainer);
    }

    // Enable check button
    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.textContent = 'CHECK ANSWER';
    checkBtn.className = 'arcade-btn arcade-btn-green px-8 py-3.5 rounded-xl font-arcade text-xs tracking-wider font-bold';
    checkBtn.disabled = false;
    checkBtn.onclick = () => this.handleCheckAnswer();

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Question Type 1: Reorder / Drag & Drop ---
  renderReorderQuestion(q, container) {
    // Shuffle initial pool
    const shuffled = [...q.blocks].sort(() => Math.random() - 0.5);
    this.lessonState.reorderState = {
      pool: shuffled,
      placed: []
    };

    container.innerHTML = `
      <div class="w-full flex flex-col gap-6">
        <!-- Target Placed Slots -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 min-h-[160px] flex flex-col gap-2">
          <div class="text-xs text-slate-500 font-mono mb-1 flex items-center gap-2">
            <i data-lucide="terminal" class="w-4 h-4 text-cyan-400"></i>
            <span>CODE ASSEMBLY BUFFER: (Click snippets below or tap to remove)</span>
          </div>
          <div id="reorder-placed-container" class="flex flex-col gap-2 min-h-[100px]">
            <div id="reorder-empty-prompt" class="text-sm text-slate-500 italic py-6 text-center">
              Select code chips below to assemble in sequence...
            </div>
          </div>
        </div>

        <!-- Available Pool -->
        <div>
          <div class="text-xs text-slate-400 font-mono mb-2 uppercase tracking-wide">Available Blocks:</div>
          <div id="reorder-pool-container" class="flex flex-wrap gap-2.5"></div>
        </div>
      </div>
    `;

    this.updateReorderContainers();
  }

  updateReorderContainers() {
    const placedContainer = document.getElementById('reorder-placed-container');
    const poolContainer = document.getElementById('reorder-pool-container');
    const emptyPrompt = document.getElementById('reorder-empty-prompt');

    if (!placedContainer || !poolContainer) return;

    // Render Placed
    if (this.lessonState.reorderState.placed.length === 0) {
      if (emptyPrompt) emptyPrompt.style.display = 'block';
    } else {
      if (emptyPrompt) emptyPrompt.style.display = 'none';
    }

    placedContainer.innerHTML = '';
    this.lessonState.reorderState.placed.forEach((block, idx) => {
      const lineNum = String(idx + 1).padStart(2, '0');
      const itemEl = document.createElement('div');
      itemEl.className = 'flex items-center gap-3 bg-slate-800/80 border border-cyan-500/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-700/80 transition-all';
      itemEl.innerHTML = `
        <span class="font-mono text-xs text-cyan-400/80 font-bold select-none">${lineNum}</span>
        <code class="font-code text-sm text-emerald-300 flex-1 whitespace-pre">${this.escapeHtml(block.code)}</code>
        <i data-lucide="x" class="w-4 h-4 text-slate-400 hover:text-red-400"></i>
      `;
      itemEl.addEventListener('click', () => {
        if (this.lessonState.isAnswerChecked) return;
        window.sound.playClick();
        // Remove from placed, put back to pool
        this.lessonState.reorderState.placed.splice(idx, 1);
        this.lessonState.reorderState.pool.push(block);
        this.updateReorderContainers();
      });
      placedContainer.appendChild(itemEl);
    });

    // Render Pool
    poolContainer.innerHTML = '';
    this.lessonState.reorderState.pool.forEach((block, idx) => {
      const chipEl = document.createElement('button');
      chipEl.className = 'code-chip text-slate-200 hover:border-cyan-400';
      chipEl.innerHTML = `<code class="whitespace-pre">${this.escapeHtml(block.code)}</code>`;
      chipEl.addEventListener('click', () => {
        if (this.lessonState.isAnswerChecked) return;
        window.sound.playSelect();
        // Move from pool to placed
        this.lessonState.reorderState.pool.splice(idx, 1);
        this.lessonState.reorderState.placed.push(block);
        this.updateReorderContainers();
      });
      poolContainer.appendChild(chipEl);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Question Type 2: Multiple Choice Bug Fix ---
  renderBugFixQuestion(q, container) {
    const lines = q.codeSnippet.split('\n');
    let codeHtml = '';
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const isErrorLine = q.errorLine === lineNum;
      codeHtml += `
        <div class="flex items-center gap-3 px-3 py-1 font-mono text-sm ${isErrorLine ? 'bg-red-500/15 border-l-2 border-red-500' : ''}">
          <span class="text-slate-600 select-none w-6 text-right">${lineNum}</span>
          <span class="${isErrorLine ? 'text-red-300 font-semibold' : 'text-slate-200'}">${this.escapeHtml(line)}</span>
          ${isErrorLine ? '<span class="text-[10px] text-red-400 ml-auto font-arcade">BUG HERE?</span>' : ''}
        </div>
      `;
    });

    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
      optionsHtml += `
        <button 
          class="bug-option-btn w-full text-left p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-purple-400 hover:bg-slate-800/60 transition-all flex items-start gap-3 text-sm"
          data-opt-id="${opt.id}"
        >
          <div class="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5 opt-radio">
            <div class="w-2.5 h-2.5 rounded-full bg-transparent opt-radio-inner"></div>
          </div>
          <span class="text-slate-200 opt-text">${opt.text}</span>
        </button>
      `;
    });

    container.innerHTML = `
      <div class="w-full flex flex-col gap-6">
        <!-- Terminal Window View -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div class="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-amber-500"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-xs font-mono text-slate-400 ml-2">cyber_debugger.js</span>
          </div>
          <div class="py-2.5 font-code bg-black/40">
            ${codeHtml}
          </div>
        </div>

        <!-- Options Container -->
        <div class="flex flex-col gap-2.5" id="bug-options-container">
          ${optionsHtml}
        </div>
      </div>
    `;

    document.querySelectorAll('.bug-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.lessonState.isAnswerChecked) return;
        window.sound.playSelect();
        const optId = e.currentTarget.getAttribute('data-opt-id');
        this.lessonState.selectedOption = optId;

        // Update visuals
        document.querySelectorAll('.bug-option-btn').forEach(b => {
          b.classList.remove('border-purple-500', 'bg-purple-950/20');
          b.querySelector('.opt-radio-inner').classList.remove('bg-purple-400');
        });

        e.currentTarget.classList.add('border-purple-500', 'bg-purple-950/20');
        e.currentTarget.querySelector('.opt-radio-inner').classList.add('bg-purple-400');
      });
    });
  }

  // --- Question Type 3: Fill-In-The-Blank Terminal ---
  renderTerminalQuestion(q, container) {
    container.innerHTML = `
      <div class="w-full flex flex-col gap-6">
        <div class="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div class="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-amber-500"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-xs font-mono text-slate-400 ml-2">root@codeduo-cli:~</span>
            </div>
            <span class="text-[10px] font-mono text-cyan-400 animate-pulse">LIVE REPL</span>
          </div>

          <div class="p-6 font-code text-sm">
            <div class="text-slate-500 mb-3">$ ${q.terminalCommand}</div>
            
            <div class="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-cyan-500/40 p-4 rounded-lg">
              ${q.prefix ? `<span class="text-slate-300 font-bold">${this.escapeHtml(q.prefix)}</span>` : ''}
              
              <input 
                type="text" 
                id="terminal-input"
                class="bg-black/60 border border-cyan-400 text-cyan-300 font-bold px-3 py-1.5 rounded outline-none focus:ring-2 focus:ring-cyan-400 font-code text-base min-w-[120px] transition-all"
                placeholder="${q.placeholder}"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />

              ${q.suffix ? `<span class="text-slate-300 font-bold">${this.escapeHtml(q.suffix)}</span>` : ''}
            </div>

            <div class="mt-4 text-xs text-slate-500 font-mono">
              [TIP] Type the missing code fragment and press Check Answer or ENTER.
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const input = document.getElementById('terminal-input');
      if (input) input.focus();
    }, 100);
  }

  // --- Check Answer Logic ---
  handleCheckAnswer() {
    if (this.lessonState.isAnswerChecked) return;

    const q = this.lessonState.questions[this.lessonState.currentIndex];
    let isCorrect = false;
    let feedbackExplanation = '';

    if (q.type === 'reorder') {
      const placedIds = this.lessonState.reorderState.placed.map(b => b.id);
      if (placedIds.length !== q.solution.length) {
        this.showToast('Please place all code snippets into the buffer before checking!', 'warning');
        return;
      }
      isCorrect = placedIds.every((id, idx) => id === q.solution[idx]);
      feedbackExplanation = isCorrect 
        ? 'Code block compiled with zero errors!' 
        : 'The sequence of execution was invalid. Remember: declaration -> assignment -> invocation.';
    } else if (q.type === 'bug_fix') {
      if (!this.lessonState.selectedOption) {
        this.showToast('Please select an option before checking!', 'warning');
        return;
      }
      const selectedOpt = q.options.find(o => o.id === this.lessonState.selectedOption);
      isCorrect = selectedOpt ? selectedOpt.correct : false;
      const correctOpt = q.options.find(o => o.correct);
      feedbackExplanation = selectedOpt.explanation || (correctOpt ? correctOpt.explanation : '');
    } else if (q.type === 'terminal') {
      const input = document.getElementById('terminal-input');
      const val = input ? input.value.trim() : '';
      if (!val) {
        this.showToast('Terminal input cannot be empty!', 'warning');
        return;
      }
      isCorrect = q.validAnswers.some(ans => ans.toLowerCase() === val.toLowerCase());
      feedbackExplanation = q.explanation || `Expected syntax: "${q.validAnswers[0]}"`;
    }

    this.lessonState.isAnswerChecked = true;
    this.lessonState.isCorrect = isCorrect;

    // Boss damage calculation
    if (this.lessonState.stage.type === 'boss') {
      if (isCorrect) {
        const dmg = q.bossDamage || 35;
        this.updateBossHp(this.lessonState.bossHp - dmg);
        window.sound.playBossHit();
      }
    }

    if (isCorrect) {
      window.sound.playCorrect();
      window.pixelBit.setMood('correct', 'CLEAN CODE COMPILED! 🔥 Zero bugs detected!');
      this.showFeedbackDrawer(true, feedbackExplanation);
    } else {
      window.sound.playIncorrect();
      this.lessonState.errors += 1;
      const remainingEnergy = window.appState.loseEnergy();
      window.pixelBit.setMood('incorrect', 'SYNTAX ERROR DETECTED! ⚠️ Memory glitch on line!');
      this.showFeedbackDrawer(false, feedbackExplanation);

      if (remainingEnergy <= 0) {
        setTimeout(() => {
          this.handleOutOfEnergy();
        }, 1500);
      }
    }

    // Toggle check button state
    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.textContent = 'CONTINUE (ENTER)';
    checkBtn.className = isCorrect 
      ? 'arcade-btn arcade-btn-green px-8 py-3.5 rounded-xl font-arcade text-xs tracking-wider font-bold'
      : 'arcade-btn arcade-btn-pink px-8 py-3.5 rounded-xl font-arcade text-xs tracking-wider font-bold';
    checkBtn.onclick = () => this.handleContinueLesson();
  }

  showFeedbackDrawer(isCorrect, explanation) {
    const drawer = document.getElementById('lesson-feedback-drawer');
    const title = document.getElementById('feedback-title');
    const desc = document.getElementById('feedback-desc');
    const icon = document.getElementById('feedback-icon');

    if (!drawer) return;

    if (isCorrect) {
      drawer.className = 'feedback-drawer shown-drawer p-5 border-t-2 border-emerald-500 bg-emerald-950/90 backdrop-blur-md flex items-center justify-between';
      title.className = 'font-arcade text-sm text-emerald-400 mb-1';
      title.textContent = 'AWESOME! CORRECT SOLUTION';
      icon.innerHTML = '<i data-lucide="check-circle" class="w-8 h-8 text-emerald-400"></i>';
    } else {
      drawer.className = 'feedback-drawer shown-drawer p-5 border-t-2 border-red-500 bg-red-950/90 backdrop-blur-md flex items-center justify-between';
      title.className = 'font-arcade text-sm text-red-400 mb-1';
      title.textContent = 'SYNTAX ERROR / INCORRECT';
      icon.innerHTML = '<i data-lucide="alert-triangle" class="w-8 h-8 text-red-400"></i>';
    }

    desc.textContent = explanation;
    if (window.lucide) window.lucide.createIcons();
  }

  hideFeedbackDrawer() {
    const drawer = document.getElementById('lesson-feedback-drawer');
    if (drawer) {
      drawer.className = 'feedback-drawer hidden-drawer p-5';
    }
  }

  handleContinueLesson() {
    this.lessonState.currentIndex += 1;

    if (this.lessonState.currentIndex < this.lessonState.questions.length) {
      this.renderCurrentQuestion();
      const checkBtn = document.getElementById('btn-check-answer');
      checkBtn.onclick = () => this.handleCheckAnswer();
    } else {
      // Completed lesson!
      this.finishLesson();
    }
  }

  handleOutOfEnergy() {
    this.closeLesson();
    this.showToast('ENERGY EXHAUSTED! Visit the Cyber Shop to recharge battery cells.', 'error');
    this.switchView('shop');
  }

  closeLesson() {
    const modal = document.getElementById('lesson-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.hideFeedbackDrawer();
  }

  finishLesson() {
    this.closeLesson();
    const stage = this.lessonState.stage;
    const errors = this.lessonState.errors;
    const accuracy = Math.max(0, Math.round(((this.lessonState.questions.length - errors) / this.lessonState.questions.length) * 100));

    let stars = 3;
    if (errors === 1) stars = 2;
    else if (errors >= 2) stars = 1;

    // Apply Rewards
    const xpResult = window.appState.addXP(stage.xpReward);
    window.appState.addCoins(stage.coinReward);
    window.appState.incrementStreak();
    window.appState.completeStage(stage.id, stars, accuracy);

    // Play victory sound & confetti
    window.sound.playVictory();
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Open Victory Modal
    this.openVictoryModal({
      stage: stage,
      stars: stars,
      accuracy: accuracy,
      xpGained: xpResult.xpGained,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      coinsGained: stage.coinReward
    });
  }

  openVictoryModal(res) {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;

    document.getElementById('victory-stage-name').textContent = res.stage.title;
    document.getElementById('victory-xp').textContent = `+${res.xpGained} XP`;
    document.getElementById('victory-coins').textContent = `+${res.coinsGained} 🪙`;
    document.getElementById('victory-accuracy').textContent = `${res.accuracy}%`;

    // Stars render
    const starsContainer = document.getElementById('victory-stars');
    starsContainer.innerHTML = [1, 2, 3].map(s => `
      <i data-lucide="star" class="w-10 h-10 ${s <= res.stars ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-700'}"></i>
    `).join('');

    // Level up notification
    const lvlBanner = document.getElementById('victory-levelup-banner');
    if (res.leveledUp) {
      lvlBanner.classList.remove('hidden');
      document.getElementById('victory-new-level').textContent = `LEVEL ${res.newLevel}!`;
      window.sound.playLevelUp();
    } else {
      lvlBanner.classList.add('hidden');
    }

    const continueBtn = document.getElementById('btn-victory-continue');
    continueBtn.onclick = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      this.switchView('learn');
    };

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }

  // --- Practice Arena ---
  initPracticeArena() {
    const container = document.getElementById('practice-arena-content');
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <!-- Mode 1: Bug Hunter Blitz -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-pink-500 transition-all shadow-xl group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="bug" class="w-6 h-6"></i>
            </div>
            <h3 class="font-arcade text-base text-pink-400 mb-2">BUG HUNTER BLITZ</h3>
            <p class="text-sm text-slate-400 mb-4">Fast-paced 60-second speed run! Spot syntax anomalies before the memory overflow countdown hits 0.</p>
            <div class="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span>⚡ Reward: 40 XP</span>
              <span>🪙 +15 Coins</span>
            </div>
          </div>
          <button id="btn-start-bughunter" class="mt-6 arcade-btn arcade-btn-pink py-3 rounded-xl font-arcade text-xs tracking-wider">
            START BLITZ
          </button>
        </div>

        <!-- Mode 2: Daily Cyber Kata -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500 transition-all shadow-xl group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="zap" class="w-6 h-6"></i>
            </div>
            <h3 class="font-arcade text-base text-cyan-400 mb-2">DAILY CODE KATA</h3>
            <p class="text-sm text-slate-400 mb-4">Curated daily algorithmic puzzle to reinforce algorithmic memory and maintain your active streak.</p>
            <div class="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span>🔥 Streak Shield</span>
              <span>⚡ Reward: 50 XP</span>
            </div>
          </div>
          <button id="btn-start-kata" class="mt-6 arcade-btn arcade-btn-cyan py-3 rounded-xl font-arcade text-xs tracking-wider">
            ENTER KATA
          </button>
        </div>

        <!-- Mode 3: Terminal Speed Run -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500 transition-all shadow-xl group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="terminal" class="w-6 h-6"></i>
            </div>
            <h3 class="font-arcade text-base text-emerald-400 mb-2">TERMINAL SPEED RUN</h3>
            <p class="text-sm text-slate-400 mb-4">Complete 5 missing command-line arguments in rapid succession with zero typing errors.</p>
            <div class="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span>⚡ Reward: 45 XP</span>
              <span>🪙 +20 Coins</span>
            </div>
          </div>
          <button id="btn-start-terminalrun" class="mt-6 arcade-btn arcade-btn-green py-3 rounded-xl font-arcade text-xs tracking-wider">
            LAUNCH TERMINAL
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-start-bughunter').onclick = () => {
      this.startLesson(2); // Jump into Variable bug hunting
    };
    document.getElementById('btn-start-kata').onclick = () => {
      this.startLesson(3); // Jump into logic Kata
    };
    document.getElementById('btn-start-terminalrun').onclick = () => {
      this.startLesson(1); // Jump into Terminal Speed Run
    };

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Leaderboard View ---
  renderLeaderboard() {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;

    const user = window.appState.data.user;

    const dummyRivals = [
      { name: 'ZeroCool_99', title: 'Cyber Daemon', xp: 820, avatar: '💀', rank: 1 },
      { name: 'NeonViper', title: 'Kernel Slasher', xp: 740, avatar: '⚡', rank: 2 },
      { name: 'ByteMaster_X', title: 'System Arch', xp: 690, avatar: '🤖', rank: 3 },
      { name: user.name, title: user.title, xp: user.xp + 450, avatar: '👾', rank: 4, isUser: true },
      { name: 'CrashOverride', title: 'Script Kiddie', xp: 420, avatar: '🐱', rank: 5 },
      { name: 'AcidBurn', title: 'Packet Sniffer', xp: 380, avatar: '🦊', rank: 6 },
      { name: 'GlitchWeaver', title: 'Memory Leaker', xp: 310, avatar: '👻', rank: 7 },
      { name: 'CyberGhost', title: 'Firewall Scout', xp: 260, avatar: '🦇', rank: 8 }
    ];

    let html = '';
    dummyRivals.forEach(r => {
      let rankBadge = `<span class="font-arcade text-xs text-slate-500 w-6 text-center">#${r.rank}</span>`;
      if (r.rank === 1) rankBadge = `<span class="rank-badge-1 w-7 h-7 rounded-full flex items-center justify-center text-xs">1</span>`;
      else if (r.rank === 2) rankBadge = `<span class="rank-badge-2 w-7 h-7 rounded-full flex items-center justify-center text-xs">2</span>`;
      else if (r.rank === 3) rankBadge = `<span class="rank-badge-3 w-7 h-7 rounded-full flex items-center justify-center text-xs">3</span>`;

      html += `
        <div class="flex items-center justify-between p-3.5 rounded-xl border ${r.isUser ? 'border-purple-500 bg-purple-950/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/40'} transition-all">
          <div class="flex items-center gap-3.5">
            ${rankBadge}
            <div class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
              ${r.avatar}
            </div>
            <div>
              <div class="font-bold text-sm ${r.isUser ? 'text-purple-300 font-arcade text-xs' : 'text-slate-200'}">
                ${r.name} ${r.isUser ? '<span class="text-[10px] text-cyan-400 font-mono ml-1.5">(YOU)</span>' : ''}
              </div>
              <div class="text-xs text-slate-500 font-mono">${r.title}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-arcade text-xs text-amber-400">${r.xp}</span>
            <span class="text-xs text-slate-500 font-mono">XP</span>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  }

  // --- Cyber Shop View ---
  renderShop() {
    const container = document.getElementById('shop-items-container');
    if (!container) return;

    const user = window.appState.data.user;
    const inv = window.appState.data.inventory;

    const shopItems = [
      {
        id: 'energy_refill',
        title: 'Energy Overclock Cell',
        desc: 'Instantly restore battery cells back to maximum 5/5 capacity.',
        cost: 50,
        icon: 'battery-charging',
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20'
      },
      {
        id: 'streak_freeze',
        title: 'Streak Firewall (Freeze)',
        desc: 'Guarantees your daily streak remains uncompromised if you miss a day.',
        cost: 100,
        icon: 'shield',
        color: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
        owned: inv.streakFreeze
      },
      {
        id: 'double_xp',
        title: 'Quantum Overdrive (2x XP)',
        desc: 'Double XP rewards granted for your next 3 completed coding nodes.',
        cost: 150,
        icon: 'zap',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        active: inv.doubleXpActive
      },
      {
        id: 'skin_matrix-gold',
        title: 'Matrix Gold Pixel-Bit Skin',
        desc: 'Equip Pixel-Bit with an exclusive 24k gold cyber chassis and reactor.',
        cost: 250,
        icon: 'sparkles',
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
        owned: inv.skins.includes('matrix-gold')
      }
    ];

    let html = '';
    shopItems.forEach(item => {
      const canAfford = user.coins >= item.cost;
      let btnLabel = `BUY FOR ${item.cost} 🪙`;
      let btnClass = canAfford ? 'arcade-btn arcade-btn-green' : 'bg-slate-800 text-slate-500 cursor-not-allowed';
      let disabled = !canAfford;

      if (item.owned && item.id.startsWith('skin_')) {
        const isEquipped = inv.activeSkin === 'matrix-gold';
        btnLabel = isEquipped ? 'EQUIPPED ✓' : 'EQUIP SKIN';
        btnClass = isEquipped ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300' : 'arcade-btn arcade-btn-purple';
        disabled = isEquipped;
      }

      html += `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div class="w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${item.color}">
              <i data-lucide="${item.icon}" class="w-6 h-6"></i>
            </div>
            <h4 class="font-arcade text-xs text-slate-100 mb-1.5">${item.title}</h4>
            <p class="text-xs text-slate-400 mb-4">${item.desc}</p>
            ${item.owned ? `<div class="text-[11px] font-mono text-cyan-400 mb-2">INVENTORY: ${item.owned} OWNED</div>` : ''}
          </div>
          <button 
            class="${btnClass} py-3 px-4 rounded-xl font-arcade text-[10px] tracking-wider font-bold w-full"
            data-shop-id="${item.id}"
            data-shop-cost="${item.cost}"
            ${disabled ? 'disabled' : ''}
          >
            ${btnLabel}
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Purchase handlers
    container.querySelectorAll('[data-shop-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-shop-id');
        const cost = parseInt(e.currentTarget.getAttribute('data-shop-cost'));

        if (id.startsWith('skin_') && inv.skins.includes('matrix-gold')) {
          inv.activeSkin = 'matrix-gold';
          window.appState.save();
          window.sound.playSelect();
          this.renderShop();
          this.showToast('Gold skin equipped to Pixel-Bit!', 'success');
          return;
        }

        const success = window.appState.buyItem(id, cost);
        if (success) {
          window.sound.playCoin();
          this.showToast('Item purchased and loaded into your cyber deck!', 'success');
          this.renderShop();
        } else {
          window.sound.playIncorrect();
          this.showToast('Insufficient Byte Coins!', 'error');
        }
      });
    });
  }

  // --- Profile View ---
  renderProfile() {
    const user = window.appState.data.user;
    const stats = window.appState.data.stats;

    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-level-badge').textContent = `LVL ${user.level} ${user.title}`;
    document.getElementById('profile-stat-solved').textContent = stats.totalSolved;
    document.getElementById('profile-stat-streak').textContent = `${user.streak} Days`;
    document.getElementById('profile-stat-coins').textContent = user.coins;
    document.getElementById('profile-stat-perfect').textContent = stats.perfectLessons;

    // Render 30-day activity heatmap
    const heatmap = document.getElementById('profile-activity-heatmap');
    if (heatmap) {
      let cells = '';
      for (let i = 0; i < 35; i++) {
        const active = i > 28 || (i % 3 === 0);
        const intensity = active ? (i % 2 === 0 ? 'bg-emerald-500' : 'bg-emerald-400/80') : 'bg-slate-800';
        cells += `<div class="w-3.5 h-3.5 rounded-sm ${intensity} transition-all hover:scale-125" title="Day ${i + 1}: ${active ? 'Lessons Completed' : 'Idle'}"></div>`;
      }
      heatmap.innerHTML = cells;
    }

    // Reset Progress Button
    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Are you sure you want to reset all game progress?')) {
          window.appState.resetAll();
          this.showToast('Mainframe memory cleared to factory state.', 'info');
          this.switchView('learn');
        }
      };
    }
  }

  // --- Toast Notification ---
  showToast(msg, type = 'info') {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl font-mono text-xs shadow-2xl transition-all duration-300 max-w-sm pointer-events-none ';

    if (type === 'error') {
      toast.className += 'bg-red-950/90 border border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
    } else if (type === 'success') {
      toast.className += 'bg-emerald-950/90 border border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    } else {
      toast.className += 'bg-slate-900/90 border border-cyan-500 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)]';
    }

    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 3200);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate App once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.app = new CodeDuoApp();
});
