import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Maintenance from './pages/Maintenance';
import FleetManagement from './pages/FleetManagement';
import Reports from './pages/Reports';
import AIOptimization from './pages/AIOptimization';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-optimization" element={<AIOptimization />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/fleet" element={<FleetManagement />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;