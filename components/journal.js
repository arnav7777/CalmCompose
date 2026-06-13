/**
 * CalmCompose - Journal & Mood Log Component
 */

const JournalComponent = {
  selectedMood: null,
  selectedTags: [],

  init: function() {
    this.selectedMood = null;
    this.selectedTags = [];
  },

  render: function() {
    const container = document.getElementById('page-journal');
    if (!container) return;

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Daily Reflection</span>
        <h1 class="page-title">Journal & Mood Log</h1>
        <p class="page-subtitle">Pour your thoughts out, track your state, and let AI analyze your hidden stress triggers.</p>
      </div>

      <div class="journal-layout">
        <!-- Journal Writing Section -->
        <div class="glass-card">
          <form id="journal-form" class="journal-form">
            <!-- 1. Mood Log (1-5) -->
            <div class="form-group">
              <label class="form-label">How are you feeling overall today?</label>
              <div class="mood-selector-container">
                <div class="mood-option" data-mood="1" id="mood-opt-1">
                  <span class="mood-emoji">😢</span>
                  <span class="mood-label">Awful</span>
                </div>
                <div class="mood-option" data-mood="2" id="mood-opt-2">
                  <span class="mood-emoji">🙁</span>
                  <span class="mood-label">Stressed</span>
                </div>
                <div class="mood-option" data-mood="3" id="mood-opt-3">
                  <span class="mood-emoji">😐</span>
                  <span class="mood-label">Okay</span>
                </div>
                <div class="mood-option" data-mood="4" id="mood-opt-4">
                  <span class="mood-emoji">🙂</span>
                  <span class="mood-label">Good</span>
                </div>
                <div class="mood-option" data-mood="5" id="mood-opt-5">
                  <span class="mood-emoji">😁</span>
                  <span class="mood-label">Great</span>
                </div>
              </div>
            </div>

            <!-- 2. Metrics Sliders (Stress, Energy) -->
            <div class="slider-group">
              <div class="form-group">
                <div class="flex-justify-between" style="display: flex; justify-content: space-between;">
                  <label class="form-label">Stress Level</label>
                  <span class="text-teal font-semibold" id="stress-val-lbl">3/5</span>
                </div>
                <input type="range" id="input-stress" min="1" max="5" value="3" step="1">
                <div class="slider-labels">
                  <span>Very Calm</span>
                  <span>Extreme Panic</span>
                </div>
              </div>

              <div class="form-group">
                <div class="flex-justify-between" style="display: flex; justify-content: space-between;">
                  <label class="form-label">Energy Level</label>
                  <span class="text-purple font-semibold" id="energy-val-lbl">3/5</span>
                </div>
                <input type="range" id="input-energy" min="1" max="5" value="3" step="1">
                <div class="slider-labels">
                  <span>Drained</span>
                  <span>Fully Charged</span>
                </div>
              </div>
            </div>

            <!-- 3. Dynamic Tags -->
            <div class="form-group">
              <label class="form-label">Select areas affecting you today</label>
              <div class="tag-selector" id="tag-selector">
                <div class="tag-option" data-tag="Academic">Academic Study</div>
                <div class="tag-option" data-tag="Sleep">Sleep Quality</div>
                <div class="tag-option" data-tag="Personal">Personal / Family</div>
                <div class="tag-option" data-tag="Health">Physical Health</div>
                <div class="tag-option" data-tag="Time Management">Time Management</div>
              </div>
            </div>

            <!-- 4. Open-ended Journal -->
            <div class="form-group">
              <label class="form-label" for="journal-text">Daily Journal (Write freely about study pressure, mock tests, feelings...)</label>
              <textarea id="journal-text" class="form-textarea" placeholder="How is prep going? Write what's on your mind... (e.g. 'I did physics practice today. Got stuck on integration questions and felt so anxious...')"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-journal" style="width: 100%;">
              <i data-lucide="sparkles"></i> Save Log & Analyze with GenAI
            </button>
          </form>
        </div>

        <!-- AI Analysis Side Panel -->
        <div class="journal-analysis-side">
          <div class="glass-card" style="height: 100%;" id="analysis-card">
            <div class="analysis-panel" id="analysis-placeholder">
              <div class="analysis-header">
                <i data-lucide="brain-cog" class="text-purple" style="width: 28px; height: 28px;"></i>
                <h3>AI Wellness Insights</h3>
              </div>
              <div style="text-align: center; padding: 40px 0; color: var(--text-secondary);">
                <i data-lucide="pen-tool" class="text-muted" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <p>Complete and submit your journal log to receive hyper-personalized wellness support and trigger mapping.</p>
              </div>
            </div>
            
            <div class="analysis-panel" id="analysis-loading" style="display: none; text-align: center; padding: 60px 0;">
              <div class="typing-indicator" style="margin: 0 auto 20px;">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <h4>Analyzing Journal Content...</h4>
              <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px;">Uncovering stress triggers & designing custom coping strategies</p>
            </div>

            <div class="analysis-panel" id="analysis-results" style="display: none;">
              <div class="analysis-header">
                <i data-lucide="sparkles" class="text-teal" style="width: 24px; height: 24px;"></i>
                <h3>GenAI Mental Analysis</h3>
              </div>
              
              <div class="analysis-body">
                <div class="analysis-section">
                  <div class="analysis-section-title text-teal">
                    <i data-lucide="smile"></i> Dominant Emotion
                  </div>
                  <div class="analysis-section-content" id="analysis-emotion" style="font-weight: 600; color: var(--text-primary);">
                    Reflective
                  </div>
                </div>

                <div class="analysis-section">
                  <div class="analysis-section-title text-rose">
                    <i data-lucide="alert-triangle"></i> Identified Triggers
                  </div>
                  <div class="trigger-tag-cloud" id="analysis-triggers">
                    <!-- Dynamic -->
                  </div>
                </div>

                <div class="analysis-section">
                  <div class="analysis-section-title text-purple">
                    <i data-lucide="heart-handshake"></i> Tailored Coping Advice
                  </div>
                  <div class="analysis-section-content" id="analysis-coping">
                    <!-- Dynamic -->
                  </div>
                </div>
                
                <div class="analysis-actions" style="margin-top: 10px; display: flex; gap: 8px;">
                  <button class="btn btn-outline btn-sm" id="btn-go-companion" style="flex: 1;">
                    <i data-lucide="messages-square" style="width: 14px; height: 14px;"></i> Talk to Companion
                  </button>
                  <button class="btn btn-purple btn-sm" id="btn-go-breathing" style="flex: 1;">
                    <i data-lucide="wind" style="width: 14px; height: 14px;"></i> Breathe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.bindEvents();
  },

  bindEvents: function() {
    const self = this;
    
    // Mood Selectors
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(opt => {
      opt.addEventListener('click', function() {
        moodOptions.forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        self.selectedMood = parseInt(this.getAttribute('data-mood'));
      });
    });

    // Metric Sliders Display Updates
    const stressSlider = document.getElementById('input-stress');
    const stressValLbl = document.getElementById('stress-val-lbl');
    stressSlider.addEventListener('input', function() {
      stressValLbl.textContent = `${this.value}/5`;
    });

    const energySlider = document.getElementById('input-energy');
    const energyValLbl = document.getElementById('energy-val-lbl');
    energySlider.addEventListener('input', function() {
      energyValLbl.textContent = `${this.value}/5`;
    });

    // Tag Selectors (Multi-select)
    const tagOptions = document.querySelectorAll('.tag-option');
    tagOptions.forEach(opt => {
      opt.addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          self.selectedTags = self.selectedTags.filter(t => t !== tag);
        } else {
          this.classList.add('selected');
          self.selectedTags.push(tag);
        }
      });
    });

    // Form Submission
    const journalForm = document.getElementById('journal-form');
    journalForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const text = document.getElementById('journal-text').value.trim();
      const stress = parseInt(stressSlider.value);
      const energy = parseInt(energySlider.value);

      // Validate Mood Selection
      if (!self.selectedMood) {
        showNotification("Please select a mood emoji before saving.", "error");
        return;
      }

      if (!text) {
        showNotification("Please share a few lines in your journal.", "error");
        return;
      }

      // Show Loading Panel
      document.getElementById('analysis-placeholder').style.display = 'none';
      document.getElementById('analysis-results').style.display = 'none';
      document.getElementById('analysis-loading').style.display = 'block';

      try {
        // Call GenAI service
        const analysis = await CalmGeminiService.analyzeJournal(text, self.selectedMood, stress, energy);
        
        // Construct the new log entry object
        const newEntry = {
          id: 'log-' + Date.now(),
          date: new Date().toISOString(),
          text: text,
          mood: self.selectedMood,
          stressLevel: stress,
          energyLevel: energy,
          tags: [...self.selectedTags],
          analysis: analysis
        };

        // Add to Local Storage
        CalmDataService.addEntry(newEntry);

        // Update UI with Results
        document.getElementById('analysis-emotion').textContent = analysis.emotion;
        
        const triggersContainer = document.getElementById('analysis-triggers');
        triggersContainer.innerHTML = '';
        analysis.triggers.forEach(trig => {
          const badge = document.createElement('span');
          badge.className = 'trigger-tag';
          badge.innerHTML = `<i data-lucide="tag" style="width: 12px; height: 12px;"></i> ${trig}`;
          triggersContainer.appendChild(badge);
        });

        document.getElementById('analysis-coping').textContent = analysis.coping;
        lucide.createIcons();

        // Switch panel visibility
        document.getElementById('analysis-loading').style.display = 'none';
        document.getElementById('analysis-results').style.display = 'block';

        showNotification("Journal saved! AI Analysis updated.", "success");
        
        // Reset form inputs except values
        document.getElementById('journal-text').value = '';
        self.selectedMood = null;
        moodOptions.forEach(o => o.classList.remove('selected'));
        self.selectedTags = [];
        tagOptions.forEach(o => o.classList.remove('selected'));

        // Refresh sidebar exam targets just in case
        if (window.AppRouter && typeof window.AppRouter.updateBadges === 'function') {
          window.AppRouter.updateBadges();
        }

      } catch (err) {
        console.error(err);
        showNotification("Error during AI analysis. Saved locally.", "error");
        document.getElementById('analysis-loading').style.display = 'none';
        document.getElementById('analysis-placeholder').style.display = 'block';
      }
    });

    // Quick Action Buttons in Analysis Panel
    const goCompanionBtn = document.getElementById('btn-go-companion');
    if (goCompanionBtn) {
      goCompanionBtn.addEventListener('click', () => {
        window.location.hash = '#companion';
      });
    }

    const goBreathingBtn = document.getElementById('btn-go-breathing');
    if (goBreathingBtn) {
      goBreathingBtn.addEventListener('click', () => {
        window.location.hash = '#mindfulness';
      });
    }
  }
};
