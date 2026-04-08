import { Wifi, CheckCircle, AlertCircle, XCircle, Router } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Store, RegionSummary } from '../data/mockData';

interface NetworkViewProps {
  stores: Store[];
  regionSummaries: RegionSummary[];
}

export function NetworkView({ stores, regionSummaries }: NetworkViewProps) {
  const online = stores.filter(s => s.networkStatus === 'online').length;
  const degraded = stores.filter(s => s.networkStatus === 'degraded').length;
  const offline = stores.filter(s => s.networkStatus === 'offline').length;
  const total = stores.length;

  const totalSwitches = stores.reduce((acc, s) => acc + s.devices.networkSwitches, 0);
  const switchesOnline = stores.reduce((acc, s) => acc + s.devices.networkSwitchesOnline, 0);

  const pieData = [
    { name: 'Online', value: online, color: '#10b981' },
    { name: 'Degraded', value: degraded, color: '#eab308' },
    { name: 'Offline', value: offline, color: '#ef4444' },
  ];

  const regionData = regionSummaries.map(r => ({
    name: r.region.replace('Canada ', 'CA '),
    health: r.networkOnlinePercent,
  }));

  const problemStores = stores
    .filter(s => s.networkStatus !== 'online')
    .sort((a, _b) => (a.networkStatus === 'offline' ? -1 : 1))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Network Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Network Online"
          value={`${Math.round((online / total) * 100)}%`}
          subtitle={`${online.toLocaleString()} stores`}
          icon={<Wifi size={24} />}
          color="green"
        />
        <StatCard
          title="Healthy"
          value={online.toLocaleString()}
          subtitle="Full connectivity"
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatCard
          title="Degraded"
          value={degraded.toLocaleString()}
          subtitle="Partial connectivity"
          icon={<AlertCircle size={24} />}
          color="yellow"
        />
        <StatCard
          title="Offline"
          value={offline.toLocaleString()}
          subtitle="No connectivity"
          icon={<XCircle size={24} />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Network Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => [Number(value).toLocaleString(), 'Stores']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Network Switches</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Router size={20} className="text-blue-400" />
                  <span className="text-slate-400">Total Switches</span>
                </div>
                <span className="text-white text-2xl font-bold">{totalSwitches.toLocaleString()}</span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className="text-slate-400">Online</span>
                </div>
                <span className="text-emerald-400 text-2xl font-bold">{switchesOnline.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Switch Health</span>
                <span className="text-white">{Math.round((switchesOnline / totalSwitches) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  style={{ width: `${(switchesOnline / totalSwitches) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Network Health by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={regionData}>
            <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}%`, 'Network Health']}
            />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#3b82f6"
              fill="url(#networkGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Stores with Network Issues</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Store</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Region</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Switches</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {problemStores.map(store => (
                <tr key={store.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-white">{store.id}</span>
                      <p className="text-slate-400 text-sm">{store.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{store.region}</td>
                  <td className="py-3 px-4 text-slate-300">{store.city}, {store.state}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={store.networkStatus} />
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {store.devices.networkSwitchesOnline}/{store.devices.networkSwitches}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-sm">
                    {new Date(store.lastUpdated).toLocaleTimeString()}
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
