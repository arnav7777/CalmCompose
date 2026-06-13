/**
 * CalmCompose - AI Wellness Companion Component
 */

const CompanionComponent = {
  chatHistory: [],

  init: function() {
    this.chatHistory = [];
  },

  render: function() {
    const container = document.getElementById('page-companion');
    if (!container) return;

    // Fetch conversation from localStorage
    this.chatHistory = CalmDataService.getChatHistory();

    container.innerHTML = `
      <div class="page-title-area">
        <span class="page-badge">Always Available</span>
        <h1 class="page-title">Empathetic AI Companion</h1>
        <p class="page-subtitle">Your non-judgmental digital workspace for venting, exam stress relief, and mental resets.</p>
      </div>

      <div class="companion-layout">
        <!-- Chat Area -->
        <div class="glass-card chat-card">
          <div class="chat-header">
            <div class="chat-companion-profile">
              <div class="companion-avatar-glow">
                <div class="companion-avatar">
                  <i data-lucide="brain-circuit" class="text-teal" style="width: 20px; height: 20px;"></i>
                </div>
              </div>
              <div class="chat-companion-info">
                <h3>CalmCompose Guide</h3>
                <div class="companion-status">
                  <span class="status-dot"></span> Online
                </div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" id="btn-clear-chat" title="Reset Conversation">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>

          <!-- Messages Scroller -->
          <div class="chat-messages" id="chat-messages-box">
            <!-- Rendered Dynamically -->
          </div>

          <!-- Chat Typing Indicator -->
          <div class="chat-messages" id="chat-typing-box" style="display: none; padding: 0 24px 12px; margin-top: -12px;">
            <div class="message-bubble assistant">
              <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="suggested-prompts-container">
            <p class="suggested-prompts-title">Tap to share how you feel:</p>
            <div class="suggested-prompts-row">
              <button class="suggested-prompt-btn" data-msg="I am feeling extremely burnt out and tired.">I feel burnt out</button>
              <button class="suggested-prompt-btn" data-msg="I scored poorly in my mock test and feel like giving up.">I failed my mock test</button>
              <button class="suggested-prompt-btn" data-msg="I cannot concentrate on my studies today. My mind is drifting.">I can't focus today</button>
              <button class="suggested-prompt-btn" data-msg="I am feeling panic and anxiety about my syllabus coverage.">Syllabus anxiety</button>
            </div>
          </div>

          <!-- Message Input Bar -->
          <div class="chat-input-container">
            <form id="chat-form">
              <div class="chat-input-wrapper">
                <input type="text" id="chat-user-input" class="chat-input" placeholder="Vent about your study stress or ask for a calming exercise..." autocomplete="off">
                <button type="submit" class="chat-send-btn" id="btn-send-message">
                  <i data-lucide="send" style="width: 22px; height: 22px;"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Side Stats Column -->
        <div class="companion-info-column">
          <div class="glass-card">
            <h3>Digital Sanctuary</h3>
            <p class="text-muted" style="font-size: 0.8rem; line-height: 1.4; margin-top: 8px;">
              CalmCompose uses Generative AI to understand the nuances of academic pressure. Talk to it like a close peer who wants you to succeed.
            </p>
            
            <div class="companion-stat-item">
              <div class="companion-stat-icon" style="background: rgba(6, 182, 212, 0.1); color: var(--teal);">
                <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="user-badge-info">
                <h4 style="font-size: 0.85rem;">Private & Safe</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">Logs stored in localStorage</p>
              </div>
            </div>

            <div class="companion-stat-item">
              <div class="companion-stat-icon" style="background: rgba(168, 85, 247, 0.1); color: var(--purple);">
                <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="user-badge-info">
                <h4 style="font-size: 0.85rem;">Active Support</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">Empathetic tone setting</p>
              </div>
            </div>

            <div class="companion-stat-item">
              <div class="companion-stat-icon" style="background: rgba(234, 179, 8, 0.1); color: var(--yellow);">
                <i data-lucide="coffee" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="user-badge-info">
                <h4 style="font-size: 0.85rem;">Mindfulness integration</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary);">Guided resets available</p>
              </div>
            </div>
          </div>
          
          <div class="glass-card">
            <h3>Mindfulness quick tips</h3>
            <ul style="padding-left: 18px; font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <li>Try writing down distracting thoughts during studies to clear RAM space in your working memory.</li>
              <li>Every 2 hours of study warrants at least 15 minutes of non-screen relaxation.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.renderMessages();
    this.bindEvents();
  },

  renderMessages: function() {
    const chatBox = document.getElementById('chat-messages-box');
    if (!chatBox) return;

    chatBox.innerHTML = '';

    this.chatHistory.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `message-bubble ${msg.sender}`;
      
      const time = new Date(msg.time);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Convert newlines in AI text to HTML breaks
      const textHtml = msg.text.replace(/\n/g, '<br>');

      bubble.innerHTML = `
        <div class="message-content">
          ${textHtml}
        </div>
        <span class="message-time">${timeStr}</span>
      `;
      chatBox.appendChild(bubble);
    });

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  },

  bindEvents: function() {
    const self = this;
    const chatBox = document.getElementById('chat-messages-box');
    const input = document.getElementById('chat-user-input');
    const form = document.getElementById('chat-form');
    const typingBox = document.getElementById('chat-typing-box');
    const clearBtn = document.getElementById('btn-clear-chat');

    // Message submit handler
    const sendMessage = async (messageText) => {
      if (!messageText) return;

      // Add user message to state & UI
      const userMsg = {
        sender: 'user',
        text: messageText,
        time: new Date().toISOString()
      };
      
      self.chatHistory.push(userMsg);
      CalmDataService.saveChatHistory(self.chatHistory);
      self.renderMessages();

      // Clear input & Show typing indicator
      input.value = '';
      typingBox.style.display = 'block';
      chatBox.scrollTop = chatBox.scrollHeight;

      try {
        // Send to Gemini Service
        const reply = await CalmGeminiService.chat(messageText, self.chatHistory);
        
        // Hide typing indicator
        typingBox.style.display = 'none';

        // Add assistant reply to state & UI
        const assistantMsg = {
          sender: 'assistant',
          text: reply,
          time: new Date().toISOString()
        };

        self.chatHistory.push(assistantMsg);
        CalmDataService.saveChatHistory(self.chatHistory);
        self.renderMessages();

      } catch (err) {
        console.error(err);
        typingBox.style.display = 'none';
        
        const errorMsg = {
          sender: 'assistant',
          text: "I am having trouble connecting to my creative nodes right now, but I'm still listening. Take a slow deep breath, step away from the desk for a minute, and try sending your message again.",
          time: new Date().toISOString()
        };

        self.chatHistory.push(errorMsg);
        CalmDataService.saveChatHistory(self.chatHistory);
        self.renderMessages();
      }
    };

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const messageText = input.value.trim();
      sendMessage(messageText);
    });

    // Suggested quick prompt clicks
    const promptBtns = document.querySelectorAll('.suggested-prompt-btn');
    promptBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const promptMsg = this.getAttribute('data-msg');
        sendMessage(promptMsg);
      });
    });

    // Clear chat history
    clearBtn.addEventListener('click', function() {
      if (confirm("Are you sure you want to reset your conversation history with CalmCompose?")) {
        const defaultChat = [
          {
            sender: 'assistant',
            text: 'Hi there! I am your CalmCompose companion. Ready to chat or do a wellness check-in. What is on your mind today?',
            time: new Date().toISOString()
          }
        ];
        self.chatHistory = defaultChat;
        CalmDataService.saveChatHistory(self.chatHistory);
        self.renderMessages();
        showNotification("Chat conversation reset.", "success");
      }
    });
  }
};
