import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { Store } from '../data/storeService';
import { defaultCenter, defaultZoom } from '../data/coordinates';

import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  stores: Store[];
}

// Component to handle map bounds based on visible stores
function MapBounds({ stores }: { stores: Store[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (stores.length > 0) {
      const bounds = stores.map(s => [s.latitude, s.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stores, map]);
  
  return null;
}

function getStatusColor(store: Store): string {
  if (store.posStatus === 'offline' || store.networkStatus === 'offline') {
    return '#ef4444'; // red
  }
  if (store.posStatus === 'degraded' || store.networkStatus === 'degraded') {
    return '#eab308'; // yellow
  }
  return '#10b981'; // green
}

function getStatusLabel(store: Store): string {
  if (store.posStatus === 'offline' || store.networkStatus === 'offline') {
    return 'Critical';
  }
  if (store.posStatus === 'degraded' || store.networkStatus === 'degraded') {
    return 'Warning';
  }
  return 'Healthy';
}

export function MapView({ stores }: MapViewProps) {
  // Filter stores with valid coordinates
  const storesWithCoords = stores.filter(s => s.latitude !== 0 && s.longitude !== 0);

  // Count stores by status
  const healthyCount = stores.filter(s => s.posStatus === 'online' && s.networkStatus === 'online').length;
  const warningCount = stores.filter(s => 
    (s.posStatus === 'degraded' || s.networkStatus === 'degraded') && 
    s.posStatus !== 'offline' && s.networkStatus !== 'offline'
  ).length;
  const criticalCount = stores.filter(s => s.posStatus === 'offline' || s.networkStatus === 'offline').length;
  const unmappedCount = stores.length - storesWithCoords.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Store Map</h2>
      
      {/* Legend */}
      <div className="bg-slate-800/50 rounded-lg p-4 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-slate-300">Healthy ({healthyCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-slate-300">Warning ({warningCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-slate-300">Critical ({criticalCount})</span>
        </div>
        {unmappedCount > 0 && (
          <div className="text-slate-500 text-sm">
            ({unmappedCount} stores not shown - coordinates unavailable)
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {storesWithCoords.length > 0 && <MapBounds stores={storesWithCoords} />}
          {storesWithCoords.map(store => (
            <CircleMarker
              key={store.id}
              center={[store.latitude, store.longitude]}
              radius={8}
              fillColor={getStatusColor(store)}
              color={getStatusColor(store)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-lg">{store.id}</div>
                  <div className="text-gray-600 mb-2">{store.name}</div>
                  <div className="text-sm text-gray-500 mb-2">
                    {store.city}, {store.state}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Brand:</span> {store.brand}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Status:</span>{' '}
                    <span style={{ color: getStatusColor(store), fontWeight: 'bold' }}>
                      {getStatusLabel(store)}
                    </span>
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">POS:</span>{' '}
                    <span className={
                      store.posStatus === 'online' ? 'text-green-600' :
                      store.posStatus === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {store.posStatus}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Network:</span>{' '}
                    <span className={
                      store.networkStatus === 'online' ? 'text-green-600' :
                      store.networkStatus === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {store.networkStatus}
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
