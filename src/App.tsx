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
  getIncidentStores,
  getStoresByFilter,
  type Brand,
  type Region,
} from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  const filteredStores = getStoresByFilter(
    selectedBrand === 'all' ? undefined : selectedBrand,
    selectedRegion === 'all' ? undefined : selectedRegion
  );

  const stats = getOverallStats();
  const brandSummaries = getBrandSummaries();
  const regionSummaries = getRegionSummaries();
  const incidentStores = getIncidentStores();

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <OverviewView
            stats={stats}
            brandSummaries={brandSummaries}
            regionSummaries={regionSummaries}
            incidentCount={incidentStores.length}
          />
        );
      case 'pos':
        return <POSView stores={filteredStores} brandSummaries={brandSummaries} />;
      case 'network':
        return <NetworkView stores={filteredStores} regionSummaries={regionSummaries} />;
      case 'devices':
        return <DevicesView stores={filteredStores} stats={stats} brandSummaries={brandSummaries} />;
      case 'incidents':
        return <IncidentsView incidentStores={incidentStores} />;
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
          incidentCount={incidentStores.length}
        />
        <main className="flex-1 p-6">
          {currentView !== 'overview' && currentView !== 'incidents' && (
            <div className="mb-6">
              <FilterBar
                selectedBrand={selectedBrand}
                selectedRegion={selectedRegion}
                onBrandChange={setSelectedBrand}
                onRegionChange={setSelectedRegion}
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
