import { ArrowLeft, MapPin, User, Monitor, Wifi, Package, AlertTriangle } from 'lucide-react';
import type { Store, Incident } from '../data/storeService';
import { brandNames } from '../data/types';

interface StoreDetailViewProps {
  store: Store;
  incidents: Incident[];
  onBack: () => void;
  darkMode?: boolean;
}

function StatusBadge({ status }: { status: 'online' | 'degraded' | 'offline' }) {
  const colors = {
    online: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    offline: 'bg-red-500/20 text-red-500 border-red-500/30',
  };
  return (
    <span className={`px-2 py-1 rounded border text-sm font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function getOverallHealth(store: Store): { status: 'healthy' | 'warning' | 'critical'; label: string } {
  if (store.posStatus === 'offline' || store.networkStatus === 'offline') {
    return { status: 'critical', label: 'Critical' };
  }
  if (store.posStatus === 'degraded' || store.networkStatus === 'degraded') {
    return { status: 'warning', label: 'Warning' };
  }
  return { status: 'healthy', label: 'Healthy' };
}

export function StoreDetailView({ store, incidents, onBack, darkMode = true }: StoreDetailViewProps) {
  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const innerCardBg = darkMode ? 'bg-slate-700/50' : 'bg-gray-50';
  const innerCardBg2 = darkMode ? 'bg-slate-700/30' : 'bg-gray-100';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const textMuted2 = darkMode ? 'text-slate-500' : 'text-gray-400';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const tagBg = darkMode ? 'bg-slate-700' : 'bg-gray-200';
  const progressBg = darkMode ? 'bg-slate-600' : 'bg-gray-200';

  const health = getOverallHealth(store);
  const healthColors = {
    healthy: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    critical: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  const storeIncidents = incidents.filter(i => i.storeId === store.id);

  const networkedDevices = [
    { name: 'POS Computers', ...store.devices.posComputers },
    { name: 'iPads', ...store.devices.iPads },
    { name: 'Pin Pads', ...store.devices.pinPads },
    { name: 'Receipt Printers', ...store.devices.receiptPrinters },
    { name: 'Laser Printers', ...store.devices.laserPrinters },
    { name: 'Chromebooks', ...store.devices.chromebooks },
    { name: 'Desktop Phones', ...store.devices.desktopPhones },
    { name: 'Cordless Phones', ...store.devices.cordlessPhones },
    { name: 'Network Switches', ...store.devices.networkSwitches },
  ];

  const passiveDevices = [
    { name: 'Barcode Scanners', total: store.devices.barcodeScanners.total },
    { name: 'Cash Drawers', total: store.devices.cashDrawers.total },
    { name: 'Monitors', total: store.devices.monitors.total },
    { name: 'Avery Scanners', total: store.devices.averyMarkdownScanners.total },
    { name: 'Tailoring Printers', total: store.devices.tailoringPrinters.total },
  ];

  const totalNetworked = networkedDevices.reduce((sum, d) => sum + d.total, 0);
  const totalOnline = networkedDevices.reduce((sum, d) => sum + d.online, 0);
  const totalPassive = passiveDevices.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className={`flex items-center gap-2 ${textMuted} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>
        <ArrowLeft size={20} />
        <span>Back to list</span>
      </button>

      <div className={`rounded-xl border p-6 ${cardBg}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold ${textPrimary}`}>{store.id}</h1>
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${healthColors[health.status]}`}>{health.label}</span>
            </div>
            <h2 className={`text-xl ${textSecondary} mb-4`}>{store.name}</h2>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className={`flex items-center gap-2 ${textMuted}`}>
                <MapPin size={16} />
                <span>{store.city}, {store.state}</span>
              </div>
              <div className={textMuted}><span className={textMuted2}>Brand:</span> {brandNames[store.brand]}</div>
              <div className={textMuted}><span className={textMuted2}>Type:</span> {store.storeType}</div>
              <div className={textMuted}><span className={textMuted2}>Status:</span> {store.storeStatus}</div>
            </div>
          </div>
          {store.managerName && (
            <div className={`${innerCardBg} rounded-lg p-4`}>
              <div className={`flex items-center gap-2 ${textMuted} mb-1`}>
                <User size={16} />
                <span className="text-sm">Store Manager</span>
              </div>
              <div className={`${textPrimary} font-medium`}>{store.managerName}</div>
              {store.managerShortName && <div className={`${textMuted2} text-sm`}>{store.managerShortName}</div>}
            </div>
          )}
        </div>

        <div className={`mt-6 pt-6 border-t ${borderColor}`}>
          <div className={`text-sm ${textMuted2} mb-2`}>Hierarchy</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className={`${tagBg} ${textSecondary} px-3 py-1 rounded`}>Zone: {store.zone}</span>
            <span className={textMuted2}>→</span>
            <span className={`${tagBg} ${textSecondary} px-3 py-1 rounded`}>Region: {store.region}</span>
            <span className={textMuted2}>→</span>
            <span className={`${tagBg} ${textSecondary} px-3 py-1 rounded`}>District: {store.district}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl border p-6 ${cardBg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={20} className="text-blue-400" />
            <h3 className={`text-lg font-semibold ${textPrimary}`}>POS System</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className={textMuted}>Status</span>
            <StatusBadge status={store.posStatus} />
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${cardBg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={20} className="text-purple-400" />
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Network</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className={textMuted}>Status</span>
            <StatusBadge status={store.networkStatus} />
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-6 ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-emerald-400" />
          <h3 className={`text-lg font-semibold ${textPrimary}`}>Device Inventory</h3>
          <span className={`${textMuted2} text-sm ml-auto`}>{totalOnline}/{totalNetworked} networked online • {totalPassive} passive</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className={`text-sm font-medium ${textMuted} mb-3`}>Networked Devices</h4>
            <div className="space-y-2">
              {networkedDevices.filter(d => d.total > 0).map(device => (
                <div key={device.name} className={`flex items-center justify-between ${innerCardBg2} rounded-lg px-3 py-2`}>
                  <span className={textSecondary}>{device.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${device.online === device.total ? 'text-emerald-500' : 'text-yellow-500'}`}>{device.online}/{device.total}</span>
                    <div className={`w-16 h-2 ${progressBg} rounded-full overflow-hidden`}>
                      <div className={`h-full ${device.online === device.total ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${(device.online / device.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-medium ${textMuted} mb-3`}>Passive Devices</h4>
            <div className="space-y-2">
              {passiveDevices.filter(d => d.total > 0).map(device => (
                <div key={device.name} className={`flex items-center justify-between ${innerCardBg2} rounded-lg px-3 py-2`}>
                  <span className={textSecondary}>{device.name}</span>
                  <span className={textMuted}>{device.total}</span>
                </div>
              ))}
              {passiveDevices.every(d => d.total === 0) && <div className={`${textMuted2} text-sm`}>No passive devices</div>}
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-6 ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-orange-400" />
          <h3 className={`text-lg font-semibold ${textPrimary}`}>Open Incidents</h3>
          {storeIncidents.length > 0 && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-sm">{storeIncidents.length}</span>}
        </div>

        {storeIncidents.length === 0 ? (
          <div className={`${textMuted2} text-center py-8`}>No open incidents for this store</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left ${textMuted} text-sm border-b ${borderColor}`}>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Summary</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {storeIncidents.map(incident => (
                  <tr key={incident.id} className={`border-b ${borderColor}/50`}>
                    <td className={`py-3 pr-4 ${textSecondary} font-mono text-sm`}>{incident.id}</td>
                    <td className={`py-3 pr-4 ${textSecondary}`}>{incident.summary}</td>
                    <td className={`py-3 pr-4 ${textMuted} text-sm`}>{incident.category}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        incident.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                        incident.priority === 'High' ? 'bg-orange-500/20 text-orange-500' :
                        incident.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-slate-500/20 text-slate-500'
                      }`}>{incident.priority}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        incident.status === 'New' ? 'bg-blue-500/20 text-blue-500' :
                        incident.status === 'In Progress' ? 'bg-purple-500/20 text-purple-500' :
                        incident.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-slate-500/20 text-slate-500'
                      }`}>{incident.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {store.latitude !== 0 && store.longitude !== 0 && (
        <div className={`rounded-xl border p-6 ${cardBg}`}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-blue-400" />
            <h3 className={`text-lg font-semibold ${textPrimary}`}>Location</h3>
          </div>
          <div className={`${textMuted} text-sm`}>Coordinates: {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</div>
        </div>
      )}

      <div className={`${textMuted2} text-sm text-right`}>Last updated: {new Date(store.lastUpdated).toLocaleString()}</div>
    </div>
  );
}
