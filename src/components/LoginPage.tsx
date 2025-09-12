import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const { login, loading, error } = useAuth();

  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin', description: 'Full system access' },
    { username: 'supervisor', password: 'super123', role: 'Supervisor', description: 'Operations oversight' },
    { username: 'operator', password: 'oper123', role: 'Operator', description: 'Daily operations' },
    { username: 'viewer', password: 'view123', role: 'Viewer', description: 'Read-only access' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  const handleDemoLogin = (username: string, password: string) => {
    setCredentials({ username, password });
    setSelectedUser(username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center text-white space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Train className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">KMRL Metro</h1>
                <p className="text-xl text-blue-200">Kochi Metro Rail Limited</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">AI-Driven Train Induction Planning</h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Advanced decision-support system for optimizing daily train operations, 
                maintenance scheduling, and fleet management across 23 trains.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-blue-200">Active Trains</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">96.8%</div>
                <div className="text-sm text-blue-200">On-Time Performance</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-200">Operations Center</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-sm text-blue-200">Powered Decisions</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
              <p className="text-gray-600">Sign in to access the operations dashboard</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.username}
                  onClick={() => handleDemoLogin(user.username, user.password)}
                  className={`p-3 text-left border rounded-lg transition-all duration-200 hover:shadow-md ${
                    selectedUser === user.username
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{user.role}</div>
                  <div className="text-xs text-gray-600">{user.description}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {user.username} / {user.password}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>© 2024 Kochi Metro Rail Limited. All rights reserved.</p>
              <p className="mt-1">Secure Operations Dashboard v2.0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;