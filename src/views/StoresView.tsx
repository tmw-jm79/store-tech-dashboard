import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import type { Store } from '../data/storeService';

interface StoresViewProps {
  stores: Store[];
  onSelectStore?: (storeId: string) => void;
  darkMode?: boolean;
}

export function StoresView({ stores, onSelectStore, darkMode = true }: StoresViewProps) {
  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300';
  const headerBg = darkMode ? 'bg-slate-800' : 'bg-gray-50';
  const btnBg = darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'brand' | 'region'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 25;

  const filteredStores = useMemo(() => {
    let result = [...stores];
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(s => 
        s.id.toLowerCase().includes(searchLower) ||
        s.name.toLowerCase().includes(searchLower) ||
        s.brand.toLowerCase().includes(searchLower) ||
        s.city.toLowerCase().includes(searchLower) ||
        s.state.toLowerCase().includes(searchLower) ||
        s.region.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [stores, search, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredStores.length / pageSize);
  const paginatedStores = filteredStores.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortHeader = ({ column, label }: { column: typeof sortBy; label: string }) => (
    <th 
      className={`text-left py-3 px-4 ${textMuted} font-medium cursor-pointer ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
      onClick={() => handleSort(column)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortBy === column && (
          <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${textPrimary}`}>All Stores</h2>
        <span className={textMuted}>{filteredStores.length.toLocaleString()} stores</span>
      </div>

      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={20} />
        <input
          type="text"
          placeholder="Search by ID, name, brand, city, state, or region..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={`w-full ${inputBg} ${textPrimary} rounded-lg pl-10 pr-4 py-3 border focus:border-blue-500 focus:outline-none`}
        />
      </div>

      <div className={`rounded-xl border ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={headerBg}>
              <tr className={`border-b ${borderColor}`}>
                <SortHeader column="id" label="Store ID" />
                <SortHeader column="name" label="Name" />
                <SortHeader column="brand" label="Brand" />
                <SortHeader column="region" label="Region" />
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Location</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>POS</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Network</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Devices</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStores.map(store => (
                <tr 
                  key={store.id} 
                  className={`border-b ${borderColor}/50 ${hoverBg} ${onSelectStore ? 'cursor-pointer' : ''}`}
                  onClick={() => onSelectStore?.(store.id)}
                >
                  <td className="py-3 px-4 text-blue-500 font-mono hover:text-blue-400">{store.id}</td>
                  <td className={`py-3 px-4 ${textSecondary} max-w-[200px] truncate`}>{store.name}</td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{store.brand}</td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{store.region}</td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{store.city}, {store.state}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={store.posStatus} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={store.networkStatus} size="sm" />
                  </td>
                  <td className={`py-3 px-4 text-right ${textSecondary}`}>
                    {store.devices.posComputers.total + store.devices.iPads.total + store.devices.pinPads.total + 
                     store.devices.receiptPrinters.total + store.devices.laserPrinters.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`flex items-center justify-between px-4 py-3 ${headerBg} border-t ${borderColor}`}>
          <span className={`${textMuted} text-sm`}>
            Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredStores.length)} of {filteredStores.length.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg ${btnBg} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronLeft size={20} />
            </button>
            <span className={`${textPrimary} px-3`}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg ${btnBg} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
