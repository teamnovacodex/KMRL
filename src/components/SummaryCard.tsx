import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor?: string;
  borderColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor = 'bg-white', 
  borderColor = 'border-gray-200' 
}) => {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;