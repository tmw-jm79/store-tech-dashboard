import { useState, useRef, useEffect } from 'react';
import { Search, Store, AlertTriangle, X } from 'lucide-react';
import type { Store as StoreType, Incident } from '../data/storeService';

interface SearchResult {
  type: 'store' | 'incident';
  storeId: string;
  title: string;
  subtitle: string;
  priority?: string;
}

interface GlobalSearchProps {
  stores: StoreType[];
  incidents: Incident[];
  onSelectStore: (storeId: string) => void;
  darkMode: boolean;
}

export function GlobalSearch({ stores, incidents, onSelectStore, darkMode }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchResult[] = [];

  if (query.length >= 2) {
    const q = query.toLowerCase();

    // Search stores
    const matchingStores = stores
      .filter(s => 
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        `${s.city}, ${s.state}`.toLowerCase().includes(q)
      )
      .slice(0, 5);

    matchingStores.forEach(store => {
      results.push({
        type: 'store',
        storeId: store.id,
        title: `${store.id} - ${store.name}`,
        subtitle: `${store.city}, ${store.state} • ${store.brand}`,
      });
    });

    // Search incidents
    const matchingIncidents = incidents
      .filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.storeId.toLowerCase().includes(q)
      )
      .slice(0, 5);

    matchingIncidents.forEach(incident => {
      results.push({
        type: 'incident',
        storeId: incident.storeId,
        title: `${incident.id} - ${incident.summary}`,
        subtitle: `Store: ${incident.storeId} • ${incident.category}`,
        priority: incident.priority,
      });
    });
  }

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelectStore(result.storeId);
    setQuery('');
    setIsOpen(false);
  };

  const priorityColors: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-500',
    High: 'bg-orange-500/20 text-orange-500',
    Medium: 'bg-yellow-500/20 text-yellow-600',
    Low: 'bg-blue-500/20 text-blue-500',
  };

  const inputBg = darkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-gray-300';
  const inputText = darkMode ? 'text-white placeholder-slate-400' : 'text-gray-900 placeholder-gray-500';
  const dropdownBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const hoverBg = darkMode ? 'bg-slate-700' : 'bg-gray-100';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-gray-500';

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search stores, incidents..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-64 ${inputBg} ${inputText} rounded-lg pl-10 pr-8 py-2 border focus:border-blue-500 focus:outline-none text-sm`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${textSecondary} hover:${textPrimary}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${dropdownBg} border rounded-lg shadow-lg overflow-hidden z-50`}>
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.storeId}-${index}`}
              onClick={() => handleSelect(result)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedIndex ? hoverBg : ''
              } hover:${hoverBg}`}
            >
              <div className={`mt-0.5 ${result.type === 'store' ? 'text-blue-500' : 'text-orange-500'}`}>
                {result.type === 'store' ? <Store size={18} /> : <AlertTriangle size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${textPrimary} text-sm font-medium truncate`}>{result.title}</div>
                <div className={`${textSecondary} text-xs truncate`}>{result.subtitle}</div>
              </div>
              {result.priority && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[result.priority]}`}>
                  {result.priority}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${dropdownBg} border rounded-lg shadow-lg p-4 z-50`}>
          <p className={`${textSecondary} text-sm text-center`}>No results found</p>
        </div>
      )}
    </div>
  );
}
