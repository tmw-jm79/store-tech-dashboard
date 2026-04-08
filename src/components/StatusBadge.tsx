import type { SystemStatus } from '../data/mockData';

interface StatusBadgeProps {
  status: SystemStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    online: { label: 'Online', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    degraded: { label: 'Degraded', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', dotColor: 'bg-yellow-400' },
    offline: { label: 'Offline', bgColor: 'bg-red-500/20', textColor: 'text-red-400', dotColor: 'bg-red-400' },
  };

  const sizeConfig = {
    sm: { padding: 'px-2 py-0.5', text: 'text-xs', dot: 'w-1.5 h-1.5' },
    md: { padding: 'px-2.5 py-1', text: 'text-sm', dot: 'w-2 h-2' },
    lg: { padding: 'px-3 py-1.5', text: 'text-base', dot: 'w-2.5 h-2.5' },
  };

  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bgColor} ${config.textColor} ${sizes.padding} ${sizes.text} font-medium`}>
      <span className={`${sizes.dot} rounded-full ${config.dotColor} animate-pulse`}></span>
      {config.label}
    </span>
  );
}
