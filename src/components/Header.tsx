import { RefreshCw, Bell, Settings, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ lastUpdated, onRefresh, darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className={`h-[67px] ${!darkMode ? 'invert' : ''}`} />
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Store Tech Operations Dashboard</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Real-time operations monitoring across all brands and locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onRefresh}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Refresh data"
          >
            <RefreshCw size={20} />
          </button>
          <button className={`p-2 rounded-lg transition-colors relative ${
            darkMode 
              ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
