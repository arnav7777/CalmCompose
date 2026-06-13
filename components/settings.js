/**
 * CalmCompose - Settings Component
 */

const SettingsComponent = {
  isKeyVisible: false,

  init: function() {
    this.isKeyVisible = false;
  },

  render: function() {
    const container = document.getElementById('page-settings');
    if (!container) return;

    const settings = CalmDataService.getSettings();

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Personalization & Privacy</span>
        <h1 class="page-title">Settings & Configuration</h1>
        <p class="page-subtitle">Configure your exam target, daily study parameters, Gemini API credentials, and manage your data.</p>
      </div>

      <div class="settings-section-wrapper">
        <div class="glass-card">
          <h3>Academic Profile Setup</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 20px;">This updates the countdown calculations and sidebar context badges.</p>

          <form id="settings-profile-form">
            <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 0;">
              
              <div class="form-group">
                <label class="form-label" for="settings-username">Student Name</label>
                <input type="text" id="settings-username" class="form-input" value="${settings.userName}" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="settings-target-exam">Target Exam / Goal</label>
                <select id="settings-target-exam" class="form-select">
                  <option value="JEE Advanced 2026" ${settings.examTarget === 'JEE Advanced 2026' ? 'selected' : ''}>JEE Advanced (Engineering)</option>
                  <option value="NEET UG 2026" ${settings.examTarget === 'NEET UG 2026' ? 'selected' : ''}>NEET UG (Medical)</option>
                  <option value="UPSC CSE 2026" ${settings.examTarget === 'UPSC CSE 2026' ? 'selected' : ''}>UPSC Civil Services</option>
                  <option value="CAT 2026" ${settings.examTarget === 'CAT 2026' ? 'selected' : ''}>CAT (Management)</option>
                  <option value="GATE 2026" ${settings.examTarget === 'GATE 2026' ? 'selected' : ''}>GATE (Engineering Postgrad)</option>
                  <option value="CBSE Boards 2026" ${settings.examTarget === 'CBSE Boards 2026' ? 'selected' : ''}>CBSE Board Exams</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="settings-exam-date">Target Exam Date</label>
                <input type="date" id="settings-exam-date" class="form-input" value="${settings.examDate}" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="settings-study-hours">Daily Study Goal (Hours)</label>
                <input type="number" id="settings-study-hours" class="form-input" min="1" max="18" value="${settings.dailyStudyGoal}" required>
              </div>

            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-profile">
              <i data-lucide="check"></i> Save Profile Settings
            </button>
          </form>
        </div>

        <!-- Gemini API Setup Card -->
        <div class="glass-card">
          <h3>Google Gemini API Setup</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 12px;">
            CalmCompose uses Google's latest <strong>gemini-1.5-flash</strong> model for deep emotional and stress analysis.
          </p>
          <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.15); padding: 12px; border-radius: var(--radius-md); font-size: 0.8rem; line-height: 1.45; margin-bottom: 20px;">
            <strong>Local Fallback Enabled:</strong> By default, we use an intelligent keyword-based fallback engine so you can test all features offline. To activate full generative capabilities, obtain a free API key from Google AI Studio and paste it below.
          </div>

          <form id="settings-api-form">
            <div class="form-group">
              <label class="form-label" for="settings-api-key">Gemini API Key</label>
              <div class="api-key-input-wrapper">
                <input type="password" id="settings-api-key" class="form-input" placeholder="Paste AI Studio API key (AIzaSy...)" value="${settings.geminiApiKey || ''}">
                <button type="button" class="btn-toggle-visibility" id="btn-toggle-api-key" title="Toggle visibility">
                  <i data-lucide="eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-purple" id="btn-save-api">
              <i data-lucide="sparkles"></i> Save API Credentials
            </button>
          </form>
        </div>

        <!-- Privacy & Local Data Management -->
        <div class="glass-card settings-card">
          <h3>Privacy & Local Data Management</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 8px;">Your data is completely private and never uploaded to external servers. It stays in your browser's local sandbox.</p>
          
          <div class="settings-row">
            <div class="settings-meta">
              <h4>Backup Log History</h4>
              <p>Export all your mood logs, journal entries, and study advisor histories as a JSON file.</p>
            </div>
            <button class="btn btn-outline btn-sm" id="btn-export-data">
              <i data-lucide="download"></i> Export JSON
            </button>
          </div>

          <div class="settings-row">
            <div class="settings-meta">
              <h4>Reset System Database</h4>
              <p>Permanently delete all logs and reset the application to its default state. This action is irreversible.</p>
            </div>
            <button class="btn btn-danger btn-sm" id="btn-reset-data">
              <i data-lucide="trash-2"></i> Reset Database
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.bindEvents();
  },

  bindEvents: function() {
    const self = this;

    // 1. Toggle API Key Visibility
    const toggleBtn = document.getElementById('btn-toggle-api-key');
    const apiKeyInput = document.getElementById('settings-api-key');
    if (toggleBtn && apiKeyInput) {
      toggleBtn.addEventListener('click', () => {
        self.isKeyVisible = !self.isKeyVisible;
        apiKeyInput.type = self.isKeyVisible ? 'text' : 'password';
        toggleBtn.innerHTML = self.isKeyVisible ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
        lucide.createIcons();
      });
    }

    // 2. Save Profile Form
    const profileForm = document.getElementById('settings-profile-form');
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const settings = CalmDataService.getSettings();
      settings.userName = document.getElementById('settings-username').value.trim();
      settings.examTarget = document.getElementById('settings-target-exam').value;
      settings.examDate = document.getElementById('settings-exam-date').value;
      settings.dailyStudyGoal = parseInt(document.getElementById('settings-study-hours').value);

      CalmDataService.saveSettings(settings);
      
      // Update badge visuals immediately
      if (window.AppRouter && typeof window.AppRouter.updateBadges === 'function') {
        window.AppRouter.updateBadges();
      }

      showNotification("Profile updated successfully!", "success");
    });

    // 3. Save API Key Form
    const apiForm = document.getElementById('settings-api-form');
    apiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const settings = CalmDataService.getSettings();
      settings.geminiApiKey = document.getElementById('settings-api-key').value.trim();

      CalmDataService.saveSettings(settings);
      
      if (settings.geminiApiKey) {
        showNotification("Gemini API key linked. Live AI features activated!", "success");
      } else {
        showNotification("API key cleared. Switched to offline mock mode.", "success");
      }
    });

    // 4. Export Data Action
    const exportBtn = document.getElementById('btn-export-data');
    exportBtn.addEventListener('click', () => {
      const data = {
        entries: CalmDataService.getEntries(),
        settings: CalmDataService.getSettings(),
        chatHistory: CalmDataService.getChatHistory()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `calmcompose_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification("JSON backup generated and downloaded.", "success");
    });

    // 5. Reset Data Action
    const resetBtn = document.getElementById('btn-reset-data');
    resetBtn.addEventListener('click', () => {
      if (confirm("WARNING: This will permanently delete all your logs, settings, and journal entries. Click OK to confirm.")) {
        localStorage.clear();
        showNotification("Database cleared. Reloading page...", "error");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }
};
