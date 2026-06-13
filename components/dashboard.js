/**
 * CalmCompose - Dashboard Component
 */

const DashboardComponent = {
  charts: {
    trends: null,
    triggers: null
  },

  init: function() {
    this.charts.trends = null;
    this.charts.triggers = null;
  },

  render: function() {
    const container = document.getElementById('page-dashboard');
    if (!container) return;

    const entries = CalmDataService.getEntries().sort((a, b) => new Date(a.date) - new Date(b.date));
    const settings = CalmDataService.getSettings();

    // 1. Calculate stats
    const totalLogs = entries.length;
    let avgMood = 0;
    let avgStress = 0;
    let avgEnergy = 0;
    
    if (totalLogs > 0) {
      avgMood = (entries.reduce((sum, e) => sum + e.mood, 0) / totalLogs).toFixed(1);
      avgStress = (entries.reduce((sum, e) => sum + e.stressLevel, 0) / totalLogs).toFixed(1);
      avgEnergy = (entries.reduce((sum, e) => sum + e.energyLevel, 0) / totalLogs).toFixed(1);
    }

    // 2. Format Countdown
    const countdownText = this.getCountdownString(settings.examDate, settings.examTarget);

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Academic Wellness Hub</span>
        <h1 class="page-title">Welcome back, ${settings.userName}</h1>
        <p class="page-subtitle">Your exam preparation wellness analytics and mental balance index.</p>
      </div>

      <!-- Quick Stats Row -->
      <div class="quick-stats-row">
        <!-- Average Mood Card -->
        <div class="glass-card stat-card glow-teal">
          <div class="stat-icon" style="background: rgba(6, 182, 212, 0.1); color: var(--teal);">
            <i data-lucide="smile"></i>
          </div>
          <div class="stat-info">
            <h3>${avgMood}/5</h3>
            <p>Avg Mood (14d)</p>
          </div>
        </div>

        <!-- Average Stress Card -->
        <div class="glass-card stat-card glow-purple">
          <div class="stat-icon" style="background: rgba(168, 85, 247, 0.1); color: var(--purple);">
            <i data-lucide="activity"></i>
          </div>
          <div class="stat-info">
            <h3>${avgStress}/5</h3>
            <p>Stress Level (14d)</p>
          </div>
        </div>

        <!-- Total Journal Entries -->
        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--emerald);">
            <i data-lucide="book-marked"></i>
          </div>
          <div class="stat-info">
            <h3>${totalLogs}</h3>
            <p>Total Journals</p>
          </div>
        </div>

        <!-- Countdown Card -->
        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(244, 63, 94, 0.1); color: var(--rose);">
            <i data-lucide="hourglass"></i>
          </div>
          <div class="stat-info">
            <h3 style="font-size: 0.95rem; line-height: 1.2;">${countdownText}</h3>
            <p>Exam Countdown</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Primary Grid -->
      <div class="dashboard-grid">
        
        <!-- Trends Line Chart -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Mental Balance Trends</h3>
            <span class="badge-pill badge-teal">Last 14 Logs</span>
          </div>
          <div class="chart-container">
            <canvas id="trendsChart"></canvas>
          </div>
        </div>

        <!-- AI Pattern Insights -->
        <div class="glass-card dashboard-insights-card">
          <h3>AI Wellness Insights</h3>
          <div id="dashboard-insights-list" style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Generated dynamically based on log scores -->
          </div>
        </div>
      </div>

      <!-- Dashboard Secondary Grid -->
      <div class="dashboard-grid" style="grid-template-columns: 1.2fr 1.8fr;">
        <!-- Trigger Radar/Bar Chart -->
        <div class="glass-card">
          <h3>Stress Triggers frequency</h3>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 16px;">Derived from your open-ended logs.</p>
          <div class="chart-container" style="height: 240px;">
            <canvas id="triggersChart"></canvas>
          </div>
        </div>

        <!-- Recent Logs & Coping History -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3>Recent Log Analysis</h3>
            <button class="btn btn-outline btn-sm" onclick="window.location.hash = '#journal'">
              <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Log New Entry
            </button>
          </div>
          <div class="recent-logs-list" id="recent-logs-container">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    
    // Defer chart instantiation until canvases are attached
    setTimeout(() => {
      this.initCharts(entries);
      this.generateAIInsights(entries, settings);
      this.renderRecentLogs(entries);
    }, 50);
  },

  getCountdownString: function(examDateStr, examName) {
    if (!examDateStr) return "Not set";
    const examDate = new Date(examDateStr);
    const today = new Date();
    
    // Clear time portions
    examDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${examName} passed`;
    } else if (diffDays === 0) {
      return `${examName} TODAY!`;
    } else {
      return `${diffDays} Days to ${examName.split(' ')[0]}`;
    }
  },

  initCharts: function(entries) {
    const last14Entries = entries.slice(-14);
    
    // Format dates to short labels (e.g. "Jun 12")
    const labels = last14Entries.map(e => {
      const d = new Date(e.date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const moodData = last14Entries.map(e => e.mood);
    const stressData = last14Entries.map(e => e.stressLevel);
    const energyData = last14Entries.map(e => e.energyLevel);

    // 1. Line Chart: Mood, Stress, Energy Trends
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    
    // Destroy previous instance to avoid canvas error
    if (this.charts.trends) this.charts.trends.destroy();

    this.charts.trends = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mood (1-5)',
            data: moodData,
            borderColor: '#e35a36',
            backgroundColor: 'rgba(227, 90, 54, 0.04)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#e35a36'
          },
          {
            label: 'Stress (1-5)',
            data: stressData,
            borderColor: '#dd6b20',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3,
            pointBackgroundColor: '#dd6b20'
          },
          {
            label: 'Energy (1-5)',
            data: energyData,
            borderColor: '#9c5d7c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: '#9c5d7c'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#705e49', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: { stepSize: 1, color: '#9e8d77' },
            grid: { color: 'rgba(139, 92, 26, 0.05)' }
          },
          x: {
            ticks: { color: '#9e8d77', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    });

    // 2. Bar Chart: Trigger tags count
    const triggerCounts = {};
    entries.forEach(e => {
      // Collect tags
      if (e.tags) {
        e.tags.forEach(t => {
          triggerCounts[t] = (triggerCounts[t] || 0) + 1;
        });
      }
      // Collect AI triggers as well
      if (e.analysis && e.analysis.triggers) {
        e.analysis.triggers.forEach(t => {
          triggerCounts[t] = (triggerCounts[t] || 0) + 1;
        });
      }
    });

    // Sort triggers by count
    const sortedTriggers = Object.keys(triggerCounts)
      .map(k => ({ name: k, count: triggerCounts[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 triggers

    const triggerLabels = sortedTriggers.map(t => t.name);
    const triggerData = sortedTriggers.map(t => t.count);

    const triggersCtx = document.getElementById('triggersChart').getContext('2d');
    if (this.charts.triggers) this.charts.triggers.destroy();

    this.charts.triggers = new Chart(triggersCtx, {
      type: 'bar',
      data: {
        labels: triggerLabels,
        datasets: [{
          label: 'Times Highlighted',
          data: triggerData,
          backgroundColor: 'rgba(227, 90, 54, 0.4)',
          borderColor: '#e35a36',
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 16
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: '#9e8d77', stepSize: 1 },
            grid: { color: 'rgba(139, 92, 26, 0.05)' }
          },
          y: {
            ticks: { color: '#3c3224', font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  },

  generateAIInsights: function(entries, settings) {
    const list = document.getElementById('dashboard-insights-list');
    if (!list) return;

    list.innerHTML = '';

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="insight-item">
          <i data-lucide="info" class="text-teal insight-item-icon"></i>
          <div>
            <strong>Welcome to CalmCompose!</strong> Once you submit your first journal entry, your personalized AI pattern insights will display here.
          </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const last5 = entries.slice(-5);
    const avgStress = last5.reduce((sum, e) => sum + e.stressLevel, 0) / last5.length;
    const avgEnergy = last5.reduce((sum, e) => sum + e.energyLevel, 0) / last5.length;

    const insights = [];

    // Trigger patterns check
    const sleepLogs = entries.filter(e => e.tags.includes('Sleep') && e.energyLevel <= 2);
    if (sleepLogs.length >= 3) {
      insights.push({
        type: 'rose',
        icon: 'moon',
        title: 'Sleep and Focus Pattern',
        text: 'We noticed a correlation: your energy drops and stress spikes on days when sleep is logged. Try implementing a fixed 10:30 PM digital curfew.'
      });
    }

    // High stress, moderate/high energy pattern
    if (avgStress >= 3.8 && avgEnergy >= 3) {
      insights.push({
        type: 'purple',
        icon: 'activity',
        title: 'High Anticipatory Stress',
        text: 'Your stress levels are high despite having good physical energy. This is common during mock test prep. Dedicate 10 minutes to visual box breathing in the morning.'
      });
    }

    // Low energy trend
    if (avgEnergy <= 2.2) {
      insights.push({
        type: 'yellow',
        icon: 'battery-charging',
        title: 'Fatigue Warning',
        text: 'Your average energy score is low. Pushing through exhaustion limits retention. Switch your study blocks to a 25/5 Pomodoro rhythm and take physical walks.'
      });
    }

    // Default general encouraging wellness tip
    if (insights.length < 2) {
      insights.push({
        type: 'teal',
        icon: 'check-circle-2',
        title: 'Steady Academic Rhythm',
        text: 'You are logging reflections consistently. Keep writing down your stress points—the simple act of journaling reduces load on the working memory.'
      });
    }

    // Render insights
    insights.forEach(ins => {
      const colorClass = ins.type === 'rose' ? 'text-rose' : (ins.type === 'purple' ? 'text-purple' : (ins.type === 'yellow' ? 'text-yellow' : 'text-teal'));
      const item = document.createElement('div');
      item.className = 'insight-item';
      item.innerHTML = `
        <i data-lucide="${ins.icon}" class="${colorClass} insight-item-icon"></i>
        <div>
          <strong>${ins.title}:</strong> ${ins.text}
        </div>
      `;
      list.appendChild(item);
    });

    lucide.createIcons();
  },

  renderRecentLogs: function(entries) {
    const container = document.getElementById('recent-logs-container');
    if (!container) return;

    container.innerHTML = '';

    const recentLogs = entries.slice(-3).reverse(); // last 3 logs in reverse chronological order

    if (recentLogs.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-secondary);">No logs found yet.</p>';
      return;
    }

    recentLogs.forEach(log => {
      const date = new Date(log.date);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      const moodEmojis = ['', '😢', '🙁', '😐', '🙂', '😁'];
      const moodColors = ['', 'text-rose', 'text-rose', 'text-yellow', 'text-teal', 'text-teal'];
      
      const row = document.createElement('div');
      row.className = 'recent-log-row';
      row.innerHTML = `
        <div class="recent-log-info">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="recent-log-date">${dateStr}</span>
            <span class="mood-emoji">${moodEmojis[log.mood]}</span>
          </div>
          <p class="recent-log-text">${log.text}</p>
        </div>
        <div class="recent-log-metrics">
          <span class="metric-badge" style="background:rgba(244, 63, 94, 0.08); color:var(--rose);">
            <i data-lucide="activity" style="width:12px; height:12px;"></i> Stress: ${log.stressLevel}
          </span>
          <span class="metric-badge" style="background:rgba(168, 85, 247, 0.08); color:var(--purple);">
            <i data-lucide="battery" style="width:12px; height:12px;"></i> Energy: ${log.energyLevel}
          </span>
        </div>
      `;
      container.appendChild(row);
    });

    lucide.createIcons();
  }
};
