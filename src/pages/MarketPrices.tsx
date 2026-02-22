import React, { useState } from 'react';
import { forecastMarketPrices } from '../lib/gemini';
import { Loader2, TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../lib/utils';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../contexts/LanguageContext';

export default function MarketPrices() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forecastMarketPrices(crop, location);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-purple-600" />
          {t("market.title")}
        </h1>
        <p className="text-slate-600">
          {t("market.subtitle")}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("market.crop")}</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="e.g. Onion"
                className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInput onInput={setCrop} />
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("market.location")}</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="e.g. Chennai Koyambedu"
                className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInput onInput={setLocation} />
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t("market.forecast")}
          </button>
        </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
              <h3 className="font-semibold text-slate-900 mb-6">6-Month Price Forecast</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.forecast}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#9333ea" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg shadow-purple-200">
                <p className="text-purple-100 text-sm font-medium mb-1">Current Market Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{result.currentPrice}</span>
                  <span className="text-lg opacity-80">{result.currency}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
                <h3 className="font-semibold text-slate-900 mb-4">Monthly Breakdown</h3>
                <div className="space-y-3">
                  {result.forecast?.slice(0, 4).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-900">{item.price} {result.currency}</span>
                        {getTrendIcon(item.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Market Analysis</h3>
            <p className="text-slate-600 leading-relaxed">{result.analysis}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
