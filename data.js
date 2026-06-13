/**
 * CalmCompose - Mock Data Service
 * Provides seed data for the wellness dashboard on first load.
 */

const CalmDataService = {
  // Key names for local storage
  KEYS: {
    ENTRIES: 'calm_entries',
    SETTINGS: 'calm_settings',
    CHAT_HISTORY: 'calm_chat_history'
  },

  // Generates 14 days of realistic study stress history
  getMockEntries: function() {
    const today = new Date();
    const entries = [];
    
    const mockJournals = [
      {
        daysAgo: 13,
        text: "Started the mock test series for JEE today. I felt extremely overwhelmed when I saw the physics section. Electrodynamics is still very weak. Got stuck on multiple questions and ended up getting panicked. I need to figure out how to manage my time better. Studied for 8 hours but felt unfocused.",
        mood: 2, stressLevel: 4, energyLevel: 3,
        tags: ["Academic", "Time Management"],
        analysis: {
          emotion: "Overwhelmed & Anxious",
          triggers: ["Physics Mock Test", "Time Pressure"],
          coping: "Try dividing the electrodynamics chapters into sub-topics and allocate 45-minute focused blocks instead of marathon study sessions. Remember to do box breathing before sitting for tests."
        }
      },
      {
        daysAgo: 12,
        text: "Felt a bit better today. Slept for 7 hours last night, which helped. Spent the morning revising kinematics and did 30 practice problems. Had a nice chat with my mom in the evening, she told me not to stress too much about the rank. Need to keep this momentum.",
        mood: 4, stressLevel: 2, energyLevel: 4,
        tags: ["Academic", "Sleep"],
        analysis: {
          emotion: "Hopeful & Reassured",
          triggers: ["Family conversation", "Good sleep"],
          coping: "Connecting with loved ones acts as an emotional buffer. Keep this sleep routine (7 hours minimum) as it directly impacts your cognitive retention."
        }
      },
      {
        daysAgo: 11,
        text: "Struggling to focus today. I keep checking social media and comparing myself to others on online forums. Everyone seems to be scoring 220+ in mock tests while I'm stuck at 160. Feel like I'm letting everyone down. Self-doubt is kicking in hard.",
        mood: 2, stressLevel: 4, energyLevel: 2,
        tags: ["Personal", "Academic"],
        analysis: {
          emotion: "Insecure & Defeated",
          triggers: ["Social Media Comparison", "Score Self-Doubt"],
          coping: "Limit online forum browsing during exam prep. Your path is unique. Practice a 5-minute grounding exercise when self-doubt clouds your concentration."
        }
      },
      {
        daysAgo: 10,
        text: "Had a productive day. Finished the chemistry organic reactions chapter. The mechanisms make sense now. Still, my back hurts from sitting all day in the chair. I need to take more breaks.",
        mood: 4, stressLevel: 3, energyLevel: 3,
        tags: ["Academic", "Health"],
        analysis: {
          emotion: "Productive & Fatigue",
          triggers: ["Organic Chemistry Success", "Physical Strain"],
          coping: "Great job on the chemistry front! Introduce a 5-minute stretch break every 50 minutes of studying to manage physical discomfort."
        }
      },
      {
        daysAgo: 9,
        text: "Woke up with a headache. Didn't study much. Felt very guilty about wasting a whole Sunday, but my body just refused to cooperate. I think I am burning out.",
        mood: 1, stressLevel: 5, energyLevel: 1,
        tags: ["Health", "Sleep"],
        analysis: {
          emotion: "Exhausted & Guilty",
          triggers: ["Physical Burnout", "Loss of Study Time"],
          coping: "Rest is not wasted time; it is recovery. Release the guilt. Today was a recovery day. Sip some warm tea and try a relaxing visual breathing exercise."
        }
      },
      {
        daysAgo: 8,
        text: "Back to the grind. Made a detailed study schedule for the week. Spent time working on maths (integration). It is tough, but I am making slow progress. Had a good amount of water today.",
        mood: 3, stressLevel: 3, energyLevel: 3,
        tags: ["Academic", "Time Management"],
        analysis: {
          emotion: "Determined & Centered",
          triggers: ["Weekly Planning", "Integration Progress"],
          coping: "Slow progress is still progress. Having a structure lowers anxiety. Keep tracking your daily goals but keep them realistic."
        }
      },
      {
        daysAgo: 7,
        text: "Weekly mock test day. Score went up by 15 marks! Feeling really glad that my chemistry revision paid off. However, physics is still dragging my aggregate down. Still, it feels like I'm moving in the right direction. Slept late though, feeling tired now.",
        mood: 4, stressLevel: 3, energyLevel: 3,
        tags: ["Academic"],
        analysis: {
          emotion: "Relieved & Motivated",
          triggers: ["Mock Test Improvement", "Chemistry Success"],
          coping: "Celebrate the small wins! 15 marks is a solid step. Take an early night to pay off the sleep debt from last night."
        }
      },
      {
        daysAgo: 6,
        text: "Anxious about the upcoming registration deadline. Filling out forms is stressful. I keep worrying about making a mistake on the application and getting disqualified. Slept poorly last night, kept waking up.",
        mood: 2, stressLevel: 4, energyLevel: 2,
        tags: ["Personal", "Sleep"],
        analysis: {
          emotion: "Anxious & Apprehensive",
          triggers: ["Exam Registration Forms", "Sleep Disruption"],
          coping: "Admin tasks can trigger intense anticipatory stress. Ask a senior or parent to double-check the forms with you to ease the burden."
        }
      },
      {
        daysAgo: 5,
        text: "Today was okay. Practiced physics numericals for 4 hours. Started to understand the shortcut formulas for rotational mechanics. Took a 30-minute walk in the evening, which really cleared my head.",
        mood: 4, stressLevel: 2, energyLevel: 4,
        tags: ["Academic", "Health"],
        analysis: {
          emotion: "Calm & Capable",
          triggers: ["Rotational Mechanics Progress", "Evening Walk"],
          coping: "Walking in nature triggers the brain's default mode network, assisting in problem-solving. Make evening walks a regular habit."
        }
      },
      {
        daysAgo: 4,
        text: "Felt very distracted today. Loud noises outside. I could not concentrate on math at all. I got angry and ended up wasting the afternoon. Feeling frustrated with my lack of self-control.",
        mood: 2, stressLevel: 4, energyLevel: 3,
        tags: ["Personal", "Time Management"],
        analysis: {
          emotion: "Frustrated & Restless",
          triggers: ["External Noise Distraction", "Time Loss Anger"],
          coping: "Frustration is normal when focus is interrupted. Try study white noise or ambient rain sounds to mask external noise and re-focus."
        }
      },
      {
        daysAgo: 3,
        text: "Decided to study at the library today to avoid distractions. It was much better! Studied chemistry and biology for 7 hours total. Really proud of how I handled my focus today.",
        mood: 5, stressLevel: 2, energyLevel: 4,
        tags: ["Academic", "Time Management"],
        analysis: {
          emotion: "Accomplished & Focused",
          triggers: ["Library Environment Change", "High Focus Study"],
          coping: "An environment shift can break stagnation. Keep the library in your routine as your dedicated 'high-focus' sanctuary."
        }
      },
      {
        daysAgo: 2,
        text: "Had a mock prep review with my tutor. He pointed out many silly mistakes in calculations. Felt a bit down because I thought I did better. Need to work on accuracy. Stressing about the main exam again.",
        mood: 3, stressLevel: 3, energyLevel: 3,
        tags: ["Academic"],
        analysis: {
          emotion: "Deflated but Resilient",
          triggers: ["Tutor Feedback", "Silly Mistakes"],
          coping: "Silly mistakes are goldmines for learning. Keep a separate 'Error Notebook' and review it before every test to build accuracy."
        }
      },
      {
        daysAgo: 1,
        text: "Did a full revision session. Felt very exhausted by the evening. Slept only 5 hours because I wanted to finish the electrochemistry workbook. Coffee is keeping me awake, but I feel shaky.",
        mood: 2, stressLevel: 4, energyLevel: 2,
        tags: ["Academic", "Sleep", "Health"],
        analysis: {
          emotion: "Jittery & Exhausted",
          triggers: ["Caffeine Overload", "Sleep Deprivation"],
          coping: "Excessive caffeine mimics panic symptoms (shakiness, fast heart rate). Cut off caffeine by 4 PM and prioritize a full 8-hour recovery sleep tonight."
        }
      }
    ];

    return mockJournals.map(j => {
      const entryDate = new Date(today);
      entryDate.setDate(today.getDate() - j.daysAgo);
      return {
        id: 'mock-' + j.daysAgo,
        date: entryDate.toISOString(),
        text: j.text,
        mood: j.mood,
        stressLevel: j.stressLevel,
        energyLevel: j.energyLevel,
        tags: j.tags,
        analysis: j.analysis
      };
    });
  },

  // Initialize data if not already set in local storage
  init: function() {
    // Check if journal entries exist, if not, write mock entries
    if (!localStorage.getItem(this.KEYS.ENTRIES)) {
      const mockEntries = this.getMockEntries();
      localStorage.setItem(this.KEYS.ENTRIES, JSON.stringify(mockEntries));
    }
    
    // Check if settings exist, if not, write default settings
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const defaultSettings = {
        userName: 'Arnav',
        examTarget: 'JEE Advanced 2026',
        examDate: new Date(new Date().getFullYear() + 1, 4, 25).toISOString().split('T')[0], // Next year May
        dailyStudyGoal: 8,
        geminiApiKey: '',
        soundMixerVolumes: {
          rain: 0,
          whiteNoise: 0,
          forest: 0,
          lofi: 0
        }
      };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Default empty chat history
    if (!localStorage.getItem(this.KEYS.CHAT_HISTORY)) {
      const defaultChat = [
        {
          sender: 'assistant',
          text: 'Hi there! I am your CalmCompose companion. Preparing for high-stakes exams can be incredibly tough. Whether you are dealing with syllabus panic, mock test blues, or just need a 5-minute break to clear your head, I am here for you. What is on your mind today?',
          time: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(defaultChat));
    }
  },

  // Read all entries
  getEntries: function() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.ENTRIES));
  },

  // Save all entries
  saveEntries: function(entries) {
    localStorage.setItem(this.KEYS.ENTRIES, JSON.stringify(entries));
  },

  // Add a new entry
  addEntry: function(entry) {
    const entries = this.getEntries();
    entries.push(entry);
    this.saveEntries(entries);
    return entries;
  },

  // Get settings
  getSettings: function() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS));
  },

  // Save settings
  saveSettings: function(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Get chat history
  getChatHistory: function() {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS.CHAT_HISTORY));
  },

  // Save chat history
  saveChatHistory: function(history) {
    localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(history));
  }
};
