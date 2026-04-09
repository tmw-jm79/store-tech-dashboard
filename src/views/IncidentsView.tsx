import { AlertTriangle, AlertCircle, XCircle, Key, AppWindow, HardDrive, HelpCircle, Wifi, Shield, Code } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatCard } from '../components/StatCard';
import type { Incident, IncidentCategory, IncidentPriority, IncidentStatus } from '../data/storeService';

interface IncidentsViewProps {
  incidents: Incident[];
  incidentStats: {
    total: number;
    byCategory: { category: IncidentCategory; count: number }[];
    byPriority: Record<IncidentPriority, number>;
  };
}

const categoryIcons: Record<IncidentCategory, React.ReactNode> = {
  'Accounts and Access': <Key size={20} />,
  'Application': <AppWindow size={20} />,
  'Hardware': <HardDrive size={20} />,
  'Miscellaneous': <HelpCircle size={20} />,
  'Network': <Wifi size={20} />,
  'Security': <Shield size={20} />,
  'Software': <Code size={20} />,
};

const categoryColors: Record<IncidentCategory, string> = {
  'Accounts and Access': '#3b82f6',
  'Application': '#8b5cf6',
  'Hardware': '#f97316',
  'Miscellaneous': '#6b7280',
  'Network': '#06b6d4',
  'Security': '#ef4444',
  'Software': '#84cc16',
};

const priorityColors: Record<IncidentPriority, string> = {
  Critical: 'bg-red-500/20 text-red-400',
  High: 'bg-orange-500/20 text-orange-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-blue-500/20 text-blue-400',
};

const priorityIcons: Record<IncidentPriority, React.ReactNode> = {
  Critical: <XCircle size={14} />,
  High: <AlertTriangle size={14} />,
  Medium: <AlertCircle size={14} />,
  Low: <AlertCircle size={14} />,
};

const statusColors: Record<IncidentStatus, string> = {
  'New': 'bg-blue-500/20 text-blue-400',
  'In Progress': 'bg-emerald-500/20 text-emerald-400',
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'On Hold': 'bg-slate-500/20 text-slate-400',
};

export function IncidentsView({ incidents, incidentStats }: IncidentsViewProps) {
  const { byCategory, byPriority } = incidentStats;

  const chartData = byCategory.map(item => ({
    name: item.category,
    count: item.count,
    color: categoryColors[item.category],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Open Incidents</h2>

      {/* Priority summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Open"
          value={incidentStats.total}
          subtitle="All categories"
          icon={<AlertTriangle size={24} />}
          color="blue"
        />
        <StatCard
          title="Critical"
          value={byPriority.Critical}
          subtitle="Immediate attention"
          icon={<XCircle size={24} />}
          color="red"
        />
        <StatCard
          title="High"
          value={byPriority.High}
          subtitle="Urgent priority"
          icon={<AlertTriangle size={24} />}
          color="yellow"
        />
        <StatCard
          title="Medium"
          value={byPriority.Medium}
          subtitle="Standard priority"
          icon={<AlertCircle size={24} />}
          color="purple"
        />
        <StatCard
          title="Low"
          value={byPriority.Low}
          subtitle="When available"
          icon={<AlertCircle size={24} />}
          color="green"
        />
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Incidents by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Category Summary</h3>
          <div className="space-y-3">
            {byCategory.map(item => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span style={{ color: categoryColors[item.category] }}>
                    {categoryIcons[item.category]}
                  </span>
                  <span className="text-slate-300">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{item.count}</span>
                  <span className="text-slate-500 text-sm">
                    ({Math.round((item.count / incidentStats.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident grid */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Incident List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Store ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Incident ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Incident Summary</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 50).map(incident => (
                <tr key={incident.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white font-medium">{incident.storeId}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-sm">{incident.id}</td>
                  <td className="py-3 px-4 text-slate-300">{incident.summary}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${priorityColors[incident.priority]}`}>
                      {priorityIcons[incident.priority]}
                      {incident.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[incident.status]}`}>
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {incidents.length > 50 && (
          <p className="text-slate-400 text-sm mt-4 text-center">
            Showing 50 of {incidents.length} open incidents
          </p>
        )}
      </div>
    </div>
  );
}
