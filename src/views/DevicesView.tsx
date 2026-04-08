import { Monitor, Scan, Printer, Router, HardDrive } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { Store, BrandSummary } from '../data/mockData';

interface DevicesViewProps {
  stores: Store[];
  stats: {
    deviceBreakdown: {
      posTerminals: { total: number; online: number };
      scanners: { total: number; online: number };
      printers: { total: number; online: number };
      networkSwitches: { total: number; online: number };
    };
  };
  brandSummaries: BrandSummary[];
}

export function DevicesView({ stores, stats, brandSummaries }: DevicesViewProps) {
  const { deviceBreakdown } = stats;
  const totalDevices = Object.values(deviceBreakdown).reduce((acc, d) => acc + d.total, 0);
  const onlineDevices = Object.values(deviceBreakdown).reduce((acc, d) => acc + d.online, 0);

  const deviceTypes = [
    { name: 'POS Terminals', icon: <Monitor size={20} />, ...deviceBreakdown.posTerminals, color: '#3b82f6' },
    { name: 'Scanners', icon: <Scan size={20} />, ...deviceBreakdown.scanners, color: '#8b5cf6' },
    { name: 'Printers', icon: <Printer size={20} />, ...deviceBreakdown.printers, color: '#ec4899' },
    { name: 'Network Switches', icon: <Router size={20} />, ...deviceBreakdown.networkSwitches, color: '#14b8a6' },
  ];

  const pieData = deviceTypes.map(d => ({
    name: d.name,
    value: d.total,
    color: d.color,
  }));

  const brandDeviceData = brandSummaries.map(b => {
    const brandStores = stores.filter(s => s.brand === b.brand);
    return {
      name: b.brand.split(' ')[0],
      posTerminals: brandStores.reduce((acc, s) => acc + s.devices.posTerminals, 0),
      scanners: brandStores.reduce((acc, s) => acc + s.devices.scanners, 0),
      printers: brandStores.reduce((acc, s) => acc + s.devices.printers, 0),
      switches: brandStores.reduce((acc, s) => acc + s.devices.networkSwitches, 0),
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Device Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Devices"
          value={totalDevices.toLocaleString()}
          subtitle={`${onlineDevices.toLocaleString()} online`}
          icon={<HardDrive size={24} />}
          color="blue"
        />
        {deviceTypes.map(device => (
          <StatCard
            key={device.name}
            title={device.name}
            value={device.total.toLocaleString()}
            subtitle={`${Math.round((device.online / device.total) * 100)}% online`}
            icon={device.icon}
            color={device.online / device.total >= 0.9 ? 'green' : device.online / device.total >= 0.8 ? 'yellow' : 'red'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => [Number(value).toLocaleString(), 'Devices']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Device Health by Type</h3>
          <div className="space-y-4">
            {deviceTypes.map(device => (
              <div key={device.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ color: device.color }}>{device.icon}</span>
                    <span className="text-slate-300">{device.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">{device.online.toLocaleString()}</span>
                    <span className="text-slate-400"> / {device.total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(device.online / device.total) * 100}%`,
                      backgroundColor: device.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Devices by Brand</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={brandDeviceData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="posTerminals" name="POS Terminals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scanners" name="Scanners" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="printers" name="Printers" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="switches" name="Switches" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Device Summary by Store</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Brand</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Stores</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Total Devices</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Online</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Health %</th>
              </tr>
            </thead>
            <tbody>
              {brandSummaries.map(brand => (
                <tr key={brand.brand} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{brand.brand}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{brand.totalStores}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{brand.totalDevices.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{brand.devicesOnline.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={
                      brand.devicesOnline / brand.totalDevices >= 0.9 ? 'text-emerald-400' :
                      brand.devicesOnline / brand.totalDevices >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {Math.round((brand.devicesOnline / brand.totalDevices) * 100)}%
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
