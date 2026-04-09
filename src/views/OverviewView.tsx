import { Monitor, Wifi, HardDrive, Store, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { BrandSummary, RegionSummary } from '../data/storeService';

interface OverviewViewProps {
  stats: {
    totalStores: number;
    totalBrands: number;
    pos: { online: number; degraded: number; offline: number };
    network: { online: number; degraded: number; offline: number };
    devices: { 
      totalNetworked: number;
      networkedOnline: number;
      totalPassive: number;
      total: number;
    };
  };
  brandSummaries: BrandSummary[];
  regionSummaries: RegionSummary[];
  incidentCount: number;
  darkMode?: boolean;
}

export function OverviewView({ stats, brandSummaries, regionSummaries, incidentCount, darkMode = true }: OverviewViewProps) {
  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50';
  const posData = [
    { name: 'Online', value: stats.pos.online, color: '#10b981' },
    { name: 'Degraded', value: stats.pos.degraded, color: '#eab308' },
    { name: 'Offline', value: stats.pos.offline, color: '#ef4444' },
  ];

  const networkData = [
    { name: 'Online', value: stats.network.online, color: '#10b981' },
    { name: 'Degraded', value: stats.network.degraded, color: '#eab308' },
    { name: 'Offline', value: stats.network.offline, color: '#ef4444' },
  ];

  const brandChartData = brandSummaries.map(b => ({
    name: b.brand.split(' ')[0],
    stores: b.totalStores,
    posOnline: Math.round((b.posOnline / b.totalStores) * 100),
    networkOnline: Math.round((b.networkOnline / b.totalStores) * 100),
  }));

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${textPrimary}`}>Operations Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Stores"
          value={stats.totalStores.toLocaleString()}
          subtitle={`${stats.totalBrands} brands`}
          icon={<Store size={24} />}
          color="blue"
          darkMode={darkMode}
        />
        <StatCard
          title="POS Online"
          value={`${Math.round((stats.pos.online / stats.totalStores) * 100)}%`}
          subtitle={`${stats.pos.online.toLocaleString()} stores`}
          icon={<Monitor size={24} />}
          color="green"
          darkMode={darkMode}
        />
        <StatCard
          title="Network Online"
          value={`${Math.round((stats.network.online / stats.totalStores) * 100)}%`}
          subtitle={`${stats.network.online.toLocaleString()} stores`}
          icon={<Wifi size={24} />}
          color="green"
          darkMode={darkMode}
        />
        <StatCard
          title="Devices Online"
          value={`${Math.round((stats.devices.networkedOnline / stats.devices.totalNetworked) * 100)}%`}
          subtitle={`${stats.devices.networkedOnline.toLocaleString()} of ${stats.devices.totalNetworked.toLocaleString()} networked`}
          icon={<HardDrive size={24} />}
          color="purple"
          darkMode={darkMode}
        />
        <StatCard
          title="Active Incidents"
          value={incidentCount}
          subtitle="Requires attention"
          icon={<AlertTriangle size={24} />}
          color={incidentCount > 50 ? 'red' : incidentCount > 20 ? 'yellow' : 'green'}
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>POS System Status</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={posData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {posData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {posData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={textSecondary}>{item.name}</span>
                  <span className={`${textPrimary} font-semibold`}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Network Status</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={networkData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {networkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {networkData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={textSecondary}>{item.name}</span>
                  <span className={`${textPrimary} font-semibold`}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Health by Brand</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brandChartData}>
            <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#94a3b8' : '#6b7280'} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
                border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, 
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#111827'
              }}
              labelStyle={{ color: darkMode ? '#fff' : '#111827' }}
            />
            <Legend />
            <Bar dataKey="posOnline" name="POS Online %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="networkOnline" name="Network Online %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Regional Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Region</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Stores</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>POS Online</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Network Online</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Devices Online</th>
              </tr>
            </thead>
            <tbody>
              {regionSummaries.map(region => (
                <tr key={region.region} className={`border-b ${borderColor}/50 ${hoverBg}`}>
                  <td className={`py-3 px-4 ${textPrimary}`}>{region.region}</td>
                  <td className={`py-3 px-4 text-right ${textSecondary}`}>{region.totalStores}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.posOnlinePercent >= 90 ? 'text-emerald-500' : region.posOnlinePercent >= 80 ? 'text-yellow-500' : 'text-red-500'}>
                      {region.posOnlinePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.networkOnlinePercent >= 90 ? 'text-emerald-500' : region.networkOnlinePercent >= 80 ? 'text-yellow-500' : 'text-red-500'}>
                      {region.networkOnlinePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.devicesOnlinePercent >= 90 ? 'text-emerald-500' : region.devicesOnlinePercent >= 80 ? 'text-yellow-500' : 'text-red-500'}>
                      {region.devicesOnlinePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
