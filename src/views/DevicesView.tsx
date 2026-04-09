import { Monitor, Tablet, CreditCard, Receipt, Printer, Laptop, Barcode, DollarSign, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { Store, BrandSummary } from '../data/storeService';

interface DevicesViewProps {
  stores: Store[];
  brandSummaries: BrandSummary[];
  darkMode?: boolean;
}

export function DevicesView({ stores, brandSummaries, darkMode = true }: DevicesViewProps) {
  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const innerCardBg = darkMode ? 'bg-slate-700/50' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50';
  const progressBg = darkMode ? 'bg-slate-600' : 'bg-gray-200';
  const axisColor = darkMode ? '#94a3b8' : '#6b7280';

  const deviceBreakdown = {
    posComputers: { total: 0, online: 0 },
    iPads: { total: 0, online: 0 },
    pinPads: { total: 0, online: 0 },
    receiptPrinters: { total: 0, online: 0 },
    laserPrinters: { total: 0, online: 0 },
    chromebooks: { total: 0, online: 0 },
    desktopPhones: { total: 0, online: 0 },
    cordlessPhones: { total: 0, online: 0 },
    averyMarkdownScanners: { total: 0 },
    tailoringPrinters: { total: 0 },
    barcodeScanners: { total: 0 },
    cashDrawers: { total: 0 },
    monitors: { total: 0 },
  };

  stores.forEach(s => {
    deviceBreakdown.posComputers.total += s.devices.posComputers.total;
    deviceBreakdown.posComputers.online += s.devices.posComputers.online;
    deviceBreakdown.iPads.total += s.devices.iPads.total;
    deviceBreakdown.iPads.online += s.devices.iPads.online;
    deviceBreakdown.pinPads.total += s.devices.pinPads.total;
    deviceBreakdown.pinPads.online += s.devices.pinPads.online;
    deviceBreakdown.receiptPrinters.total += s.devices.receiptPrinters.total;
    deviceBreakdown.receiptPrinters.online += s.devices.receiptPrinters.online;
    deviceBreakdown.laserPrinters.total += s.devices.laserPrinters.total;
    deviceBreakdown.laserPrinters.online += s.devices.laserPrinters.online;
    deviceBreakdown.chromebooks.total += s.devices.chromebooks.total;
    deviceBreakdown.chromebooks.online += s.devices.chromebooks.online;
    deviceBreakdown.desktopPhones.total += s.devices.desktopPhones.total;
    deviceBreakdown.desktopPhones.online += s.devices.desktopPhones.online;
    deviceBreakdown.cordlessPhones.total += s.devices.cordlessPhones.total;
    deviceBreakdown.cordlessPhones.online += s.devices.cordlessPhones.online;
    deviceBreakdown.averyMarkdownScanners.total += s.devices.averyMarkdownScanners.total;
    deviceBreakdown.tailoringPrinters.total += s.devices.tailoringPrinters.total;
    deviceBreakdown.barcodeScanners.total += s.devices.barcodeScanners.total;
    deviceBreakdown.cashDrawers.total += s.devices.cashDrawers.total;
    deviceBreakdown.monitors.total += s.devices.monitors.total;
  });

  const totalNetworked = deviceBreakdown.posComputers.total + deviceBreakdown.iPads.total + deviceBreakdown.pinPads.total + deviceBreakdown.receiptPrinters.total + deviceBreakdown.laserPrinters.total + deviceBreakdown.chromebooks.total + deviceBreakdown.desktopPhones.total + deviceBreakdown.cordlessPhones.total;
  const networkedOnline = deviceBreakdown.posComputers.online + deviceBreakdown.iPads.online + deviceBreakdown.pinPads.online + deviceBreakdown.receiptPrinters.online + deviceBreakdown.laserPrinters.online + deviceBreakdown.chromebooks.online + deviceBreakdown.desktopPhones.online + deviceBreakdown.cordlessPhones.online;
  const totalPassive = deviceBreakdown.averyMarkdownScanners.total + deviceBreakdown.tailoringPrinters.total + deviceBreakdown.barcodeScanners.total + deviceBreakdown.cashDrawers.total + deviceBreakdown.monitors.total;

  const devices = { totalNetworked, networkedOnline, totalPassive, total: totalNetworked + totalPassive };

  const networkedDevices = [
    { name: 'POS Computers', key: 'posComputers', icon: <Monitor size={20} />, ...deviceBreakdown.posComputers, color: '#3b82f6' },
    { name: 'iPads', key: 'iPads', icon: <Tablet size={20} />, ...deviceBreakdown.iPads, color: '#8b5cf6' },
    { name: 'Pin Pads', key: 'pinPads', icon: <CreditCard size={20} />, ...deviceBreakdown.pinPads, color: '#ec4899' },
    { name: 'Receipt Printers', key: 'receiptPrinters', icon: <Receipt size={20} />, ...deviceBreakdown.receiptPrinters, color: '#14b8a6' },
    { name: 'Laser Printers', key: 'laserPrinters', icon: <Printer size={20} />, ...deviceBreakdown.laserPrinters, color: '#f97316' },
    { name: 'Chromebooks', key: 'chromebooks', icon: <Laptop size={20} />, ...deviceBreakdown.chromebooks, color: '#06b6d4' },
  ];

  const passiveDevices = [
    { name: 'Avery Markdown Scanners', key: 'averyMarkdownScanners', icon: <Barcode size={20} />, total: deviceBreakdown.averyMarkdownScanners.total, color: '#64748b' },
    { name: 'Tailoring Printers', key: 'tailoringPrinters', icon: <Printer size={20} />, total: deviceBreakdown.tailoringPrinters.total, color: '#78716c' },
    { name: 'Barcode Scanners', key: 'barcodeScanners', icon: <Barcode size={20} />, total: deviceBreakdown.barcodeScanners.total, color: '#71717a' },
    { name: 'Cash Drawers', key: 'cashDrawers', icon: <DollarSign size={20} />, total: deviceBreakdown.cashDrawers.total, color: '#737373' },
    { name: 'Monitors', key: 'monitors', icon: <Monitor size={20} />, total: deviceBreakdown.monitors.total, color: '#6b7280' },
  ];

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
      <h2 className={`text-xl font-semibold ${textPrimary}`}>Device Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Devices" value={devices.total.toLocaleString()} subtitle="All device types" icon={<HardDrive size={24} />} color="blue" darkMode={darkMode} />
        <StatCard title="Networked Devices" value={devices.totalNetworked.toLocaleString()} subtitle={`${devices.networkedOnline.toLocaleString()} online (${Math.round((devices.networkedOnline / devices.totalNetworked) * 100)}%)`} icon={<Wifi size={24} />} color="green" darkMode={darkMode} />
        <StatCard title="Passive Devices" value={devices.totalPassive.toLocaleString()} subtitle="No connectivity status" icon={<WifiOff size={24} />} color="gray" darkMode={darkMode} />
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4 flex items-center gap-2`}>
          <Wifi size={20} className="text-emerald-400" />
          Networked Devices (Online/Offline Status)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {networkedDevices.map(device => (
            <div key={device.key} className={`${innerCardBg} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: device.color }}>{device.icon}</span>
                <span className={`${textPrimary} font-medium`}>{device.name}</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary} mb-1`}>{device.total.toLocaleString()}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-500">{device.online.toLocaleString()} online</span>
                <span className={textMuted}>{device.total > 0 ? `${Math.round((device.online / device.total) * 100)}%` : '0%'}</span>
              </div>
              <div className={`h-2 ${progressBg} rounded-full overflow-hidden mt-2`}>
                <div className="h-full rounded-full transition-all" style={{ width: device.total > 0 ? `${(device.online / device.total) * 100}%` : '0%', backgroundColor: device.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4 flex items-center gap-2`}>
          <WifiOff size={20} className={textMuted} />
          Passive Devices (Count Only)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {passiveDevices.map(device => (
            <div key={device.key} className={`${innerCardBg} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: device.color }}>{device.icon}</span>
                <span className={`${textPrimary} font-medium text-sm`}>{device.name}</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>{device.total.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Key Devices by Brand</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={brandDeviceData}>
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, borderRadius: '8px', color: darkMode ? '#fff' : '#111827' }} labelStyle={{ color: darkMode ? '#fff' : '#111827' }} />
            <Legend />
            <Bar dataKey="posComputers" name="POS Computers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iPads" name="iPads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pinPads" name="Pin Pads" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="phones" name="Phones" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Device Summary by Brand</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Brand</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Stores</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Total Devices</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Networked Online</th>
                <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>Health %</th>
              </tr>
            </thead>
            <tbody>
              {brandSummaries.map(brand => (
                <tr key={brand.brand} className={`border-b ${borderColor}/50 ${hoverBg}`}>
                  <td className={`py-3 px-4 ${textPrimary}`}>{brand.brand}</td>
                  <td className={`py-3 px-4 text-right ${textSecondary}`}>{brand.totalStores}</td>
                  <td className={`py-3 px-4 text-right ${textSecondary}`}>{brand.totalDevices.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-500">{brand.devicesOnline.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={brand.devicesOnline / brand.totalDevices >= 0.9 ? 'text-emerald-500' : brand.devicesOnline / brand.totalDevices >= 0.8 ? 'text-yellow-500' : 'text-red-500'}>
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
