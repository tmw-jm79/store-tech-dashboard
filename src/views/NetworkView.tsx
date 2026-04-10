import { Wifi, CheckCircle, AlertCircle, XCircle, Phone, Router } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Store } from '../data/storeService';

interface NetworkViewProps {
  stores: Store[];
  darkMode?: boolean;
}

export function NetworkView({ stores, darkMode = true }: NetworkViewProps) {
  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const innerCardBg = darkMode ? 'bg-slate-700/50' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50';
  const progressBg = darkMode ? 'bg-slate-700' : 'bg-gray-200';
  const axisColor = darkMode ? '#94a3b8' : '#6b7280';

  const online = stores.filter(s => s.networkStatus === 'online').length;
  const degraded = stores.filter(s => s.networkStatus === 'degraded').length;
  const offline = stores.filter(s => s.networkStatus === 'offline').length;
  const total = stores.length;

  const totalSwitches = stores.reduce((acc, s) => acc + s.devices.networkSwitches.total, 0);
  const switchesOnline = stores.reduce((acc, s) => acc + s.devices.networkSwitches.online, 0);

  const totalPhones = stores.reduce((acc, s) => acc + s.devices.desktopPhones.total + s.devices.cordlessPhones.total, 0);
  const phonesOnline = stores.reduce((acc, s) => acc + s.devices.desktopPhones.online + s.devices.cordlessPhones.online, 0);

  const pieData = [
    { name: 'Online', value: online, color: '#10b981' },
    { name: 'Degraded', value: degraded, color: '#eab308' },
    { name: 'Offline', value: offline, color: '#ef4444' },
  ];

  // Calculate region summaries from filtered stores
  const regions = [...new Set(stores.map(s => s.region))].sort();
  const regionData = regions.map(region => {
    const regionStores = stores.filter(s => s.region === region);
    const regionOnline = regionStores.filter(s => s.networkStatus === 'online').length;
    return {
      name: region.replace('Canada ', 'CA '),
      health: regionStores.length > 0 ? Math.round((regionOnline / regionStores.length) * 100) : 0,
    };
  });

  const problemStores = stores
    .filter(s => s.networkStatus !== 'online')
    .sort((a, _b) => (a.networkStatus === 'offline' ? -1 : 1))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${textPrimary}`}>Network Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Network Online" value={`${Math.round((online / total) * 100)}%`} subtitle={`${online.toLocaleString()} stores`} icon={<Wifi size={24} />} color="green" darkMode={darkMode} />
        <StatCard title="Healthy" value={online.toLocaleString()} subtitle="Full connectivity" icon={<CheckCircle size={24} />} color="green" darkMode={darkMode} />
        <StatCard title="Degraded" value={degraded.toLocaleString()} subtitle="Partial connectivity" icon={<AlertCircle size={24} />} color="yellow" darkMode={darkMode} />
        <StatCard title="Offline" value={offline.toLocaleString()} subtitle="No connectivity" icon={<XCircle size={24} />} color="red" darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Network Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, borderRadius: '8px', color: darkMode ? '#fff' : '#111827' }} formatter={(value) => [Number(value).toLocaleString(), 'Stores']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Network Switches</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={`${innerCardBg} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Router size={20} className="text-blue-400" />
                  <span className={textMuted}>Total Switches</span>
                </div>
                <span className={`${textPrimary} text-2xl font-bold`}>{totalSwitches.toLocaleString()}</span>
              </div>
              <div className={`${innerCardBg} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className={textMuted}>Online</span>
                </div>
                <span className="text-emerald-500 text-2xl font-bold">{switchesOnline.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={textMuted}>Switch Health</span>
                <span className={textPrimary}>{totalSwitches > 0 ? Math.round((switchesOnline / totalSwitches) * 100) : 0}%</span>
              </div>
              <div className={`h-3 ${progressBg} rounded-full overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: totalSwitches > 0 ? `${(switchesOnline / totalSwitches) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>VoIP Phones</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={`${innerCardBg} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={20} className="text-purple-400" />
                  <span className={textMuted}>Total Phones</span>
                </div>
                <span className={`${textPrimary} text-2xl font-bold`}>{totalPhones.toLocaleString()}</span>
              </div>
              <div className={`${innerCardBg} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className={textMuted}>Online</span>
                </div>
                <span className="text-emerald-500 text-2xl font-bold">{phonesOnline.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={textMuted}>Phone Connectivity</span>
                <span className={textPrimary}>{totalPhones > 0 ? Math.round((phonesOnline / totalPhones) * 100) : 0}%</span>
              </div>
              <div className={`h-3 ${progressBg} rounded-full overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: totalPhones > 0 ? `${(phonesOnline / totalPhones) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Network Health by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={regionData}>
            <XAxis dataKey="name" stroke={axisColor} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke={axisColor} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, borderRadius: '8px', color: darkMode ? '#fff' : '#111827' }} labelStyle={{ color: darkMode ? '#fff' : '#111827' }} formatter={(value) => [`${value}%`, 'Network Health']} />
            <Area type="monotone" dataKey="health" stroke="#3b82f6" fill="url(#networkGradient)" strokeWidth={2} />
            <defs>
              <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Stores with Network Issues</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Store</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Region</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Location</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Status</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Switches</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {problemStores.map(store => (
                <tr key={store.id} className={`border-b ${borderColor}/50 ${hoverBg}`}>
                  <td className="py-3 px-4">
                    <div>
                      <span className={textPrimary}>{store.id}</span>
                      <p className={`${textMuted} text-sm`}>{store.name}</p>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{store.region}</td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{store.city}, {store.state}</td>
                  <td className="py-3 px-4"><StatusBadge status={store.networkStatus} /></td>
                  <td className={`py-3 px-4 text-right ${textSecondary}`}>{store.devices.networkSwitches.online}/{store.devices.networkSwitches.total}</td>
                  <td className={`py-3 px-4 ${textMuted} text-sm`}>{new Date(store.lastUpdated).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
