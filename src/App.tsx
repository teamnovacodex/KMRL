import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import TrainInduction from './pages/TrainInduction';
import Analytics from './pages/Analytics';
import AIOptimization from './pages/AIOptimization';
import Maintenance from './pages/Maintenance';
import FleetManagement from './pages/FleetManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ProtectedRoute>
            <Header />
            <Routes>
              <Route path="/" element={<TrainInduction />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-optimization" element={<AIOptimization />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fleet" element={<FleetManagement />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;