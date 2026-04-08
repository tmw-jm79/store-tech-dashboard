import { Monitor, Tablet, CreditCard, Receipt, Printer, Laptop, Barcode, DollarSign, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { Store, BrandSummary } from '../data/storeService';

interface DevicesViewProps {
  stores: Store[];
  stats: {
    devices: {
      totalNetworked: number;
      networkedOnline: number;
      totalPassive: number;
      total: number;
    };
    deviceBreakdown: {
      posComputers: { total: number; online: number };
      iPads: { total: number; online: number };
      pinPads: { total: number; online: number };
      receiptPrinters: { total: number; online: number };
      laserPrinters: { total: number; online: number };
      chromebooks: { total: number; online: number };
      desktopPhones: { total: number; online: number };
      cordlessPhones: { total: number; online: number };
      averyMarkdownScanners: { total: number };
      tailoringPrinters: { total: number };
      barcodeScanners: { total: number };
      cashDrawers: { total: number };
      monitors: { total: number };
    };
  };
  brandSummaries: BrandSummary[];
}

export function DevicesView({ stores, stats, brandSummaries }: DevicesViewProps) {
  const { deviceBreakdown, devices } = stats;

  // Networked devices (have online/offline status) - excludes network switches and phones (shown in Network Health)
  const networkedDevices = [
    { name: 'POS Computers', key: 'posComputers', icon: <Monitor size={20} />, ...deviceBreakdown.posComputers, color: '#3b82f6' },
    { name: 'iPads', key: 'iPads', icon: <Tablet size={20} />, ...deviceBreakdown.iPads, color: '#8b5cf6' },
    { name: 'Pin Pads', key: 'pinPads', icon: <CreditCard size={20} />, ...deviceBreakdown.pinPads, color: '#ec4899' },
    { name: 'Receipt Printers', key: 'receiptPrinters', icon: <Receipt size={20} />, ...deviceBreakdown.receiptPrinters, color: '#14b8a6' },
    { name: 'Laser Printers', key: 'laserPrinters', icon: <Printer size={20} />, ...deviceBreakdown.laserPrinters, color: '#f97316' },
    { name: 'Chromebooks', key: 'chromebooks', icon: <Laptop size={20} />, ...deviceBreakdown.chromebooks, color: '#06b6d4' },
  ];

  // Passive devices (count only, no online/offline status)
  const passiveDevices = [
    { name: 'Avery Markdown Scanners', key: 'averyMarkdownScanners', icon: <Barcode size={20} />, total: deviceBreakdown.averyMarkdownScanners.total, color: '#64748b' },
    { name: 'Tailoring Printers', key: 'tailoringPrinters', icon: <Printer size={20} />, total: deviceBreakdown.tailoringPrinters.total, color: '#78716c' },
    { name: 'Barcode Scanners', key: 'barcodeScanners', icon: <Barcode size={20} />, total: deviceBreakdown.barcodeScanners.total, color: '#71717a' },
    { name: 'Cash Drawers', key: 'cashDrawers', icon: <DollarSign size={20} />, total: deviceBreakdown.cashDrawers.total, color: '#737373' },
    { name: 'Monitors', key: 'monitors', icon: <Monitor size={20} />, total: deviceBreakdown.monitors.total, color: '#6b7280' },
  ];

  // Brand device data for chart
  const brandDeviceData = brandSummaries.map(b => {
    const brandStores = stores.filter(s => s.brand === b.brand);
    return {
      name: b.brand,
      posComputers: brandStores.reduce((acc, s) => acc + s.devices.posComputers.total, 0),
      iPads: brandStores.reduce((acc, s) => acc + s.devices.iPads.total, 0),
      pinPads: brandStores.reduce((acc, s) => acc + s.devices.pinPads.total, 0),
      phones: brandStores.reduce((acc, s) => acc + s.devices.desktopPhones.total + s.devices.cordlessPhones.total, 0),
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Device Inventory</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Devices"
          value={devices.total.toLocaleString()}
          subtitle="All device types"
          icon={<HardDrive size={24} />}
          color="blue"
        />
        <StatCard
          title="Networked Devices"
          value={devices.totalNetworked.toLocaleString()}
          subtitle={`${devices.networkedOnline.toLocaleString()} online (${Math.round((devices.networkedOnline / devices.totalNetworked) * 100)}%)`}
          icon={<Wifi size={24} />}
          color="green"
        />
        <StatCard
          title="Passive Devices"
          value={devices.totalPassive.toLocaleString()}
          subtitle="No connectivity status"
          icon={<WifiOff size={24} />}
          color="gray"
        />
      </div>

      {/* Networked Devices Section */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Wifi size={20} className="text-emerald-400" />
          Networked Devices (Online/Offline Status)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {networkedDevices.map(device => (
            <div key={device.key} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: device.color }}>{device.icon}</span>
                <span className="text-white font-medium">{device.name}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {device.total.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-400">{device.online.toLocaleString()} online</span>
                <span className="text-slate-400">
                  {device.total > 0 ? `${Math.round((device.online / device.total) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: device.total > 0 ? `${(device.online / device.total) * 100}%` : '0%',
                    backgroundColor: device.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passive Devices Section */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <WifiOff size={20} className="text-slate-400" />
          Passive Devices (Count Only)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {passiveDevices.map(device => (
            <div key={device.key} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: device.color }}>{device.icon}</span>
                <span className="text-white font-medium text-sm">{device.name}</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {device.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Devices by Brand Chart */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Key Devices by Brand</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={brandDeviceData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="posComputers" name="POS Computers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iPads" name="iPads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pinPads" name="Pin Pads" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="phones" name="Phones" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Brand Summary Table */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Device Summary by Brand</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Brand</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Stores</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Total Devices</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Networked Online</th>
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
                      {brand.totalDevices > 0 ? Math.round((brand.devicesOnline / brand.totalDevices) * 100) : 0}%
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
