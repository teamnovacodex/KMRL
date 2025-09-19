import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AIOptimization from './pages/AIOptimization';
import Maintenance from './pages/Maintenance';
import FleetManagement from './pages/FleetManagement';
import Reports from './pages/Reports';
import KMRLOperations from './pages/KMRLOperations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ProtectedRoute>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-optimization" element={<AIOptimization />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fleet" element={<FleetManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/kmrl-operations" element={<KMRLOperations />} />
            </Routes>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;