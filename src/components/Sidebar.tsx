import { LayoutDashboard, Monitor, Wifi, HardDrive, AlertTriangle, Store, Map, ChevronLeft, ChevronRight } from 'lucide-react';

type View = 'overview' | 'pos' | 'network' | 'devices' | 'incidents' | 'stores' | 'map';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  incidentCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
}

export function Sidebar({ currentView, onViewChange, incidentCount, collapsed, onToggleCollapse, darkMode }: SidebarProps) {
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
    <aside className={`${collapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'} border-r min-h-screen transition-all duration-300 relative`}>
      <button
        onClick={onToggleCollapse}
        className={`absolute -right-3 top-6 p-1 rounded-full z-10 ${
          darkMode 
            ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600' 
            : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-300 shadow-sm'
        } border`}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      <nav className={`${collapsed ? 'p-2' : 'p-4'}`}>
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.id === 'incidents' && incidentCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {incidentCount}
                  </span>
                )}
                {collapsed && item.id === 'incidents' && incidentCount > 0 && (
                  <span className="absolute right-1 top-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
