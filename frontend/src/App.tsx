// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImpactScreen from './pages/ImpactScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import DashboardScreen from './pages/DashboardScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans antialiased text-gray-900 selection:bg-green-200">
        <Routes>
          <Route path="/" element={<ImpactScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}