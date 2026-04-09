import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  darkMode?: boolean;
}

export function StatCard({ title, value, subtitle, trend, trendValue, icon, color = 'blue', darkMode = true }: StatCardProps) {
  const darkColorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    gray: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
  };

  const lightColorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    gray: 'bg-gray-50 border-gray-200 text-gray-600',
  };

  const colorClasses = darkMode ? darkColorClasses : lightColorClasses;

  const trendColors = {
    up: darkMode ? 'text-emerald-400' : 'text-emerald-600',
    down: darkMode ? 'text-red-400' : 'text-red-600',
    neutral: darkMode ? 'text-slate-400' : 'text-gray-500',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {subtitle && <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{subtitle}</p>}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendColors[trend]}`}>
              <TrendIcon size={16} />
              <span className="text-sm">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && <div className="text-current opacity-80">{icon}</div>}
      </div>
    </div>
  );
}
