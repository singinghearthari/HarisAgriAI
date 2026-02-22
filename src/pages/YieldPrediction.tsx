import React, { useState } from 'react';
import { predictYield } from '../lib/gemini';
import { Loader2, Sprout, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../contexts/LanguageContext';

export default function YieldPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    crop: '',
    area: '',
    soilType: '',
    rainfall: '',
    fertilizer: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await predictYield(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVoiceInput = (field: string, text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Sprout className="h-8 w-8 text-green-600" />
          {t("yield.title")}
        </h1>
        <p className="text-slate-600">
          {t("yield.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("yield.crop")}</label>
              <div className="relative">
                <select 
                  name="crop" 
                  required
                  className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
                  value={formData.crop}
                  onChange={handleChange}
                >
                  <option value="">Select a crop</option>
                  <option value="Rice">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn (Maize)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t("yield.area")}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="area"
                    required
                    placeholder="e.g. 5"
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    value={formData.area}
                    onChange={handleChange}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInput onInput={(text) => handleVoiceInput('area', text.replace(/[^0-9.]/g, ''))} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t("yield.rainfall")}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="rainfall"
                    placeholder="e.g. 1200"
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    value={formData.rainfall}
                    onChange={handleChange}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInput onInput={(text) => handleVoiceInput('rainfall', text.replace(/[^0-9.]/g, ''))} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("yield.soil")}</label>
              <select 
                name="soilType"
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={formData.soilType}
                onChange={handleChange}
              >
                <option value="">Select soil type</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Black">Black (Regur)</option>
                <option value="Red">Red</option>
                <option value="Laterite">Laterite</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("yield.fertilizer")}</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="fertilizer"
                  placeholder="e.g. Urea, DAP"
                  className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={formData.fertilizer}
                  onChange={handleChange}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <VoiceInput onInput={(text) => handleVoiceInput('fertilizer', text)} />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t("yield.predict")}
            </button>
          </form>
        </motion.div>

        <div className="space-y-6">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Prediction Result</h3>
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-5xl font-bold text-slate-900">{result.predictedYield}</span>
                  <span className="text-lg text-slate-500 mb-2">tons/hectare</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{result.confidence}% Confidence Score</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  Key Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl">
              <Sprout className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-center">Fill out the form to see AI predictions here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
