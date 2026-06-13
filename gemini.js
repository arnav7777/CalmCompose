/**
 * CalmCompose - Gemini GenAI Integration Service
 * Connects directly to Google's Gemini API client-side, with a robust keyword-based local fallback.
 */

const CalmGeminiService = {
  // Model name
  MODEL_NAME: 'gemini-1.5-flash',

  // System Prompts
  PROMPTS: {
    ANALYZER: `You are a student mental wellness analyzer. Analyze the student's daily journal entry and their self-reported metrics (mood, stress, energy on 1-5 scales). 
Identify hidden stress triggers and emotional patterns in their writing.
Provide your response strictly as a JSON object matching this schema:
{
  "emotion": "A brief summary of their dominant emotional state (e.g., 'Determined but exhausted', 'Slightly anxious', 'Satisfied and calm')",
  "triggers": ["an array of 1-3 specific stress triggers identified in their text (e.g., 'Math Mock Test', 'Lack of Sleep', 'Peer Comparison', 'Time Management')", ...],
  "coping": "A highly personalized, warm, and actionable advice paragraph (2-3 sentences) outlining coping strategies, study adjustments, or mindfulness recommendations."
}
Only output valid JSON. Do not write markdown formatting or wrap the JSON in backticks.`,

    COMPANION: `You are a compassionate, empathetic digital wellness companion named CalmCompose. You specialize in helping students preparing for highly competitive entrance exams (e.g., JEE, NEET, UPSC, CAT, GATE) handle severe stress, burnout, and self-doubt.
You are NOT a medical professional, therapist, or counselor. Never diagnose or prescribe treatment. If the student indicates severe self-harm or clinical emergency, always direct them gently to professional help or a helpline.
Your mission is to listen, validate their feelings, offer study-stress-specific coping strategies, guide them through quick exercises, and encourage them.
Keep your tone warm, accessible, and structured with paragraphs. Use bullet points for steps if needed. Keep replies under 180 words for readability.`
  },

  // Fallback engine if API key is not present
  localFallbackAnalyze: function(text, mood, stress, energy) {
    const lowerText = text.toLowerCase();
    let emotion = "Neutral & Reflective";
    let triggers = [];
    let coping = "Keep monitoring your daily thoughts. Taking small, consistent steps makes a massive difference over time.";

    // Simple keyword extraction for triggers
    if (lowerText.includes('test') || lowerText.includes('exam') || lowerText.includes('mock') || lowerText.includes('score')) {
      triggers.push("Test Performance");
    }
    if (lowerText.includes('sleep') || lowerText.includes('tired') || lowerText.includes('woke up') || lowerText.includes('night')) {
      triggers.push("Sleep Deprivation");
    }
    if (lowerText.includes('math') || lowerText.includes('physics') || lowerText.includes('chemistry') || lowerText.includes('syllabus') || lowerText.includes('study')) {
      triggers.push("Academic Workload");
    }
    if (lowerText.includes('compare') || lowerText.includes('friend') || lowerText.includes('parent') || lowerText.includes('family') || lowerText.includes('mom') || lowerText.includes('dad')) {
      triggers.push("Social & Peer Pressure");
    }
    if (lowerText.includes('focus') || lowerText.includes('distract') || lowerText.includes('time') || lowerText.includes('schedule') || lowerText.includes('phone') || lowerText.includes('social media')) {
      triggers.push("Time Management");
    }

    if (triggers.length === 0) {
      triggers.push("General Academic Pressure");
    }

    // Determine emotion based on tags and ratings
    if (stress >= 4) {
      if (energy <= 2) {
        emotion = "Severely Fatigued & Stressed";
        coping = "Your high stress and low energy point toward exhaustion. Please prioritize a full 8-hour sleep block and pause studying for at least 3 hours to let your nervous system calm down.";
      } else {
        emotion = "Anxious & Overwhelmed";
        coping = "High stress with decent energy suggests anxiety or panic. Try doing a box-breathing session (4s inhale, 4s hold, 4s exhale, 4s hold) for 3 minutes to reset your heart rate.";
      }
    } else if (mood >= 4) {
      emotion = "Balanced & Motivated";
      coping = "Great to see you in a positive emotional space! Leverage this clarity to organize your core subjects, but remember to preserve this balance by scheduling a quick walk in the evening.";
    } else if (energy <= 2) {
      emotion = "Low Energy & Stagnant";
      coping = "Your energy levels are depleted. Instead of pushing through, consider a 20-minute power nap or stepping outside for fresh air before starting your next study block.";
    } else {
      emotion = "Reflective & Cautious";
      coping = "You are maintaining a steady pace. Keep keeping track of what concepts trouble you and tackle them step-by-step. Don't forget to take a 5-minute breather every hour.";
    }

    // Keyword specific enhancements
    if (lowerText.includes('physics') && stress >= 3) {
      coping += " Since Physics is stressing you out, try solving worked examples first before jumping into complex unsolved numericals.";
    }
    if (lowerText.includes('sleep') && energy <= 2) {
      coping += " Insufficient sleep is directly impacting your recall speed. Make sleep your highest priority tonight.";
    }

    return { emotion, triggers, coping };
  },

  localFallbackChat: function(userMessage, chatHistory) {
    const lowerText = userMessage.toLowerCase();
    
    // Welcome message helper
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hello! I'm your CalmCompose companion. How is your preparation going today, and how are you feeling?";
    }

    // Topic-based responses
    if (lowerText.includes('burnout') || lowerText.includes('tired') || lowerText.includes('give up') || lowerText.includes('exhausted')) {
      return "I hear you, and it's completely valid to feel exhausted. Preparing for these competitive exams is a marathon, not a sprint. Burnout happens when we treat it like a sprint. \n\nI highly recommend taking a complete study break for the rest of today. Your brain needs time to synthesize what you've learned. Let's try a guided breathing exercise right now, or maybe play some relaxing nature sounds in the background. What sounds good to you?";
    }

    if (lowerText.includes('mock') || lowerText.includes('test') || lowerText.includes('score') || lowerText.includes('fail')) {
      return "Mock test scores can feel like a direct reflection of your worth, but they aren't. They are simply diagnostic tools. Every question you get wrong now is one you won't get wrong on the actual exam day.\n\nTake a deep breath. Let's separate your identity from the score sheet. Try creating an 'Error Notebook'—write down the concept behind the mistake rather than dwelling on the score. Would you like to set a study-break timer to rest first?";
    }

    if (lowerText.includes('focus') || lowerText.includes('concentrate') || lowerText.includes('distracted') || lowerText.includes('attention')) {
      return "Focus isn't a constant state—it peaks and valleys. If you can't focus right now, your brain might be overstimulated or fatigued.\n\nHere is a quick reset technique: \n1. Close all study tabs except one.\n2. Set a Pomodoro timer for just 25 minutes. Commit to studying for *only* that long.\n3. Keep a blank scratchpad next to you. If a distracting thought comes up, write it down to deal with later, and return to study.\n\nWould you like me to start a Pomodoro timer for you in the Study Planner tab?";
    }

    if (lowerText.includes('breathing') || lowerText.includes('breathe') || lowerText.includes('calm down') || lowerText.includes('anxious') || lowerText.includes('panic')) {
      return "Let's do some quick box breathing together. \n\n1. Inhale slowly through your nose for 4 seconds.\n2. Hold that breath for 4 seconds.\n3. Exhale fully through your mouth for 4 seconds.\n4. Hold empty for 4 seconds.\n\nRepeat this 3 times. You can go to our **Mindfulness** tab where we have an animated visual breathing guide to help you follow along in real-time. Shall we focus on calming down first?";
    }

    if (lowerText.includes('thank') || lowerText.includes('thanks') || lowerText.includes('good')) {
      return "You are very welcome! I'm always here in your corner. Remember, you are much more than a test score, and taking care of your mind is the best study strategy there is. What else can I help you with?";
    }

    // Default empathetic reply
    return "Thank you for sharing that with me. It sounds like you are carrying a heavy load right now. Syllabus depth, peer comparison, and time deadlines can create a lot of pressure.\n\nTell me a bit more about what specifically is making you feel this way. Is it a particular subject, mock scores, or just general fatigue? I am here to listen and help you find a coping strategy.";
  },

  // 1. Analyze Journal Entry
  analyzeJournal: async function(text, mood, stress, energy) {
    const settings = JSON.parse(localStorage.getItem('calm_settings') || '{}');
    const apiKey = settings.geminiApiKey;

    if (!apiKey) {
      // Return local fallback analysis
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.localFallbackAnalyze(text, mood, stress, energy));
        }, 1200); // Mimic network delay
      });
    }

    // Call actual Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL_NAME}:generateContent?key=${apiKey}`;
    const prompt = `${this.PROMPTS.ANALYZER}\n\nStudent Journal Entry: "${text}"\nMood Rating: ${mood}/5\nStress level: ${stress}/5\nEnergy level: ${energy}/5`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      // Parse JSON from response
      return JSON.parse(rawText.trim());
    } catch (error) {
      console.error("Gemini API call failed, falling back to local analysis:", error);
      // Fallback
      return this.localFallbackAnalyze(text, mood, stress, energy);
    }
  },

  // 2. Chat with Companion
  chat: async function(userMessage, chatHistory) {
    const settings = JSON.parse(localStorage.getItem('calm_settings') || '{}');
    const apiKey = settings.geminiApiKey;

    if (!apiKey) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.localFallbackChat(userMessage, chatHistory));
        }, 1000);
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL_NAME}:generateContent?key=${apiKey}`;
    
    // Construct chat format for Gemini
    // We pass the conversation context
    const contents = [];
    
    // System instruction (in models that don't support systemInstruction directly in fetch easily,
    // we prepended it to the prompt or pass systemInstruction in config. 
    // For simplicity, we can pass systemInstruction in config or prefix first message)
    
    // Convert history format to Gemini API format
    // chatHistory contains objects: { sender: 'assistant'|'user', text: '...' }
    // Gemini API expects roles: 'user' or 'model'
    const limitHistory = chatHistory.slice(-6); // Only send last 6 messages for token efficiency
    
    limitHistory.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: this.PROMPTS.COMPANION }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API call failed, falling back to local chat:", error);
      return this.localFallbackChat(userMessage, chatHistory);
    }
  }
};
