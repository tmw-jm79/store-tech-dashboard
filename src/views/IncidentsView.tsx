import { AlertTriangle, AlertCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Store } from '../data/mockData';

interface IncidentsViewProps {
  incidentStores: Store[];
}

export function IncidentsView({ incidentStores }: IncidentsViewProps) {
  const criticalCount = incidentStores.filter(s => s.posStatus === 'offline' || s.networkStatus === 'offline').length;
  const warningCount = incidentStores.filter(s => 
    (s.posStatus === 'degraded' && s.networkStatus !== 'offline') || 
    (s.networkStatus === 'degraded' && s.posStatus !== 'offline')
  ).length;

  const posOffline = incidentStores.filter(s => s.posStatus === 'offline').length;
  const networkOffline = incidentStores.filter(s => s.networkStatus === 'offline').length;
  const bothOffline = incidentStores.filter(s => s.posStatus === 'offline' && s.networkStatus === 'offline').length;

  const getSeverity = (store: Store): 'critical' | 'warning' => {
    if (store.posStatus === 'offline' || store.networkStatus === 'offline') return 'critical';
    return 'warning';
  };

  const getIssueDescription = (store: Store): string => {
    const issues: string[] = [];
    if (store.posStatus === 'offline') issues.push('POS Offline');
    else if (store.posStatus === 'degraded') issues.push('POS Degraded');
    if (store.networkStatus === 'offline') issues.push('Network Offline');
    else if (store.networkStatus === 'degraded') issues.push('Network Degraded');
    return issues.join(', ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Active Incidents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={incidentStores.length}
          subtitle="Stores affected"
          icon={<AlertTriangle size={24} />}
          color="red"
        />
        <StatCard
          title="Critical"
          value={criticalCount}
          subtitle="Systems offline"
          icon={<XCircle size={24} />}
          color="red"
        />
        <StatCard
          title="Warnings"
          value={warningCount}
          subtitle="Degraded performance"
          icon={<AlertCircle size={24} />}
          color="yellow"
        />
        <StatCard
          title="Both Systems Down"
          value={bothOffline}
          subtitle="POS + Network offline"
          icon={<AlertTriangle size={24} />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="text-red-400" size={24} />
            <h3 className="text-lg font-medium text-white">POS Offline</h3>
          </div>
          <p className="text-4xl font-bold text-red-400">{posOffline}</p>
          <p className="text-slate-400 mt-2">Stores unable to process transactions</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="text-red-400" size={24} />
            <h3 className="text-lg font-medium text-white">Network Offline</h3>
          </div>
          <p className="text-4xl font-bold text-red-400">{networkOffline}</p>
          <p className="text-slate-400 mt-2">Stores with no connectivity</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-purple-400" size={24} />
            <h3 className="text-lg font-medium text-white">Full Outage</h3>
          </div>
          <p className="text-4xl font-bold text-purple-400">{bothOffline}</p>
          <p className="text-slate-400 mt-2">Both systems completely down</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Incident List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Store</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Brand</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Issue</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">POS</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Network</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {incidentStores.slice(0, 50).map(store => {
                const severity = getSeverity(store);
                return (
                  <tr key={store.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                        severity === 'critical' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {severity === 'critical' ? <XCircle size={14} /> : <AlertCircle size={14} />}
                        {severity === 'critical' ? 'Critical' : 'Warning'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-white font-medium">{store.id}</span>
                        <p className="text-slate-400 text-sm truncate max-w-[200px]">{store.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{store.brand}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin size={14} className="text-slate-500" />
                        {store.city}, {store.state}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{getIssueDescription(store)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={store.posStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={store.networkStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock size={14} />
                        {new Date(store.lastUpdated).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {incidentStores.length > 50 && (
          <p className="text-slate-400 text-sm mt-4 text-center">
            Showing 50 of {incidentStores.length} incidents
          </p>
        )}
      </div>
    </div>
  );
}
