import React from 'react';
import { Train, MapPin, Brain, BarChart3, Wrench, FileText, Users, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Train Induction', icon: Train },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/ai-optimization', label: 'AI Engine', icon: Brain },
    { path: '/maintenance', label: 'Maintenance', icon: Wrench },
    { path: '/fleet', label: 'Fleet', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="bg-kmrl-aquamarine-600 border-b border-kmrl-aquamarine-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-kmrl-lime-500 to-kmrl-yellow-500 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">KMRL Metro</h1>
                <p className="text-sm text-kmrl-aquamarine-100">AI-Driven Fleet Management</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-kmrl-lime-500 text-white shadow-lg'
                      : 'text-kmrl-aquamarine-100 hover:text-white hover:bg-kmrl-aquamarine-500'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline text-kmrl-aquamarine-100">Kochi Metro</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-white">
                  Welcome, <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-kmrl-aquamarine-100 hover:text-white px-3 py-1 rounded-md hover:bg-kmrl-aquamarine-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-kmrl-aquamarine-700 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-kmrl-lime-500 text-white'
                      : 'text-kmrl-aquamarine-100 hover:text-white hover:bg-kmrl-aquamarine-500'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;