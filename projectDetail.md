# Hari's Agri AI - Project Documentation

## 1. Project Overview
**Hari's Agri AI** is a comprehensive, AI-powered Smart Agriculture platform designed to empower farmers with actionable insights. It leverages advanced Artificial Intelligence (Google Gemini), real-time weather data, and voice interaction to provide a seamless and accessible user experience, particularly tailored for farmers who may prefer voice commands and local language support (Tamil).

## 2. Key Features

### 🌾 Crop Yield Prediction
*   **Functionality:** Estimates crop yield based on farm specifics.
*   **Inputs:** Crop Type, Farm Area (Acres), Soil Type, Average Rainfall, Fertilizer Used.
*   **AI Output:** Predicted yield (tons/hectare), confidence score, and personalized recommendations to improve output.
*   **Voice Integration:** Users can fill out form fields using voice commands.

### 🌦️ Climate Risk Analysis
*   **Functionality:** Analyzes real-time weather data to assess agricultural risks.
*   **Data Source:** Open-Meteo API for live weather data.
*   **Location:** Auto-detects user location via GPS or allows manual entry.
*   **AI Output:** Risk Level (Low/Medium/High/Critical), Summary, Upcoming Threats (e.g., drought, pests), and Mitigation Strategies.

### 💰 Market Price Forecasting
*   **Functionality:** Predicts future market prices to help farmers decide the best time to sell.
*   **Inputs:** Crop Name, Market Location.
*   **AI Output:** 6-month price forecast with trends (up/down), current market price, and a detailed market analysis.
*   **Visualization:** Interactive charts using `recharts` to visualize price trends.

### 🤖 Agri Assistant (Chatbot)
*   **Functionality:** A conversational AI assistant for general agricultural queries.
*   **Multimodal:** Supports text and **image uploads** (e.g., for pest identification).
*   **Language:** Fully bilingual (English & Tamil).
*   **Features:**
    *   Voice Input/Output.
    *   Quick suggestion chips (Weather, Pests, Prices).
    *   Markdown rendering for rich text responses.

### 🎙️ Global Voice Assistant
*   **Functionality:** A system-wide, immersive voice assistant accessible from anywhere in the app.
*   **UI:** Gemini-style full-screen overlay with visual feedback for Listening/Thinking/Speaking states.
*   **Capabilities:**
    *   **Navigation:** "Go to market prices", "Open yield prediction".
    *   **Q&A:** Answers questions directly without navigating away.
    *   **Context Awareness:** Understands the current page context.
*   **Language:** Toggles between English (`en-US`) and Tamil (`ta-IN`).

### 🌍 Localization
*   **Languages:** Complete support for **English** and **Tamil**.
*   **Implementation:** React Context (`LanguageContext`) manages global language state.
*   **Scope:** UI labels, navigation, AI responses, and Voice interactions are all localized.

## 3. Technical Architecture

### Frontend Stack
*   **Framework:** [React 18](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **Animations:** [Motion](https://motion.dev/) (formerly Framer Motion)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Charts:** [Recharts](https://recharts.org/)

### AI & APIs
*   **Generative AI:** [Google Gemini API](https://ai.google.dev/)
    *   Model: `gemini-3-flash-preview` (Optimized for speed and multimodal tasks).
    *   Usage: Yield prediction logic, risk analysis, price forecasting, chatbot responses, voice command processing.
*   **Weather Data:** [Open-Meteo API](https://open-meteo.com/) (Free, no key required).
*   **Geolocation:** Browser `navigator.geolocation` API.
*   **Reverse Geocoding:** [BigDataCloud API](https://www.bigdatacloud.com/) (to convert coordinates to city names).

### Voice & Speech
*   **Speech Recognition:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
*   **Text-to-Speech:** Web Speech API (`SpeechSynthesis`).

## 4. File Structure

```
/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx      # Main app shell with sidebar & mobile nav
│   │   ├── VoiceAssistant.tsx # Global immersive voice overlay
│   │   └── VoiceInput.tsx  # Inline microphone button for form fields
│   ├── contexts/
│   │   └── LanguageContext.tsx # Global language state & translations
│   ├── lib/                # Utility functions & API services
│   │   ├── gemini.ts       # Gemini API integration & prompt engineering
│   │   ├── location.ts     # Geolocation & reverse geocoding
│   │   ├── weather.ts      # Open-Meteo API integration
│   │   └── utils.ts        # CSS class merging (cn)
│   ├── pages/              # Application pages
│   │   ├── Dashboard.tsx
│   │   ├── YieldPrediction.tsx
│   │   ├── ClimateRisk.tsx
│   │   ├── MarketPrices.tsx
│   │   └── Chatbot.tsx
│   ├── App.tsx             # Root component & Routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & Tailwind imports
├── metadata.json           # App metadata & permissions
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

## 5. Setup & Installation

1.  **Prerequisites:** Node.js installed.
2.  **Environment Variables:**
    *   Create a `.env` file (or use the platform's secret manager).
    *   Add `GEMINI_API_KEY=your_api_key_here`.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
5.  **Build for Production:**
    ```bash
    npm run build
    ```

## 6. Future Roadmap
*   **Offline Mode:** PWA support for offline access in remote farm areas.
*   **Community Forum:** A space for farmers to share tips and images.
*   **IoT Integration:** Connect with soil sensors for automated data entry.
*   **More Languages:** Support for Hindi, Telugu, and Kannada.
