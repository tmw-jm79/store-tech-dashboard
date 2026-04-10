import { useState } from 'react';
import { AlertTriangle, AlertCircle, XCircle, Key, AppWindow, HardDrive, HelpCircle, Wifi, Shield, Code, ChevronLeft, ChevronRight } from 'lucide-react';
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
  darkMode?: boolean;
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
  Critical: 'bg-red-500/20 text-red-500',
  High: 'bg-orange-500/20 text-orange-500',
  Medium: 'bg-yellow-500/20 text-yellow-600',
  Low: 'bg-blue-500/20 text-blue-500',
};

const priorityIcons: Record<IncidentPriority, React.ReactNode> = {
  Critical: <XCircle size={14} />,
  High: <AlertTriangle size={14} />,
  Medium: <AlertCircle size={14} />,
  Low: <AlertCircle size={14} />,
};

const statusColors: Record<IncidentStatus, string> = {
  'New': 'bg-blue-500/20 text-blue-500',
  'In Progress': 'bg-emerald-500/20 text-emerald-500',
  'Pending': 'bg-yellow-500/20 text-yellow-600',
  'On Hold': 'bg-slate-500/20 text-slate-500',
};

export function IncidentsView({ incidents, incidentStats, darkMode = true }: IncidentsViewProps) {
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const cardBg = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm';
  const innerCardBg = darkMode ? 'bg-slate-700/30' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50';
  const axisColor = darkMode ? '#94a3b8' : '#6b7280';
  const headerBg = darkMode ? 'bg-slate-800' : 'bg-gray-50';
  const btnBg = darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200';

  const { byCategory, byPriority } = incidentStats;

  const totalPages = Math.ceil(incidents.length / pageSize);
  const paginatedIncidents = incidents.slice((page - 1) * pageSize, page * pageSize);

  const chartData = byCategory.map(item => ({
    name: item.category,
    count: item.count,
    color: categoryColors[item.category],
  }));

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${textPrimary}`}>Open Incidents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Open" value={incidentStats.total} subtitle="All categories" icon={<AlertTriangle size={24} />} color="blue" darkMode={darkMode} />
        <StatCard title="Critical" value={byPriority.Critical} subtitle="Immediate attention" icon={<XCircle size={24} />} color="red" darkMode={darkMode} />
        <StatCard title="High" value={byPriority.High} subtitle="Urgent priority" icon={<AlertTriangle size={24} />} color="yellow" darkMode={darkMode} />
        <StatCard title="Medium" value={byPriority.Medium} subtitle="Standard priority" icon={<AlertCircle size={24} />} color="purple" darkMode={darkMode} />
        <StatCard title="Low" value={byPriority.Low} subtitle="When available" icon={<AlertCircle size={24} />} color="green" darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Incidents by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" stroke={axisColor} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke={axisColor} width={120} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`, borderRadius: '8px', color: darkMode ? '#fff' : '#111827' }} labelStyle={{ color: darkMode ? '#fff' : '#111827' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-xl p-6 border ${cardBg}`}>
          <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Category Summary</h3>
          <div className="space-y-3">
            {byCategory.map(item => (
              <div key={item.category} className={`flex items-center justify-between p-3 ${innerCardBg} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <span style={{ color: categoryColors[item.category] }}>{categoryIcons[item.category]}</span>
                  <span className={textSecondary}>{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${textPrimary} font-semibold`}>{item.count}</span>
                  <span className={`${textMuted} text-sm`}>({Math.round((item.count / incidentStats.total) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 border ${cardBg}`}>
        <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Incident List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Store ID</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Incident ID</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Incident Summary</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Priority</th>
                <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.map(incident => (
                <tr key={incident.id} className={`border-b ${borderColor}/50 ${hoverBg}`}>
                  <td className={`py-3 px-4 ${textPrimary} font-medium`}>{incident.storeId}</td>
                  <td className={`py-3 px-4 ${textSecondary} font-mono text-sm`}>{incident.id}</td>
                  <td className={`py-3 px-4 ${textSecondary}`}>{incident.summary}</td>
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
        
        <div className={`flex items-center justify-between px-4 py-3 ${headerBg} border-t ${borderColor} rounded-b-lg -mx-6 -mb-6 mt-4`}>
          <span className={`${textMuted} text-sm`}>
            Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, incidents.length)} of {incidents.length} incidents
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg ${btnBg} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronLeft size={20} />
            </button>
            <span className={`${textPrimary} px-3`}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg ${btnBg} ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
