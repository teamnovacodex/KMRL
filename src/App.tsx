import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import WhatIfSimulator from './pages/WhatIfSimulator';
import Maintenance from './pages/Maintenance';
import FleetManagement from './pages/FleetManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
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