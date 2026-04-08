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
import {
  getBrandSummaries,
  getRegionSummaries,
  getOverallStats,
  getStoresByHierarchy,
  incidents,
  getIncidentStats,
  type HierarchyFilter,
} from './data/storeService';

function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [filter, setFilter] = useState<HierarchyFilter>({});
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  const filteredStores = getStoresByHierarchy(filter);

  const stats = getOverallStats();
  const brandSummaries = getBrandSummaries();
  const regionSummaries = getRegionSummaries();
  const incidentStats = getIncidentStats();

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
        return <DevicesView stores={filteredStores} stats={stats} brandSummaries={brandSummaries} />;
      case 'incidents':
        return <IncidentsView incidents={incidents} incidentStats={incidentStats} />;
      case 'stores':
        return <StoresView stores={filteredStores} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          incidentCount={incidents.length}
        />
        <main className="flex-1 p-6">
          {currentView !== 'overview' && currentView !== 'incidents' && (
            <div className="mb-6">
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
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
