import { ArrowLeft, MapPin, User, Monitor, Wifi, Package, AlertTriangle } from 'lucide-react';
import type { Store, Incident } from '../data/storeService';
import { brandNames } from '../data/types';

interface StoreDetailViewProps {
  store: Store;
  incidents: Incident[];
  onBack: () => void;
}

function StatusBadge({ status }: { status: 'online' | 'degraded' | 'offline' }) {
  const colors = {
    online: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
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

export function StoreDetailView({ store, incidents, onBack }: StoreDetailViewProps) {
  const health = getOverallHealth(store);
  const healthColors = {
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const storeIncidents = incidents.filter(i => i.storeId === store.id);

  // Calculate device totals
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
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to list</span>
      </button>

      {/* Store Header */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{store.id}</h1>
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${healthColors[health.status]}`}>
                {health.label}
              </span>
            </div>
            <h2 className="text-xl text-slate-300 mb-4">{store.name}</h2>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} />
                <span>{store.city}, {store.state}</span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Brand:</span> {brandNames[store.brand]}
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Type:</span> {store.storeType}
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Status:</span> {store.storeStatus}
              </div>
            </div>
          </div>
          {store.managerName && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <User size={16} />
                <span className="text-sm">Store Manager</span>
              </div>
              <div className="text-white font-medium">{store.managerName}</div>
              {store.managerShortName && (
                <div className="text-slate-500 text-sm">{store.managerShortName}</div>
              )}
            </div>
          )}
        </div>

        {/* Hierarchy */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="text-sm text-slate-500 mb-2">Hierarchy</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded">Zone: {store.zone}</span>
            <span className="text-slate-600">→</span>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded">Region: {store.region}</span>
            <span className="text-slate-600">→</span>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded">District: {store.district}</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">POS System</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <StatusBadge status={store.posStatus} />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={20} className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Network</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <StatusBadge status={store.networkStatus} />
          </div>
        </div>
      </div>

      {/* Device Inventory */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Device Inventory</h3>
          <span className="text-slate-500 text-sm ml-auto">
            {totalOnline}/{totalNetworked} networked online • {totalPassive} passive
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Networked Devices */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-3">Networked Devices</h4>
            <div className="space-y-2">
              {networkedDevices.filter(d => d.total > 0).map(device => (
                <div key={device.name} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                  <span className="text-slate-300">{device.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${device.online === device.total ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {device.online}/{device.total}
                    </span>
                    <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${device.online === device.total ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(device.online / device.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passive Devices */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-3">Passive Devices</h4>
            <div className="space-y-2">
              {passiveDevices.filter(d => d.total > 0).map(device => (
                <div key={device.name} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                  <span className="text-slate-300">{device.name}</span>
                  <span className="text-slate-400">{device.total}</span>
                </div>
              ))}
              {passiveDevices.every(d => d.total === 0) && (
                <div className="text-slate-500 text-sm">No passive devices</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Open Incidents */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Open Incidents</h3>
          {storeIncidents.length > 0 && (
            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-sm">
              {storeIncidents.length}
            </span>
          )}
        </div>

        {storeIncidents.length === 0 ? (
          <div className="text-slate-500 text-center py-8">No open incidents for this store</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Summary</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {storeIncidents.map(incident => (
                  <tr key={incident.id} className="border-b border-slate-700/50">
                    <td className="py-3 pr-4 text-slate-300 font-mono text-sm">{incident.id}</td>
                    <td className="py-3 pr-4 text-slate-300">{incident.summary}</td>
                    <td className="py-3 pr-4 text-slate-400 text-sm">{incident.category}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        incident.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        incident.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        incident.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        incident.status === 'New' ? 'bg-blue-500/20 text-blue-400' :
                        incident.status === 'In Progress' ? 'bg-purple-500/20 text-purple-400' :
                        incident.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Location */}
      {store.latitude !== 0 && store.longitude !== 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Location</h3>
          </div>
          <div className="text-slate-400 text-sm">
            Coordinates: {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-slate-500 text-sm text-right">
        Last updated: {new Date(store.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
