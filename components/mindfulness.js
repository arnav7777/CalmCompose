/**
 * CalmCompose - Mindfulness Component
 * Integrates breathing visualizer, Web Audio synthesized rain/white noise, and 5-4-3-2-1 grounding.
 */

const MindfulnessComponent = {
  breathingInterval: null,
  breathingTimeRemaining: 0,
  breathingState: 'idle', // idle, inhale, hold_full, exhale, hold_empty
  audioContext: null,
  audioNodes: {
    rain: null,
    whiteNoise: null,
    forest: null,
    lofi: null
  },
  soundActive: {
    rain: false,
    whiteNoise: false,
    forest: false,
    lofi: false
  },

  // Breathing Configurations: [inhale, hold_full, exhale, hold_empty] in seconds
  breathingModes: {
    box: { name: 'Box Breathing (4-4-4-4)', cycle: [4, 4, 4, 4], desc: 'Best for resetting high anxiety and restoring focus.' },
    calm: { name: 'Deep Calm (4-7-8)', cycle: [4, 7, 8, 0], desc: 'Soothes the nervous system and aids sleep.' },
    equal: { name: 'Equal Pace (4-4)', cycle: [4, 0, 4, 0], desc: 'Simple, steady rhythm for basic breathing focus.' }
  },
  currentMode: 'box',

  init: function() {
    this.stopBreathing();
    // Do not initialize audio context until user interaction (browser security policy)
  },

  render: function() {
    const container = document.getElementById('page-mindfulness');
    if (!container) return;

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Mindfulness Sanctuary</span>
        <h1 class="page-title">Calm Space</h1>
        <p class="page-subtitle">Interactive visual breathing, grounding exercises, and synthesized ambient soundscapes.</p>
      </div>

      <div class="mindfulness-layout">
        <!-- Column 1: Breathing Visualizer -->
        <div class="glass-card breathing-box">
          <h3>Guided Breathing Guide</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 24px; text-align: center;" id="breath-mode-desc">
            Box Breathing: Best for resetting high anxiety and restoring focus.
          </p>

          <div class="breathing-circle-outer">
            <div class="breathing-circle-glow" id="breath-glow"></div>
            <div class="breathing-circle-inner" id="breath-circle">READY</div>
          </div>

          <div class="breathing-instruction text-teal" id="breath-instruction">Tap Start to begin</div>
          
          <div class="pomodoro-modes" style="margin-top: 24px;">
            <button class="pomodoro-mode-btn active" data-bmode="box">Box (4-4-4-4)</button>
            <button class="pomodoro-mode-btn" data-bmode="calm">Calm (4-7-8)</button>
            <button class="pomodoro-mode-btn" data-bmode="equal">Equal (4-4)</button>
          </div>

          <div style="margin-top: 20px; display: flex; gap: 12px; width: 100%; max-width: 280px;">
            <button class="btn btn-primary" id="btn-breath-start" style="flex: 1;">Start</button>
            <button class="btn btn-outline" id="btn-breath-stop" style="flex: 1;" disabled>Stop</button>
          </div>
        </div>

        <!-- Column 2: Grounding and Sounds -->
        <div class="companion-info-column">
          <!-- Ambient Sound Mixer -->
          <div class="glass-card sound-mixer">
            <h3>Focus Sound Mixer</h3>
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 8px;">Create your ideal sonic bubble. Synthesized locally via Web Audio API.</p>
            
            <!-- Rain Sound -->
            <div class="sound-row">
              <button class="sound-toggle-btn" id="btn-sound-rain" data-sound="rain">
                <i data-lucide="cloud-rain"></i>
              </button>
              <div class="sound-slider-wrapper">
                <span class="sound-label-narrow">Rain</span>
                <input type="range" class="vol-slider" id="vol-rain" min="0" max="1" value="0" step="0.05">
              </div>
            </div>

            <!-- White Noise -->
            <div class="sound-row">
              <button class="sound-toggle-btn" id="btn-sound-noise" data-sound="whiteNoise">
                <i data-lucide="radio"></i>
              </button>
              <div class="sound-slider-wrapper">
                <span class="sound-label-narrow">White Noise</span>
                <input type="range" class="vol-slider" id="vol-whiteNoise" min="0" max="1" value="0" step="0.05">
              </div>
            </div>

            <!-- Forest Sound (Streaming Loop) -->
            <div class="sound-row">
              <button class="sound-toggle-btn" id="btn-sound-forest" data-sound="forest">
                <i data-lucide="trees"></i>
              </button>
              <div class="sound-slider-wrapper">
                <span class="sound-label-narrow">Forest</span>
                <input type="range" class="vol-slider" id="vol-forest" min="0" max="1" value="0" step="0.05">
              </div>
            </div>

            <!-- Lo-Fi Beats (Streaming Station) -->
            <div class="sound-row">
              <button class="sound-toggle-btn" id="btn-sound-lofi" data-sound="lofi">
                <i data-lucide="music-4"></i>
              </button>
              <div class="sound-slider-wrapper">
                <span class="sound-label-narrow">Lo-Fi beats</span>
                <input type="range" class="vol-slider" id="vol-lofi" min="0" max="1" value="0" step="0.05">
              </div>
            </div>
          </div>

          <!-- Grounding Stepper -->
          <div class="glass-card">
            <h3>5-4-3-2-1 Grounding Helper</h3>
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 12px;">Use your senses to pull your mind back from anxiety loops to the present moment.</p>
            
            <div class="grounding-box" id="grounding-container">
              <div class="grounding-step active" data-step="5">
                <div class="grounding-num">5</div>
                <div class="grounding-details">
                  <div class="grounding-step-title text-teal">Things you see</div>
                  <div class="grounding-step-desc">Look around and notice 5 visual objects in your room (e.g. a book, a pen, a clock).</div>
                </div>
              </div>

              <div class="grounding-step" data-step="4">
                <div class="grounding-num">4</div>
                <div class="grounding-details">
                  <div class="grounding-step-title text-purple">Things you feel</div>
                  <div class="grounding-step-desc">Acknowledge 4 physical sensations (e.g. your feet on the floor, the texture of your desk).</div>
                </div>
              </div>

              <div class="grounding-step" data-step="3">
                <div class="grounding-num">3</div>
                <div class="grounding-details">
                  <div class="grounding-step-title text-yellow">Things you hear</div>
                  <div class="grounding-step-desc">Listen for 3 distinct sounds in your environment (e.g. birds chirping, fan hum, distant cars).</div>
                </div>
              </div>

              <div class="grounding-step" data-step="2">
                <div class="grounding-num">2</div>
                <div class="grounding-details">
                  <div class="grounding-step-title text-rose">Things you smell</div>
                  <div class="grounding-step-desc">Identify 2 scents around you (e.g. coffee aroma, wood, fresh pages of a book).</div>
                </div>
              </div>

              <div class="grounding-step" data-step="1">
                <div class="grounding-num">1</div>
                <div class="grounding-details">
                  <div class="grounding-step-title text-emerald">Thing you taste</div>
                  <div class="grounding-step-desc">Focus on 1 taste in your mouth (e.g. residual mint, tea, or just fresh water).</div>
                </div>
              </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-top:16px;">
              <button class="btn btn-outline btn-sm" id="btn-ground-prev" disabled>Previous</button>
              <button class="btn btn-purple btn-sm" id="btn-ground-next">Next step</button>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.bindEvents();
    this.restoreVolumes();
  },

  restoreVolumes: function() {
    const settings = CalmDataService.getSettings();
    if (settings.soundMixerVolumes) {
      Object.keys(settings.soundMixerVolumes).forEach(key => {
        const slider = document.getElementById(`vol-${key}`);
        if (slider) {
          slider.value = settings.soundMixerVolumes[key];
        }
      });
    }
  },

  saveVolumes: function() {
    const settings = CalmDataService.getSettings();
    settings.soundMixerVolumes = {
      rain: parseFloat(document.getElementById('vol-rain').value),
      whiteNoise: parseFloat(document.getElementById('vol-whiteNoise').value),
      forest: parseFloat(document.getElementById('vol-forest').value),
      lofi: parseFloat(document.getElementById('vol-lofi').value)
    };
    CalmDataService.saveSettings(settings);
  },

  bindEvents: function() {
    const self = this;

    // 1. Breathing Modes Selection
    const modeBtns = document.querySelectorAll('[data-bmode]');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        modeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        self.currentMode = this.getAttribute('data-bmode');
        document.getElementById('breath-mode-desc').textContent = self.breathingModes[self.currentMode].desc;
        self.stopBreathing();
      });
    });

    // Breathing Start / Stop
    const startBtn = document.getElementById('btn-breath-start');
    const stopBtn = document.getElementById('btn-breath-stop');

    startBtn.addEventListener('click', () => {
      this.startBreathing();
      startBtn.disabled = true;
      stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', () => {
      this.stopBreathing();
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });

    // 2. Sound Mixer Interaction
    const soundToggleBtns = document.querySelectorAll('.sound-toggle-btn');
    soundToggleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const type = this.getAttribute('data-sound');
        self.toggleSound(type);
      });
    });

    // Volume Sliders
    const volSliders = document.querySelectorAll('.vol-slider');
    volSliders.forEach(slider => {
      slider.addEventListener('input', function() {
        const type = this.id.replace('vol-', '');
        self.setVolume(type, parseFloat(this.value));
        self.saveVolumes();
      });
    });

    // 3. Grounding Stepper Logic
    let currentGroundingStep = 5;
    const groundingSteps = document.querySelectorAll('.grounding-step');
    const prevBtn = document.getElementById('btn-ground-prev');
    const nextBtn = document.getElementById('btn-ground-next');

    const updateGroundingUI = () => {
      groundingSteps.forEach(s => {
        const stepNum = parseInt(s.getAttribute('data-step'));
        s.classList.remove('active');
        if (stepNum === currentGroundingStep) {
          s.classList.add('active');
        }
      });

      prevBtn.disabled = currentGroundingStep === 5;
      if (currentGroundingStep === 1) {
        nextBtn.textContent = 'Finish & Reset';
      } else {
        nextBtn.textContent = 'Next step';
      }
    };

    nextBtn.addEventListener('click', () => {
      if (currentGroundingStep > 1) {
        currentGroundingStep--;
      } else {
        // Reset
        currentGroundingStep = 5;
        showNotification("Grounding session complete. Well done!", "success");
      }
      updateGroundingUI();
    });

    prevBtn.addEventListener('click', () => {
      if (currentGroundingStep < 5) {
        currentGroundingStep++;
        updateGroundingUI();
      }
    });
  },

  // ==========================================================================
  // Breathing Visualizer Engine
  // ==========================================================================
  startBreathing: function() {
    this.stopBreathing();
    const config = this.breathingModes[this.currentMode];
    const cycle = config.cycle; // [inhale, hold_full, exhale, hold_empty]

    const circle = document.getElementById('breath-circle');
    const glow = document.getElementById('breath-glow');
    const instruction = document.getElementById('breath-instruction');

    this.breathingState = 'inhale';
    let cycleIndex = 0; // 0=inhale, 1=hold_full, 2=exhale, 3=hold_empty
    this.breathingTimeRemaining = cycle[0];

    const runBreathStep = () => {
      // Manage animations classes
      circle.className = 'breathing-circle-inner';
      glow.className = 'breathing-circle-glow';

      if (this.breathingState === 'inhale') {
        circle.classList.add('inhale-anim');
        glow.style.transform = 'scale(1.6)';
        glow.style.borderColor = 'var(--teal)';
        glow.style.transition = `transform ${cycle[0]}s ease-in-out`;
        instruction.textContent = `Breathe In... (${this.breathingTimeRemaining}s)`;
        instruction.className = 'breathing-instruction text-teal';
        circle.textContent = this.breathingTimeRemaining;
      } else if (this.breathingState === 'hold_full') {
        circle.style.transform = 'scale(1.6)';
        glow.style.transform = 'scale(1.6)';
        instruction.textContent = `Hold Breath... (${this.breathingTimeRemaining}s)`;
        instruction.className = 'breathing-instruction text-purple';
        circle.textContent = this.breathingTimeRemaining;
      } else if (this.breathingState === 'exhale') {
        circle.classList.add('exhale-anim');
        glow.style.transform = 'scale(1)';
        glow.style.borderColor = 'var(--purple)';
        glow.style.transition = `transform ${cycle[2]}s ease-in-out`;
        instruction.textContent = `Breathe Out... (${this.breathingTimeRemaining}s)`;
        instruction.className = 'breathing-instruction text-rose';
        circle.textContent = this.breathingTimeRemaining;
      } else if (this.breathingState === 'hold_empty') {
        circle.style.transform = 'scale(1)';
        glow.style.transform = 'scale(1)';
        instruction.textContent = `Hold Empty... (${this.breathingTimeRemaining}s)`;
        instruction.className = 'breathing-instruction text-yellow';
        circle.textContent = this.breathingTimeRemaining;
      }

      this.breathingTimeRemaining--;

      if (this.breathingTimeRemaining < 0) {
        // Move to next stage in cycle, skipping zeroes
        do {
          cycleIndex = (cycleIndex + 1) % 4;
          this.breathingTimeRemaining = cycle[cycleIndex];
        } while (this.breathingTimeRemaining === 0);

        // Map cycle index to states
        const states = ['inhale', 'hold_full', 'exhale', 'hold_empty'];
        this.breathingState = states[cycleIndex];
      }
    };

    // Run first step
    runBreathStep();
    
    // Set Interval
    this.breathingInterval = setInterval(runBreathStep, 1000);
  },

  stopBreathing: function() {
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
      this.breathingInterval = null;
    }
    
    this.breathingState = 'idle';
    
    const circle = document.getElementById('breath-circle');
    const glow = document.getElementById('breath-glow');
    const instruction = document.getElementById('breath-instruction');
    
    if (circle && glow && instruction) {
      circle.className = 'breathing-circle-inner';
      circle.style.transform = 'scale(1)';
      glow.className = 'breathing-circle-glow';
      glow.style.transform = 'scale(1)';
      glow.style.transition = 'none';
      instruction.textContent = 'Tap Start to begin';
      instruction.className = 'breathing-instruction text-teal';
      circle.textContent = 'READY';
    }
  },

  // ==========================================================================
  // Audio Mixer Engine (Synthesized Local Rain & Noise via Web Audio API)
  // ==========================================================================
  initAudio: function() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      showNotification("Audio Mixer not supported by this browser.", "error");
    }
  },

  toggleSound: function(type) {
    this.initAudio();
    if (!this.audioContext) return;

    const btn = document.getElementById(`btn-sound-${type === 'whiteNoise' ? 'noise' : type}`);
    const slider = document.getElementById(`vol-${type}`);
    const volume = parseFloat(slider.value);

    // If context is suspended, resume it (browser auto-play blocks)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.soundActive[type]) {
      // Turn off
      this.stopSoundNode(type);
      this.soundActive[type] = false;
      if (btn) btn.classList.remove('active');
    } else {
      // Turn on
      // Set volume slider to 0.4 if it was at 0
      if (volume === 0) {
        slider.value = 0.4;
        this.saveVolumes();
      }
      
      this.startSoundNode(type);
      this.soundActive[type] = true;
      if (btn) btn.classList.add('active');
    }
  },

  setVolume: function(type, volume) {
    if (!this.soundActive[type]) return;
    
    const node = this.audioNodes[type];
    if (node && node.gainNode) {
      node.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  },

  startSoundNode: function(type) {
    this.stopSoundNode(type); // Safety reset

    const slider = document.getElementById(`vol-${type}`);
    const volume = parseFloat(slider.value);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.connect(this.audioContext.destination);

    let sourceNode = null;

    if (type === 'whiteNoise') {
      // 1. Synthesize Pure White Noise
      const bufferSize = 2 * this.audioContext.sampleRate;
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = noiseBuffer;
      sourceNode.loop = true;
      sourceNode.connect(gainNode);
      sourceNode.start();

    } else if (type === 'rain') {
      // 2. Synthesize Rain (Filtered White Noise + slow oscillations simulating wind/gusts)
      const bufferSize = 2 * this.audioContext.sampleRate;
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter to shape white noise into deep rain sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, this.audioContext.currentTime);

      // Low frequency oscillator for rustling wind/rain amplitude variations
      const lfo = this.audioContext.createOscillator();
      lfo.frequency.setValueAtTime(0.2, this.audioContext.currentTime); // very slow oscillation
      
      const lfoGain = this.audioContext.createGain();
      lfoGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain); // modulate overall volume slightly

      noiseSource.connect(filter);
      filter.connect(gainNode);
      
      lfo.start();
      noiseSource.start();

      // Store references to stop later
      sourceNode = {
        stop: () => {
          noiseSource.stop();
          lfo.stop();
        }
      };

    } else if (type === 'forest') {
      // 3. Audio Streaming for Forest Birds
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2458/2458-84.wav'); // Free CC birds loop
      audio.loop = true;
      
      sourceNode = this.audioContext.createMediaElementSource(audio);
      sourceNode.connect(gainNode);
      audio.play();

      sourceNode = {
        audio: audio,
        stop: () => {
          audio.pause();
        }
      };

    } else if (type === 'lofi') {
      // 4. Audio Streaming for Lo-fi Study Beats (Copyright free archive stream)
      const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // SoundHelix sample or public lo-fi loop
      audio.loop = true;
      
      sourceNode = this.audioContext.createMediaElementSource(audio);
      sourceNode.connect(gainNode);
      audio.play();

      sourceNode = {
        audio: audio,
        stop: () => {
          audio.pause();
        }
      };
    }

    this.audioNodes[type] = {
      sourceNode,
      gainNode
    };
  },

  stopSoundNode: function(type) {
    const node = this.audioNodes[type];
    if (node) {
      try {
        if (node.sourceNode) node.sourceNode.stop();
      } catch (e) {
        console.warn("Error stopping audio node:", e);
      }
      this.audioNodes[type] = null;
    }
  }
};
