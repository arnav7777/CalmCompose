/**
 * CalmCompose - Core Application Controller & SPA Router
 */

// Global Notification Helper
function showNotification(message, type = 'success') {
  // Check if existing banner exists, delete it
  const existing = document.getElementById('notification-toast');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'notification-toast';
  banner.className = `notification-banner ${type === 'error' ? 'error' : ''}`;
  
  const icon = type === 'error' ? 'alert-triangle' : 'check-circle';
  const colorClass = type === 'error' ? 'text-rose' : 'text-teal';

  banner.innerHTML = `
    <i data-lucide="${icon}" class="${colorClass}" style="width: 20px; height: 20px;"></i>
    <p>${message}</p>
  `;

  document.body.appendChild(banner);
  lucide.createIcons();

  // Slide out after 3 seconds
  setTimeout(() => {
    banner.style.animation = 'slideInRight 0.2s reverse forwards';
    setTimeout(() => banner.remove(), 200);
  }, 3200);
}

const AppRouter = {
  // Available pages & their components
  pages: {
    'dashboard': DashboardComponent,
    'journal': JournalComponent,
    'companion': CompanionComponent,
    'mindfulness': MindfulnessComponent,
    'planner': PlannerComponent,
    'settings': SettingsComponent
  },
  
  currentPage: 'dashboard',

  init: function() {
    const self = this;

    // 1. Initialize data store
    CalmDataService.init();

    // 2. Setup hash routing listeners
    window.addEventListener('hashchange', () => {
      self.handleRoute();
    });

    // 3. Setup click listeners on navbar links (supporting both desktop sidebar & mobile navigation)
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Hashchange will trigger route automatically
        const targetPage = this.getAttribute('data-page');
        window.location.hash = `#${targetPage}`;
      });
    });

    // 4. Update sidebar/badge visuals
    this.updateBadges();

    // 5. Route initial page
    this.handleRoute();
  },

  handleRoute: function() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    
    // Validate target page
    if (!this.pages[hash]) {
      window.location.hash = '#dashboard';
      return;
    }

    this.currentPage = hash;

    // Update nav active styling (desktop sidebar)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === hash) {
        link.classList.add('active');
      }
    });

    // Update nav active styling (mobile navigation)
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === hash) {
        link.classList.add('active');
      }
    });

    // Switch visible page sections
    document.querySelectorAll('.app-page').forEach(page => {
      page.classList.remove('active');
    });

    const targetPageEl = document.getElementById(`page-${hash}`);
    if (targetPageEl) {
      targetPageEl.classList.add('active');
    }

    // Initialize & Render page component
    const component = this.pages[hash];
    if (component) {
      if (typeof component.init === 'function') {
        component.init();
      }
      if (typeof component.render === 'function') {
        component.render();
      }
    }

    // Scroll to top of content
    window.scrollTo(0, 0);
  },

  // Updates student name & goal badges in sidebar and headers
  updateBadges: function() {
    const settings = CalmDataService.getSettings();
    
    // Sidebar
    const sidebarName = document.getElementById('badge-user-name');
    const sidebarExam = document.getElementById('badge-exam-target');
    
    if (sidebarName) sidebarName.textContent = settings.userName;
    if (sidebarExam) sidebarExam.textContent = `Target: ${settings.examTarget.split(' ')[0]}`;

    // Mobile Header
    const mobileExam = document.getElementById('mobile-badge-exam');
    if (mobileExam) mobileExam.textContent = settings.examTarget.split(' ')[0];
  }
};

// Bind AppRouter onload
window.addEventListener('DOMContentLoaded', () => {
  AppRouter.init();
  
  // Make AppRouter globally accessible
  window.AppRouter = AppRouter;
});
