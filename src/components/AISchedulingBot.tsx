import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  MessageCircle, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain
} from 'lucide-react';
import { aiSchedulingBot, tomorrowInductionPlan } from '../data/controlCenterData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const AISchedulingBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `🤖 **KMRL AI Scheduling Assistant Active**\n\n✅ Tomorrow's induction plan generated\n📊 15 trains scheduled for revenue service\n⏰ First induction: 04:30 AM\n🎯 Optimization confidence: ${aiSchedulingBot.confidence}%\n\nHow can I assist with train scheduling today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('schedule') || msg.includes('induction')) {
      return `📅 **Tomorrow's Induction Schedule**\n\n🚂 **15 trains scheduled for service**\n⏰ **Induction window**: 04:30 - 08:00\n🎯 **First train**: GANGA at 04:30\n🎯 **Last train**: KABANI at 08:00\n\n✅ All trains have valid fitness certificates\n✅ No schedule conflicts detected\n✅ Optimal 15-minute intervals maintained`;
    }
    
    if (msg.includes('status') || msg.includes('current')) {
      return `📊 **Current System Status**\n\n🟢 **Operational Status**: NORMAL\n⚡ **Power Status**: All systems energized\n🚂 **Active Trains**: 15 in service\n👥 **Passengers**: 45,230 today\n\n🤖 **AI Confidence**: ${aiSchedulingBot.confidence}%\n⏱️ **Next Optimization**: Tomorrow 23:00`;
    }
    
    if (msg.includes('train') && (msg.includes('position') || msg.includes('location'))) {
      return `🗺️ **Live Train Positions**\n\n🚂 **GANGA**: Palarivattom → JLN Stadium (45 km/h)\n🚂 **KAVRI**: Kaloor (STOPPED, +2min delay)\n🚂 **KRISHNA**: Vyttila → Thaikoodam (52 km/h)\n🚂 **TAPTI**: Edapally → Changampuzha Park (48 km/h)\n🚂 **SARAW**: Aluva Terminal (DEPARTING)\n\n📍 All trains tracked in real-time`;
    }
    
    if (msg.includes('maintenance') || msg.includes('repair')) {
      return `🔧 **Maintenance Schedule**\n\n🟡 **IBL Bays**: 3 trains (minor maintenance)\n🔴 **HIBL Bays**: 2 trains (major overhaul)\n⏰ **Estimated completion**: 06:00 tomorrow\n\n✅ No critical issues affecting service\n📋 All maintenance within schedule`;
    }
    
    if (msg.includes('tomorrow') || msg.includes('next day')) {
      return `🌅 **Tomorrow's Operations Plan**\n\n📅 **Date**: ${tomorrowInductionPlan.planDate}\n🚂 **Service Trains**: 15 scheduled\n⏰ **Service Hours**: 05:00 - 22:00\n🎯 **Expected Performance**: 96.8%\n\n✅ Plan approved by Chief Controller\n🤖 AI optimization complete`;
    }
    
    if (msg.includes('help') || msg.includes('commands')) {
      return `🤖 **AI Assistant Commands**\n\n📅 **"schedule"** - View induction schedule\n📊 **"status"** - System status\n🗺️ **"train positions"** - Live tracking\n🔧 **"maintenance"** - Maintenance status\n🌅 **"tomorrow"** - Next day plan\n\n💡 Ask me anything about KMRL operations!`;
    }
    
    return `🤖 **KMRL AI Assistant**\n\nI understand you're asking about: "${userMessage}"\n\n📊 Current system status: NORMAL\n🚂 Active trains: 15\n⏰ Time: ${new Date().toLocaleTimeString()}\n\nPlease ask about:\n• Train schedules\n• Live positions\n• Maintenance status\n• Tomorrow's plan`;
  };

  const quickActions = [
    { label: 'Tomorrow\'s Schedule', action: 'Show tomorrow\'s induction schedule' },
    { label: 'Live Positions', action: 'Show current train positions' },
    { label: 'System Status', action: 'What is the current system status?' },
    { label: 'Maintenance', action: 'Show maintenance schedule' }
  ];

  return (
    <>
      {/* AI Bot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <Bot className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </motion.button>

      {/* AI Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">KMRL AI Assistant</h3>
                    <p className="text-xs text-blue-100">Train Scheduling & Operations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(action.action)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                  placeholder="Ask about train operations..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISchedulingBot;

export default AISchedulingBot