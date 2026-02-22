import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import YieldPrediction from './pages/YieldPrediction';
import ClimateRisk from './pages/ClimateRisk';
import MarketPrices from './pages/MarketPrices';
import Chatbot from './pages/Chatbot';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="yield" element={<YieldPrediction />} />
            <Route path="climate" element={<ClimateRisk />} />
            <Route path="market" element={<MarketPrices />} />
            <Route path="chat" element={<Chatbot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
