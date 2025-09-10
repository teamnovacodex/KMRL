import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import EnterpriseAnalytics from './pages/EnterpriseAnalytics';
import WhatIfSimulator from './pages/WhatIfSimulator';
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
            <main>
              <Routes>
                <Route path="/" element={<EnterpriseDashboard />} />
                <Route path="/analytics" element={<EnterpriseAnalytics />} />
                <Route path="/simulator" element={
                  <ProtectedRoute requiredPermission="run_optimization">
                    <WhatIfSimulator />
                  </ProtectedRoute>
                } />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/fleet" element={<FleetManagement />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </main>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;