import React, { useState } from 'react';
import { analyzeClimateRisk } from '../lib/gemini';
import { getCurrentLocation, getCityName } from '../lib/location';
import { getWeatherData, WeatherData } from '../lib/weather';
import { Loader2, CloudRain, ThermometerSun, Wind, AlertTriangle, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../contexts/LanguageContext';

export default function ClimateRisk() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [conditions, setConditions] = useState(''); // Fallback manual conditions
  const { t } = useLanguage();

  const handleAutoDetect = async () => {
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      const [city, weatherData] = await Promise.all([
        getCityName(coords.latitude, coords.longitude),
        getWeatherData(coords)
      ]);
      
      setLocation(city);
      setWeather(weatherData);
      
      // Auto analyze after fetching
      const data = await analyzeClimateRisk(city, weatherData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch location or weather data. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (weather) {
        data = await analyzeClimateRisk(location, weather);
      } else {
        data = await analyzeClimateRisk(location, {
          temperature: "N/A",
          humidity: "N/A",
          windSpeed: "N/A",
          rain: "N/A",
          condition: conditions
        });
      }
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <CloudRain className="h-8 w-8 text-blue-600" />
          {t("climate.title")}
        </h1>
        <p className="text-slate-600">
          {t("climate.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="space-y-4">
              <button
                onClick={handleAutoDetect}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <MapPin className="h-5 w-5" />
                    {t("climate.auto")}
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">{t("climate.manual")}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t("climate.location")}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Madurai"
                      className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceInput onInput={setLocation} />
                    </div>
                  </div>
                </div>

                {!weather && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t("climate.conditions")}</label>
                    <div className="relative">
                      <textarea 
                        required
                        rows={3}
                        placeholder="Describe weather..."
                        className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                      />
                      <div className="absolute right-2 top-4">
                        <VoiceInput onInput={(text) => setConditions(prev => prev + ' ' + text)} />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t("climate.analyze")}
                </button>
              </form>

              {weather && (
                <div className="bg-blue-50 p-4 rounded-xl space-y-2 text-sm text-blue-900">
                  <div className="flex justify-between">
                    <span>Temp:</span>
                    <span className="font-bold">{weather.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <span className="font-bold">{weather.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rain:</span>
                    <span className="font-bold">{weather.rain} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <span className="font-bold">{weather.condition}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Risk Level Card */}
              <div className={cn("p-6 rounded-2xl border flex items-center justify-between", getRiskColor(result.riskLevel))}>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Risk Level</h3>
                  <p className="text-3xl font-bold mt-1">{result.riskLevel}</p>
                </div>
                <AlertTriangle className="h-10 w-10 opacity-50" />
              </div>

              {/* Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Analysis Summary</h3>
                <p className="text-slate-600 leading-relaxed">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Threats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <Wind className="h-5 w-5" />
                    Upcoming Threats
                  </h3>
                  <ul className="space-y-2">
                    {result.upcomingThreats?.map((threat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mitigation */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Mitigation Strategies
                  </h3>
                  <ul className="space-y-2">
                    {result.mitigationStrategies?.map((strategy: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <ThermometerSun className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-center max-w-sm">Enter location and weather details to receive a comprehensive risk analysis report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
