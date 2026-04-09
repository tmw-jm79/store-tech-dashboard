import { RefreshCw, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
}

export function Header({ lastUpdated, onRefresh }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <div>
            <h1 className="text-2xl font-bold text-white">Store Tech Operations Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time operations monitoring across all brands and locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
            title="Refresh data"
          >
            <RefreshCw size={20} />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
