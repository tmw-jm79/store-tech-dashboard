import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, type View } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { OverviewView } from './views/OverviewView';
import { POSView } from './views/POSView';
import { NetworkView } from './views/NetworkView';
import { DevicesView } from './views/DevicesView';
import { IncidentsView } from './views/IncidentsView';
import { StoresView } from './views/StoresView';
import { MapView } from './views/MapView';
import {
  getBrandSummaries,
  getRegionSummaries,
  getOverallStats,
  getStoresByHierarchy,
  incidents,
  type HierarchyFilter,
} from './data/storeService';

function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [filter, setFilter] = useState<HierarchyFilter>({});
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  const filteredStores = getStoresByHierarchy(filter);
  
  // Filter incidents based on hierarchy
  const filteredIncidents = incidents.filter(incident => {
    if (filter.brand && incident.brand !== filter.brand) return false;
    // For zone/region/district/store filtering, we need to check against store data
    if (filter.storeId && incident.storeId !== filter.storeId) return false;
    if (filter.zone || filter.region || filter.district) {
      const store = filteredStores.find(s => s.id === incident.storeId);
      if (!store) return false;
    }
    return true;
  });

  const stats = getOverallStats();
  const brandSummaries = getBrandSummaries();
  const regionSummaries = getRegionSummaries();
  
  // Calculate incident stats based on filtered incidents
  const filteredIncidentStats = {
    total: filteredIncidents.length,
    byCategory: (['Accounts and Access', 'Application', 'Hardware', 'Miscellaneous', 'Network', 'Security', 'Software'] as const).map(category => ({
      category,
      count: filteredIncidents.filter(i => i.category === category).length,
    })),
    byPriority: {
      Critical: filteredIncidents.filter(i => i.priority === 'Critical').length,
      High: filteredIncidents.filter(i => i.priority === 'High').length,
      Medium: filteredIncidents.filter(i => i.priority === 'Medium').length,
      Low: filteredIncidents.filter(i => i.priority === 'Low').length,
    },
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <OverviewView
            stats={stats}
            brandSummaries={brandSummaries}
            regionSummaries={regionSummaries}
            incidentCount={incidents.length}
          />
        );
      case 'pos':
        return <POSView stores={filteredStores} />;
      case 'network':
        return <NetworkView stores={filteredStores} regionSummaries={regionSummaries} />;
      case 'devices':
        return <DevicesView stores={filteredStores} brandSummaries={brandSummaries} />;
      case 'incidents':
        return <IncidentsView incidents={filteredIncidents} incidentStats={filteredIncidentStats} />;
      case 'stores':
        return <StoresView stores={filteredStores} />;
      case 'map':
        return <MapView stores={filteredStores} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <Header 
        lastUpdated={lastUpdated} 
        onRefresh={handleRefresh} 
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          incidentCount={incidents.length}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          darkMode={darkMode}
        />
        <main className="flex-1 p-6">
          {currentView !== 'overview' && (
            <div className="mb-6">
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                darkMode={darkMode}
              />
            </div>
          )}
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
