/**
 * CalmCompose - Study Planner & Pomodoro Timer Component
 */

const PlannerComponent = {
  countdownInterval: null,
  pomodoroInterval: null,
  pomodoroTimeRemaining: 25 * 60, // in seconds
  pomodoroDuration: 25 * 60,
  pomodoroState: 'idle', // idle, running, paused
  pomodoroMode: 'study', // study, shortBreak, longBreak
  
  init: function() {
    this.stopCountdown();
    this.stopPomodoro();
  },

  render: function() {
    const container = document.getElementById('page-planner');
    if (!container) return;

    const settings = CalmDataService.getSettings();

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Time & Focus Management</span>
        <h1 class="page-title">Study Planner & Focus</h1>
        <p class="page-subtitle">Combating study burnout with a custom Pomodoro tracker, exam countdown, and fatigue-aware scheduling advice.</p>
      </div>

      <div class="planner-layout">
        
        <!-- Column 1: Pomodoro Focus Timer -->
        <div class="glass-card pomodoro-box">
          <h3>Pomodoro Focus Timer</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 20px;">Train your attention span and prevent mental exhaustion.</p>
          
          <div class="pomodoro-modes">
            <button class="pomodoro-mode-btn active" data-pmode="study">Study (25m)</button>
            <button class="pomodoro-mode-btn" data-pmode="shortBreak">Short Break (5m)</button>
            <button class="pomodoro-mode-btn" data-pmode="longBreak">Long Break (15m)</button>
          </div>

          <div class="pomodoro-timer-svg">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle class="pomodoro-ring-bg" cx="100" cy="100" r="90" />
              <circle class="pomodoro-ring-progress" id="p-progress" cx="100" cy="100" r="90" 
                stroke-dasharray="565.48" stroke-dashoffset="0" />
            </svg>
            <div class="pomodoro-time-display" id="p-timer-display">25:00</div>
          </div>

          <div style="display: flex; gap: 12px; width: 100%; max-width: 240px; margin-top: 10px;">
            <button class="btn btn-primary" id="btn-p-start" style="flex: 2;">Start</button>
            <button class="btn btn-outline" id="btn-p-reset" style="flex: 1;">Reset</button>
          </div>
        </div>

        <!-- Column 2: Countdown & Fatigue Planner -->
        <div class="companion-info-column">
          <!-- Countdown Widget -->
          <div class="glass-card countdown-box">
            <h3 id="lbl-countdown-title">${settings.examTarget} Countdown</h3>
            <p class="text-muted" style="font-size: 0.8rem;">Days left until your academic milestone.</p>
            
            <div class="countdown-timer-widget">
              <div class="countdown-unit">
                <span class="countdown-val" id="cnt-days">00</span>
                <span class="countdown-lbl">Days</span>
              </div>
              <div class="countdown-unit">
                <span class="countdown-val" id="cnt-hours">00</span>
                <span class="countdown-lbl">Hours</span>
              </div>
              <div class="countdown-unit">
                <span class="countdown-val" id="cnt-mins">00</span>
                <span class="countdown-lbl">Mins</span>
              </div>
              <div class="countdown-unit">
                <span class="countdown-val" id="cnt-secs">00</span>
                <span class="countdown-lbl">Secs</span>
              </div>
            </div>
          </div>

          <!-- Fatigue-Aware Schedule Advice -->
          <div class="glass-card study-schedule-planner">
            <h3>Fatigue-Aware study advisor</h3>
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 8px;">Dynamically calculated based on your latest self-reported stress and energy logs.</p>
            
            <div class="planner-advice-panel" id="planner-advisor-box">
              <!-- Rendered Dynamically -->
            </div>
            
            <!-- Quick Schedule tips -->
            <div style="font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 4px;">
              <strong>Recommended blocks for today:</strong>
              <div style="display:flex; justify-content:space-between; margin-top:8px; color: var(--text-secondary);">
                <span>09:00 - 11:30 : Hard Subject</span>
                <span>15:00 - 17:00 : Revision</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    lucide.createIcons();
    this.startCountdown(settings.examDate);
    this.calculateStudyAdvice();
    this.bindEvents();
    this.updatePomodoroDisplay();
  },

  bindEvents: function() {
    const self = this;

    // 1. Pomodoro Modes
    const modeBtns = document.querySelectorAll('[data-pmode]');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        modeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        self.setPomodoroMode(this.getAttribute('data-pmode'));
      });
    });

    // Start / Pause button
    const startBtn = document.getElementById('btn-p-start');
    const resetBtn = document.getElementById('btn-p-reset');

    startBtn.addEventListener('click', () => {
      if (self.pomodoroState === 'running') {
        self.pausePomodoro();
        startBtn.textContent = 'Resume';
        startBtn.className = 'btn btn-primary';
      } else {
        self.startPomodoro();
        startBtn.textContent = 'Pause';
        startBtn.className = 'btn btn-outline';
      }
    });

    resetBtn.addEventListener('click', () => {
      self.resetPomodoro();
      startBtn.textContent = 'Start';
      startBtn.className = 'btn btn-primary';
    });
  },

  // ==========================================================================
  // Exam Countdown Engine
  // ==========================================================================
  startCountdown: function(examDateStr) {
    this.stopCountdown();
    if (!examDateStr) return;

    const targetDate = new Date(examDateStr).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const dVal = document.getElementById('cnt-days');
      const hVal = document.getElementById('cnt-hours');
      const mVal = document.getElementById('cnt-mins');
      const sVal = document.getElementById('cnt-secs');

      if (!dVal) return; // safety check

      if (difference < 0) {
        dVal.textContent = "00";
        hVal.textContent = "00";
        mVal.textContent = "00";
        sVal.textContent = "00";
        this.stopCountdown();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      dVal.textContent = String(days).padStart(2, '0');
      hVal.textContent = String(hours).padStart(2, '0');
      mVal.textContent = String(minutes).padStart(2, '0');
      sVal.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  },

  stopCountdown: function() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  },

  // ==========================================================================
  // Pomodoro Focus Timer Engine
  // ==========================================================================
  setPomodoroMode: function(mode) {
    this.stopPomodoro();
    this.pomodoroMode = mode;
    this.pomodoroState = 'idle';

    const startBtn = document.getElementById('btn-p-start');
    if (startBtn) {
      startBtn.textContent = 'Start';
      startBtn.className = 'btn btn-primary';
    }

    if (mode === 'study') {
      this.pomodoroDuration = 25 * 60;
    } else if (mode === 'shortBreak') {
      this.pomodoroDuration = 5 * 60;
    } else if (mode === 'longBreak') {
      this.pomodoroDuration = 15 * 60;
    }

    this.pomodoroTimeRemaining = this.pomodoroDuration;
    this.updatePomodoroDisplay();
  },

  startPomodoro: function() {
    if (this.pomodoroState === 'running') return;

    this.pomodoroState = 'running';
    
    this.pomodoroInterval = setInterval(() => {
      this.pomodoroTimeRemaining--;
      this.updatePomodoroDisplay();

      if (this.pomodoroTimeRemaining <= 0) {
        this.triggerAlarm();
        this.stopPomodoro();
        
        const startBtn = document.getElementById('btn-p-start');
        if (startBtn) {
          startBtn.textContent = 'Start';
          startBtn.className = 'btn btn-primary';
        }

        if (this.pomodoroMode === 'study') {
          showNotification("Pomodoro study block complete! Take a break.", "success");
          this.setPomodoroMode('shortBreak');
          // Select shortBreak button visually
          const btns = document.querySelectorAll('[data-pmode]');
          btns.forEach(b => {
            b.classList.remove('active');
            if (b.getAttribute('data-pmode') === 'shortBreak') b.classList.add('active');
          });
        } else {
          showNotification("Break time complete! Back to study.", "success");
          this.setPomodoroMode('study');
          // Select study button visually
          const btns = document.querySelectorAll('[data-pmode]');
          btns.forEach(b => {
            b.classList.remove('active');
            if (b.getAttribute('data-pmode') === 'study') b.classList.add('active');
          });
        }
      }
    }, 1000);
  },

  pausePomodoro: function() {
    this.pomodoroState = 'paused';
    if (this.pomodoroInterval) {
      clearInterval(this.pomodoroInterval);
      this.pomodoroInterval = null;
    }
  },

  stopPomodoro: function() {
    this.pausePomodoro();
    this.pomodoroState = 'idle';
  },

  resetPomodoro: function() {
    this.stopPomodoro();
    this.pomodoroTimeRemaining = this.pomodoroDuration;
    this.updatePomodoroDisplay();
  },

  updatePomodoroDisplay: function() {
    const timerDisplay = document.getElementById('p-timer-display');
    const ringProgress = document.getElementById('p-progress');
    if (!timerDisplay) return;

    const minutes = Math.floor(this.pomodoroTimeRemaining / 60);
    const seconds = this.pomodoroTimeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update circular ring (stroke-dasharray="565.48")
    const percent = this.pomodoroTimeRemaining / this.pomodoroDuration;
    const offset = 565.48 * (1 - percent);
    ringProgress.setAttribute('stroke-dashoffset', offset);
  },

  triggerAlarm: function() {
    // Synthesize beep locally via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Beep 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(660, audioCtx.currentTime); // Mi note
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.15);

      // Beep 2
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // La note
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.35);
      }, 200);

    } catch (e) {
      console.warn("Could not play alarm sound:", e);
    }
  },

  // ==========================================================================
  // Fatigue-Aware Advisor Calculation
  // ==========================================================================
  calculateStudyAdvice: function() {
    const box = document.getElementById('planner-advisor-box');
    if (!box) return;

    const entries = CalmDataService.getEntries();
    if (entries.length === 0) {
      box.innerHTML = `
        <i data-lucide="info" class="text-teal" style="width: 24px; height: 24px; flex-shrink: 0;"></i>
        <div>
          <strong style="display:block; margin-bottom:2px; font-size:0.9rem;">Ready for Advice</strong>
          <span style="font-size:0.8rem; color:var(--text-secondary);">Submit journal logs to assess your current stress levels and receive fatigue-aware study schedule advice.</span>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Process last 3 entries
    const last3 = entries.slice(-3);
    const avgStress = last3.reduce((sum, e) => sum + e.stressLevel, 0) / last3.length;
    const avgEnergy = last3.reduce((sum, e) => sum + e.energyLevel, 0) / last3.length;

    let adviceTitle = "Peak Focus State";
    let adviceText = "Your stress is low, and your energy is excellent. This is the optimal window to tackle complex subjects (like Physics numericals, Organic Chemistry mechanisms) or sit for a mock test.";
    let adviceColor = "var(--teal)";
    let panelBg = "rgba(6, 182, 212, 0.05)";
    let iconName = "zap";

    if (avgStress >= 4) {
      if (avgEnergy <= 2.2) {
        adviceTitle = "Severe Burnout Risk";
        adviceText = "Critical stress levels coupled with low energy. Cancel any marathon study sessions. Switch to 20-minute study blocks separated by 10-minute non-screen rests. Avoid starting new topics today.";
        adviceColor = "var(--rose)";
        panelBg = "rgba(244, 63, 94, 0.05)";
        iconName = "shield-alert";
      } else {
        adviceTitle = "High Anxiety & Restlessness";
        adviceText = "High energy but elevated anxiety indicates cognitive overload. Shift from cramming to revision. Solve structured mock test errors instead of broad reading. Do box breathing before study blocks.";
        adviceColor = "var(--purple)";
        panelBg = "rgba(168, 85, 247, 0.05)";
        iconName = "alert-circle";
      }
    } else if (avgEnergy <= 2.5) {
      adviceTitle = "Low Fatigue Threshold";
      adviceText = "You are physically drained. Your brain will struggle to retain complex variables. Limit studies to passive revision (flashcards or video lectures) and enforce a solid sleep cutoff tonight.";
      adviceColor = "var(--yellow)";
      panelBg = "rgba(234, 179, 8, 0.05)";
      iconName = "battery-low";
    }

    box.style.background = panelBg;
    box.style.borderColor = adviceColor;
    
    box.innerHTML = `
      <i data-lucide="${iconName}" style="color: ${adviceColor}; width: 24px; height: 24px; flex-shrink: 0; margin-top: 2px;"></i>
      <div>
        <strong style="display:block; margin-bottom:2px; font-size:0.9rem; color: ${adviceColor};">${adviceTitle}</strong>
        <span style="font-size:0.8rem; color:var(--text-secondary); line-height: 1.4; display:block;">${adviceText}</span>
      </div>
    `;

    lucide.createIcons();
  }
};
