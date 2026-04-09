import { LayoutDashboard, Monitor, Wifi, HardDrive, AlertTriangle, Store, Map } from 'lucide-react';

type View = 'overview' | 'pos' | 'network' | 'devices' | 'incidents' | 'stores' | 'map';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  incidentCount: number;
}

export function Sidebar({ currentView, onViewChange, incidentCount }: SidebarProps) {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'pos', label: 'POS Systems', icon: <Monitor size={20} /> },
    { id: 'network', label: 'Network Health', icon: <Wifi size={20} /> },
    { id: 'devices', label: 'Device Inventory', icon: <HardDrive size={20} /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={20} /> },
    { id: 'stores', label: 'All Stores', icon: <Store size={20} /> },
    { id: 'map', label: 'Store Map', icon: <Map size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'incidents' && incidentCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {incidentCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export type { View };
