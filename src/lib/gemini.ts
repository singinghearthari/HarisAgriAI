import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The API key is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  flash: "gemini-2.5-flash-latest",
  pro: "gemini-2.5-pro-latest", // Using flash for speed mostly, but keeping reference
};

export async function generateAgriAdvice(prompt: string, isTamil: boolean = false, imageBase64?: string) {
  try {
    const systemInstruction = isTamil 
      ? "You are Hari's Agri AI, an expert agricultural assistant. You provide advice in Tamil. If the user asks in English, you can reply in English, but prioritize Tamil for agricultural advice if requested. Keep answers practical and helpful for farmers. If an image is provided, analyze it for crop health, pests, or diseases."
      : "You are Hari's Agri AI, an expert agricultural assistant. Provide practical, data-driven advice for farmers. If an image is provided, analyze it for crop health, pests, or diseases.";

    const contents: any[] = [{
      role: "user",
      parts: [{ text: prompt }]
    }];

    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || "image/jpeg";

      contents[0].parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is good for multimodal
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating advice:", error);
    throw error;
  }
}

export async function predictYield(data: any) {
  try {
    const prompt = `
      Analyze the following agricultural data and predict the crop yield.
      Data: ${JSON.stringify(data)}
      
      Provide the response in JSON format with the following structure:
      {
        "predictedYield": "number (in tons/hectare)",
        "confidence": "number (0-100)",
        "factors": ["list of key influencing factors"],
        "recommendations": ["list of recommendations to improve yield"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error predicting yield:", error);
    throw error;
  }
}

export async function analyzeClimateRisk(location: string, weatherData: any) {
  try {
    const prompt = `
      Analyze the climate risk for agriculture in ${location}.
      Current Weather Data:
      - Temperature: ${weatherData.temperature}°C
      - Humidity: ${weatherData.humidity}%
      - Wind Speed: ${weatherData.windSpeed} km/h
      - Rain (Current): ${weatherData.rain} mm
      - Condition: ${weatherData.condition}
      
      Provide the response in JSON format:
      {
        "riskLevel": "Low | Medium | High | Critical",
        "summary": "Short summary of the risk based on current live weather data",
        "upcomingThreats": ["list of potential threats e.g., drought, flood, pests"],
        "mitigationStrategies": ["list of actionable steps"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing climate risk:", error);
    throw error;
  }
}

export async function forecastMarketPrices(crop: string, location: string) {
  try {
    const prompt = `
      Forecast the market prices for ${crop} in ${location} for the next 6 months.
      Assume current market trends.
      
      Provide the response in JSON format:
      {
        "currentPrice": "number",
        "currency": "string (e.g., INR)",
        "forecast": [
          {"month": "Month Name", "price": number, "trend": "up | down | stable"}
        ],
        "analysis": "Text explanation of the forecast"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error forecasting prices:", error);
    throw error;
  }
}

export async function processVoiceCommand(transcript: string, language: 'en-US' | 'ta-IN' = 'en-US', context: string = '') {
  try {
    const isTamil = language === 'ta-IN';
    const prompt = `
      You are a voice assistant for "Hari's Agri AI", an agriculture app.
      The user said: "${transcript}"
      The user's selected language is: ${isTamil ? 'Tamil' : 'English'}
      Current App Context: ${context}

      Determine the user's intent.
      Available routes:
      - / (Dashboard)
      - /yield (Yield Prediction)
      - /climate (Climate Risk)
      - /market (Market Prices)
      - /chat (Agri Assistant Chat)

      If the user wants to navigate, return type "NAVIGATION" and the destination path.
      If the user asks a general agricultural question, return type "RESPONSE" and a short, spoken answer (max 2 sentences).
      If the intent is unclear, return type "RESPONSE" and ask for clarification.
      
      IMPORTANT: 
      - If the selected language is Tamil, the "spokenResponse" MUST be in Tamil script.
      - If the selected language is English, the "spokenResponse" MUST be in English.
      - Do not mix languages unless necessary for technical terms.
      - Be friendly and helpful, like a local agricultural expert.

      Response format (JSON):
      {
        "type": "NAVIGATION" | "RESPONSE",
        "destination": "/path", // only for NAVIGATION
        "spokenResponse": "Text to speak"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const result = JSON.parse(response.text || "{}");
    
    // Fallback if JSON parsing fails or returns empty
    if (!result.type) {
      return {
        type: "RESPONSE",
        spokenResponse: isTamil ? "மன்னிக்கவும், எனக்கு அது புரியவில்லை." : "Sorry, I didn't catch that."
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error processing voice command:", error);
    // Return a safe fallback instead of throwing, so the UI can handle it gracefully
    return {
      type: "RESPONSE",
      spokenResponse: language === 'ta-IN' ? "மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது." : "Sorry, an error occurred."
    };
  }
}
