import { Monitor, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Store } from '../data/storeService';

interface POSViewProps {
  stores: Store[];
}

export function POSView({ stores }: POSViewProps) {
  const online = stores.filter(s => s.posStatus === 'online').length;
  const degraded = stores.filter(s => s.posStatus === 'degraded').length;
  const offline = stores.filter(s => s.posStatus === 'offline').length;
  const total = stores.length;

  const totalTerminals = stores.reduce((acc, s) => acc + s.devices.posTerminals, 0);
  const terminalsOnline = stores.reduce((acc, s) => acc + s.devices.posOnline, 0);

  const pieData = [
    { name: 'Online', value: online, color: '#10b981' },
    { name: 'Degraded', value: degraded, color: '#eab308' },
    { name: 'Offline', value: offline, color: '#ef4444' },
  ];

  const problemStores = stores
    .filter(s => s.posStatus !== 'online')
    .sort((a, _b) => (a.posStatus === 'offline' ? -1 : 1))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">POS System Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stores"
          value={total.toLocaleString()}
          subtitle="Monitored locations"
          icon={<Monitor size={24} />}
          color="blue"
        />
        <StatCard
          title="Online"
          value={online.toLocaleString()}
          subtitle={`${Math.round((online / total) * 100)}% of stores`}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatCard
          title="Degraded"
          value={degraded.toLocaleString()}
          subtitle={`${Math.round((degraded / total) * 100)}% of stores`}
          icon={<AlertCircle size={24} />}
          color="yellow"
        />
        <StatCard
          title="Offline"
          value={offline.toLocaleString()}
          subtitle={`${Math.round((offline / total) * 100)}% of stores`}
          icon={<XCircle size={24} />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">POS Status Distribution</h3>
          <div className="flex items-center justify-center">
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
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">POS Terminals</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Terminals</span>
              <span className="text-white text-2xl font-bold">{totalTerminals.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Online</span>
              <span className="text-emerald-400 text-2xl font-bold">{terminalsOnline.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Offline/Issues</span>
              <span className="text-red-400 text-2xl font-bold">{(totalTerminals - terminalsOnline).toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Terminal Health</span>
                <span className="text-white">{Math.round((terminalsOnline / totalTerminals) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: `${(terminalsOnline / totalTerminals) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Stores with POS Issues</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Store</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Brand</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Terminals</th>
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
                  <td className="py-3 px-4 text-slate-300">{store.brand}</td>
                  <td className="py-3 px-4 text-slate-300">{store.city}, {store.state}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={store.posStatus} />
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {store.devices.posOnline}/{store.devices.posTerminals}
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
