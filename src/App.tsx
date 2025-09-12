import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import MetroDashboard from './pages/MetroDashboard';
import MetroAnalytics from './pages/MetroAnalytics';
import EnterpriseAnalytics from './pages/EnterpriseAnalytics';
import WhatIfSimulator from './pages/WhatIfSimulator';
import FleetManagement from './pages/FleetManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ProtectedRoute>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<MetroDashboard />} />
                <Route path="/analytics" element={<MetroAnalytics />} />
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