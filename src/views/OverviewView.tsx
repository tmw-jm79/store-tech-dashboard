import { Monitor, Wifi, HardDrive, Store, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { BrandSummary, RegionSummary } from '../data/mockData';

interface OverviewViewProps {
  stats: {
    totalStores: number;
    totalBrands: number;
    pos: { online: number; degraded: number; offline: number };
    network: { online: number; degraded: number; offline: number };
    devices: { total: number; online: number };
  };
  brandSummaries: BrandSummary[];
  regionSummaries: RegionSummary[];
  incidentCount: number;
}

export function OverviewView({ stats, brandSummaries, regionSummaries, incidentCount }: OverviewViewProps) {
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
      <h2 className="text-xl font-semibold text-white">Operations Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Stores"
          value={stats.totalStores.toLocaleString()}
          subtitle={`${stats.totalBrands} brands`}
          icon={<Store size={24} />}
          color="blue"
        />
        <StatCard
          title="POS Online"
          value={`${Math.round((stats.pos.online / stats.totalStores) * 100)}%`}
          subtitle={`${stats.pos.online.toLocaleString()} stores`}
          icon={<Monitor size={24} />}
          color="green"
        />
        <StatCard
          title="Network Online"
          value={`${Math.round((stats.network.online / stats.totalStores) * 100)}%`}
          subtitle={`${stats.network.online.toLocaleString()} stores`}
          icon={<Wifi size={24} />}
          color="green"
        />
        <StatCard
          title="Devices Online"
          value={`${Math.round((stats.devices.online / stats.devices.total) * 100)}%`}
          subtitle={`${stats.devices.online.toLocaleString()} of ${stats.devices.total.toLocaleString()}`}
          icon={<HardDrive size={24} />}
          color="purple"
        />
        <StatCard
          title="Active Incidents"
          value={incidentCount}
          subtitle="Requires attention"
          icon={<AlertTriangle size={24} />}
          color={incidentCount > 50 ? 'red' : incidentCount > 20 ? 'yellow' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">POS System Status</h3>
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
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-semibold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Network Status</h3>
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
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-semibold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Health by Brand</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brandChartData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="posOnline" name="POS Online %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="networkOnline" name="Network Online %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Regional Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Region</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Stores</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">POS Online</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Network Online</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Devices Online</th>
              </tr>
            </thead>
            <tbody>
              {regionSummaries.map(region => (
                <tr key={region.region} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{region.region}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{region.totalStores}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.posOnlinePercent >= 90 ? 'text-emerald-400' : region.posOnlinePercent >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                      {region.posOnlinePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.networkOnlinePercent >= 90 ? 'text-emerald-400' : region.networkOnlinePercent >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                      {region.networkOnlinePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={region.devicesOnlinePercent >= 90 ? 'text-emerald-400' : region.devicesOnlinePercent >= 80 ? 'text-yellow-400' : 'text-red-400'}>
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
