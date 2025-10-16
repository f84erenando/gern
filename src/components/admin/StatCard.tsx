import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  change: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-secondary p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
