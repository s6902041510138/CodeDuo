/**
 * CodeDuo - Central State Management & LocalStorage Persistence
 */

const STORAGE_KEY = 'codeduo_user_state_v1';

const DEFAULT_STATE = {
  user: {
    name: 'NeoCoder_01',
    title: 'Cyber Novice',
    avatar: 'cyber-bot',
    level: 1,
    xp: 65,
    xpToNext: 150,
    streak: 5,
    streakFrozen: false,
    coins: 240,
    energy: 5,
    maxEnergy: 5,
    lastEnergyRegen: Date.now(),
    language: 'javascript' // 'javascript' | 'python'
  },
  stages: [
    {
      id: 1,
      title: 'Stage 1: Hello World',
      subtitle: 'Terminal & Syntax Intro',
      description: 'Decompile mainframe greetings and execute your very first program output.',
      type: 'normal',
      status: 'unlocked', // 'locked' | 'unlocked' | 'completed'
      stars: 0,
      xpReward: 35,
      coinReward: 15,
      offset: 'node-pos-center'
    },
    {
      id: 2,
      title: 'Stage 2: Variables & Types',
      subtitle: 'Data Containers & Memory',
      description: 'Allocate cyber memory buffers with let, const, strings, and integer registers.',
      type: 'normal',
      status: 'locked',
      stars: 0,
      xpReward: 45,
      coinReward: 20,
      offset: 'node-pos-left-1'
    },
    {
      id: 3,
      title: 'Stage 3: IF/ELSE Logic',
      subtitle: 'Conditionals & Gateways',
      description: 'Harness boolean firewall gates and logical operators to direct program flow.',
      type: 'normal',
      status: 'locked',
      stars: 0,
      xpReward: 50,
      coinReward: 25,
      offset: 'node-pos-right-1'
    },
    {
      id: 4,
      title: 'Stage 4: Loop Boss Battle',
      subtitle: 'The Glitch King Raid',
      description: 'CRITICAL THREAT! Defeat the infinite loop daemon by iterating through malware arrays.',
      type: 'boss',
      status: 'locked',
      stars: 0,
      xpReward: 100,
      coinReward: 50,
      offset: 'node-pos-center'
    },
    {
      id: 5,
      title: 'Stage 5: Functions & Callbacks',
      subtitle: 'Subroutine Protocol',
      description: 'Construct reusable algorithms and pass callback payloads across cyber channels.',
      type: 'normal',
      status: 'locked',
      stars: 0,
      xpReward: 60,
      coinReward: 30,
      offset: 'node-pos-left-2'
    },
    {
      id: 6,
      title: 'Stage 6: Cyber Arrays',
      subtitle: 'Memory Matrix Indexing',
      description: 'Master stack push/pop, mapping, and filtering memory arrays like a senior engineer.',
      type: 'normal',
      status: 'locked',
      stars: 0,
      xpReward: 70,
      coinReward: 35,
      offset: 'node-pos-right-2'
    }
  ],
  dailyQuests: [
    {
      id: 'q1',
      title: 'Cyber Node Breach',
      desc: 'Complete any 2 coding nodes',
      progress: 0,
      target: 2,
      reward: 30,
      completed: false
    },
    {
      id: 'q2',
      title: 'XP Overclock',
      desc: 'Earn 60 XP across lessons',
      progress: 0,
      target: 60,
      reward: 25,
      completed: false
    },
    {
      id: 'q3',
      title: 'Zero Warning Compilation',
      desc: 'Achieve 100% accuracy in a stage',
      progress: 0,
      target: 1,
      reward: 40,
      completed: false
    }
  ],
  inventory: {
    streakFreeze: 1,
    doubleXpActive: false,
    skins: ['cyber-bot'],
    activeSkin: 'cyber-bot'
  },
  stats: {
    totalSolved: 14,
    perfectLessons: 3,
    highestStreak: 7,
    bossDefeated: 0
  }
};

