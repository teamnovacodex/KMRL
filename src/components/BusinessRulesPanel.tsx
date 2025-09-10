import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import { BusinessRule, TrainEligibility } from '../types/businessRules';
import { businessRulesEngine } from '../services/businessRulesEngine';

interface BusinessRulesPanelProps {
  eligibilityResults: TrainEligibility[];
}

const BusinessRulesPanel: React.FC<BusinessRulesPanelProps> = ({ eligibilityResults }) => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const businessRules = await businessRulesEngine.getRules();
    setRules(businessRules);
  };

  const toggleRule = async (ruleId: string) => {
    const rule = rules.find(r => r.ruleId === ruleId);
    if (rule) {
      await businessRulesEngine.updateRule(ruleId, { isActive: !rule.isActive });
      loadRules();
    }
  };

  const categories = ['All', 'Safety', 'Operational', 'Commercial', 'Regulatory'];
  const filteredRules = selectedCategory === 'All' 
    ? rules 
    : rules.filter(rule => rule.category === selectedCategory);

  const getRuleCategoryColor = (category: string) => {
    switch (category) {
      case 'Safety':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Operational':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Commercial':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Regulatory':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEligibilityStats = () => {
    const eligible = eligibilityResults.filter(e => e.eligibilityStatus === 'Eligible').length;
    const conditional = eligibilityResults.filter(e => e.eligibilityStatus === 'Conditional').length;
    const blocked = eligibilityResults.filter(e => e.eligibilityStatus === 'Blocked').length;
    
    return { eligible, conditional, blocked, total: eligibilityResults.length };
  };

  const stats = getEligibilityStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Business Rules Engine</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure and monitor business rules for train eligibility
          </p>
        </div>
      </div>

      {/* Eligibility Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.eligible}</div>
          <div className="text-sm text-green-700">Eligible</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.conditional}</div>
          <div className="text-sm text-yellow-700">Conditional</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          <div className="text-sm text-red-700">Blocked</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">Total Trains</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div key={rule.ruleId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-gray-900">{rule.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRuleCategoryColor(rule.category)}`}>
                  {rule.category}
                </span>
                <span className="text-sm text-gray-500">Priority: {rule.priority}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.ruleId)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    rule.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {rule.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Inactive
                    </>
                  )}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Conditions:</span>
                <ul className="mt-1 space-y-1">
                  {rule.conditions.map((condition, index) => (
                    <li key={index} className="text-gray-600">
                      • {condition.field} {condition.operator} {condition.value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-700">Actions:</span>
                <ul className="mt-1 space-y-1">
                  {rule.actions.map((action, index) => (
                    <li key={index} className="text-gray-600">
                      • {action.type}: {action.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessRulesPanel;