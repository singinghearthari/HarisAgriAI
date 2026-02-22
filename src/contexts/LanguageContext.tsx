import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "Hari's Agri AI",
    "nav.dashboard": "Dashboard",
    "nav.yield": "Yield Prediction",
    "nav.climate": "Climate Risk",
    "nav.market": "Market Prices",
    "nav.chat": "Agri Assistant",
    "ai.status": "AI Status: Online",
    "ai.powered": "Powered by Gemini 2.5",
    "dashboard.welcome": "Welcome back, Farmer!",
    "dashboard.subtitle": "Here is your daily agricultural overview.",
    "dashboard.weather": "Weather",
    "dashboard.market": "Market Trends",
    "dashboard.alerts": "Alerts",
    "yield.title": "Crop Yield Prediction",
    "yield.subtitle": "Enter your farm details to get an AI-powered yield estimate and recommendations.",
    "yield.crop": "Crop Type",
    "yield.area": "Area (Acres)",
    "yield.rainfall": "Avg Rainfall (mm)",
    "yield.soil": "Soil Type",
    "yield.fertilizer": "Fertilizer Used",
    "yield.predict": "Predict Yield",
    "climate.title": "Climate Risk Analysis",
    "climate.subtitle": "Real-time weather analysis and risk assessment using GPS and Live Weather Data.",
    "climate.auto": "Auto-Detect Location & Weather",
    "climate.manual": "Or Enter Manually",
    "climate.location": "Location",
    "climate.conditions": "Current Conditions",
    "climate.analyze": "Analyze Risk",
    "market.title": "Market Price Forecasting",
    "market.subtitle": "AI-driven price predictions to help you decide the best time to sell.",
    "market.crop": "Crop",
    "market.location": "Market Location",
    "market.forecast": "Forecast",
    "chat.title": "Agri Assistant",
    "chat.subtitle": "Ask about crops, pests, or weather",
    "chat.placeholder": "Type your question here...",
    "chat.send": "Send",
    "chat.upload": "Upload Image",
    "chat.clear": "Clear Chat",
    "chat.suggestions": "Suggestions:",
    "chat.suggestion.weather": "Weather Forecast",
    "chat.suggestion.pest": "Identify Pest",
    "chat.suggestion.price": "Market Prices",
    "chat.suggestion.fertilizer": "Fertilizer Advice",
    "voice.listening": "Listening...",
    "voice.thinking": "Thinking...",
    "voice.assistant": "Assistant",
    "voice.speak_again": "Speak Again",
    "voice.error": "Error listening. Please try again.",
    "voice.sorry": "Sorry, I didn't catch that.",
  },
  ta: {
    "app.title": "ஹரியின் அக்ரி ஏஐ",
    "nav.dashboard": "முகப்பு",
    "nav.yield": "மகசூல் கணிப்பு",
    "nav.climate": "காலநிலை ஆபத்து",
    "nav.market": "சந்தை விலைகள்",
    "nav.chat": "விவசாய உதவியாளர்",
    "ai.status": "AI நிலை: ஆன்லைன்",
    "ai.powered": "ஜெமினி 2.5 மூலம் இயங்குகிறது",
    "dashboard.welcome": "வரவேற்கிறோம், விவசாயி!",
    "dashboard.subtitle": "உங்கள் தினசரி விவசாய கண்ணோட்டம் இங்கே.",
    "dashboard.weather": "வானிலை",
    "dashboard.market": "சந்தை நிலவரம்",
    "dashboard.alerts": "எச்சரிக்கைகள்",
    "yield.title": "பயிர் மகசூல் கணிப்பு",
    "yield.subtitle": "AI-ஆற்றல்மிக்க மகசூல் மதிப்பீடு மற்றும் பரிந்துரைகளைப் பெற உங்கள் பண்ணை விவரங்களை உள்ளிடவும்.",
    "yield.crop": "பயிர் வகை",
    "yield.area": "பரப்பளவு (ஏக்கர்)",
    "yield.rainfall": "சராசரி மழைப்பொழிவு (மிமீ)",
    "yield.soil": "மண் வகை",
    "yield.fertilizer": "பயன்படுத்தப்பட்ட உரம்",
    "yield.predict": "மகசூலைக் கணிக்கவும்",
    "climate.title": "காலநிலை ஆபத்து பகுப்பாய்வு",
    "climate.subtitle": "GPS மற்றும் நேரடி வானிலை தரவைப் பயன்படுத்தி நிகழ்நேர வானிலை பகுப்பாய்வு மற்றும் ஆபத்து மதிப்பீடு.",
    "climate.auto": "இடம் & வானிலையை தானாகக் கண்டறி",
    "climate.manual": "அல்லது கைமுறையாக உள்ளிடவும்",
    "climate.location": "இடம்",
    "climate.conditions": "தற்போதைய நிலைமைகள்",
    "climate.analyze": "ஆபத்தை பகுப்பாய்வு செய்",
    "market.title": "சந்தை விலை முன்னறிவிப்பு",
    "market.subtitle": "விற்க சிறந்த நேரத்தை முடிவு செய்ய உதவும் AI-உந்துதல் விலை கணிப்புகள்.",
    "market.crop": "பயிர்",
    "market.location": "சந்தை இடம்",
    "market.forecast": "முன்னறிவிப்பு",
    "chat.title": "விவசாய உதவியாளர்",
    "chat.subtitle": "பயிர்கள், பூச்சிகள் அல்லது வானிலை பற்றி கேளுங்கள்",
    "chat.placeholder": "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
    "chat.send": "அனுப்பு",
    "chat.upload": "படம் பதிவேற்றவும்",
    "chat.clear": "அரட்டையை அழி",
    "chat.suggestions": "பரிந்துரைகள்:",
    "chat.suggestion.weather": "வானிலை அறிக்கை",
    "chat.suggestion.pest": "பூச்சியை அடையாளம் காணவும்",
    "chat.suggestion.price": "சந்தை விலைகள்",
    "chat.suggestion.fertilizer": "உரம் ஆலோசனை",
    "voice.listening": "கேட்கிறது...",
    "voice.thinking": "யோசிக்கிறது...",
    "voice.assistant": "உதவியாளர்",
    "voice.speak_again": "மீண்டும் பேசு",
    "voice.error": "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    "voice.sorry": "மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை.",
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