class StateManager {
  constructor() {
    this.data = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure matches defaults
        return {
          ...DEFAULT_STATE,
          ...parsed,
          user: { ...DEFAULT_STATE.user, ...parsed.user },
          inventory: { ...DEFAULT_STATE.inventory, ...parsed.inventory },
          stats: { ...DEFAULT_STATE.stats, ...parsed.stats }
        };
      }
    } catch (e) {
      console.warn('Could not load state, using defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  resetAll() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.data));
  }

  // --- Actions ---

  addXP(amount) {
    if (this.data.inventory.doubleXpActive) {
      amount *= 2;
    }
    this.data.user.xp += amount;
    this.checkDailyQuest('xp', amount);

    let leveledUp = false;
    while (this.data.user.xp >= this.data.user.xpToNext) {
      this.data.user.xp -= this.data.user.xpToNext;
      this.data.user.level += 1;
      this.data.user.xpToNext = Math.floor(this.data.user.xpToNext * 1.4);
      leveledUp = true;
    }

    this.save();
    return { leveledUp, newLevel: this.data.user.level, xpGained: amount };
  }

  addCoins(amount) {
    this.data.user.coins += amount;
    this.save();
  }

  spendCoins(amount) {
    if (this.data.user.coins >= amount) {
      this.data.user.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  loseEnergy() {
    if (this.data.user.energy > 0) {
      this.data.user.energy -= 1;
      this.save();
    }
    return this.data.user.energy;
  }

  refillEnergy() {
    this.data.user.energy = this.data.user.maxEnergy;
    this.save();
  }

  incrementStreak() {
    this.data.user.streak += 1;
    if (this.data.user.streak > this.data.stats.highestStreak) {
      this.data.stats.highestStreak = this.data.user.streak;
    }
    this.save();
  }

  completeStage(stageId, stars, accuracy) {
    const stage = this.data.stages.find(s => s.id === stageId);
    if (!stage) return;

    stage.status = 'completed';
    stage.stars = Math.max(stage.stars, stars);

    // Unlock next stage
    const nextStage = this.data.stages.find(s => s.id === stageId + 1);
    if (nextStage && nextStage.status === 'locked') {
      nextStage.status = 'unlocked';
    }

    this.data.stats.totalSolved += 1;
    if (stage.type === 'boss') {
      this.data.stats.bossDefeated += 1;
    }
    if (accuracy >= 100) {
      this.data.stats.perfectLessons += 1;
      this.checkDailyQuest('accuracy', 1);
    }

    this.checkDailyQuest('stage', 1);
    this.save();
  }

  checkDailyQuest(type, val) {
    this.data.dailyQuests.forEach(q => {
      if (q.completed) return;

      if (type === 'stage' && q.id === 'q1') {
        q.progress = Math.min(q.target, q.progress + val);
      } else if (type === 'xp' && q.id === 'q2') {
        q.progress = Math.min(q.target, q.progress + val);
      } else if (type === 'accuracy' && q.id === 'q3') {
        q.progress = Math.min(q.target, q.progress + val);
      }

      if (q.progress >= q.target && !q.completed) {
        q.completed = true;
        this.addCoins(q.reward);
        if (window.sound) window.sound.playCoin();
      }
    });
  }

  setLanguage(lang) {
    this.data.user.language = lang;
    this.save();
  }

  buyItem(itemId, cost) {
    if (this.spendCoins(cost)) {
      if (itemId === 'streak_freeze') {
        this.data.inventory.streakFreeze += 1;
      } else if (itemId === 'energy_refill') {
        this.refillEnergy();
      } else if (itemId === 'double_xp') {
        this.data.inventory.doubleXpActive = true;
      } else if (itemId.startsWith('skin_')) {
        const skinName = itemId.replace('skin_', '');
        if (!this.data.inventory.skins.includes(skinName)) {
          this.data.inventory.skins.push(skinName);
        }
        this.data.inventory.activeSkin = skinName;
        this.data.user.avatar = skinName;
      }
      this.save();
      return true;
    }
    return false;
  }
}

window.appState = new StateManager();
