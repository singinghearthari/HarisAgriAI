import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CloudRain, TrendingUp, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  const features = [
    {
      to: "/yield",
      title: t("yield.title"),
      desc: t("yield.subtitle"),
      icon: Sprout,
      color: "bg-green-100 text-green-700",
      delay: 0.1
    },
    {
      to: "/climate",
      title: t("climate.title"),
      desc: t("climate.subtitle"),
      icon: CloudRain,
      color: "bg-blue-100 text-blue-700",
      delay: 0.2
    },
    {
      to: "/market",
      title: t("market.title"),
      desc: t("market.subtitle"),
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700",
      delay: 0.3
    },
    {
      to: "/chat",
      title: t("chat.title"),
      desc: t("chat.subtitle"),
      icon: MessageCircle,
      color: "bg-orange-100 text-orange-700",
      delay: 0.4
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{t("dashboard.welcome")}</h1>
        <p className="text-slate-600 max-w-2xl">
          {t("dashboard.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay }}
          >
            <Link 
              to={feature.to}
              className="block group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-emerald-200"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-800 rounded-full -ml-12 -mb-12 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("chat.title")}</h2>
            <p className="text-emerald-100 max-w-md">
              {t("chat.subtitle")}
            </p>
            <Link 
              to="/chat"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              {t("chat.send")}
            </Link>
          </div>
          <div className="hidden md:block">
            <Sprout className="h-32 w-32 text-emerald-400/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
