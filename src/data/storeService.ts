import rawStoresData from './stores.json';
import type { Store, Brand, SystemStatus, DeviceInventory, BrandSummary, RegionSummary, RawStore } from './types';
export * from './types';

function generateStatus(): SystemStatus {
  const rand = Math.random();
  if (rand < 0.85) return 'online';
  if (rand < 0.95) return 'degraded';
  return 'offline';
}

function generateDeviceInventory(): DeviceInventory {
  const posTerminals = Math.floor(Math.random() * 6) + 2;
  const scanners = Math.floor(Math.random() * 8) + 3;
  const printers = Math.floor(Math.random() * 4) + 1;
  const networkSwitches = Math.floor(Math.random() * 3) + 1;

  return {
    posTerminals,
    posOnline: Math.floor(posTerminals * (0.8 + Math.random() * 0.2)),
    scanners,
    scannersOnline: Math.floor(scanners * (0.75 + Math.random() * 0.25)),
    printers,
    printersOnline: Math.floor(printers * (0.7 + Math.random() * 0.3)),
    networkSwitches,
    networkSwitchesOnline: Math.floor(networkSwitches * (0.85 + Math.random() * 0.15)),
  };
}

function generateStores(): Store[] {
  return (rawStoresData as RawStore[]).map(raw => ({
    id: raw.id,
    name: raw.name,
    brand: raw.brand as Brand,
    zone: raw.zone,
    region: raw.region,
    district: raw.district,
    storeType: 'Brick & Mortar',
    storeStatus: 'Open',
    city: raw.city,
    state: raw.state,
    posStatus: generateStatus(),
    networkStatus: generateStatus(),
    devices: generateDeviceInventory(),
    lastUpdated: new Date(Date.now() - Math.random() * 300000).toISOString(),
  }));
}

export const stores = generateStores();

export const regions = [...new Set(stores.map(s => s.region))].sort();

export function getBrandSummaries(): BrandSummary[] {
  const brandList: Brand[] = ['KNG', 'TMW', 'MSP', 'JAB'];
  return brandList.map(brand => {
    const brandStores = stores.filter(s => s.brand === brand);
    const totalDevices = brandStores.reduce((acc, s) => 
      acc + s.devices.posTerminals + s.devices.scanners + s.devices.printers + s.devices.networkSwitches, 0);
    const devicesOnline = brandStores.reduce((acc, s) => 
      acc + s.devices.posOnline + s.devices.scannersOnline + s.devices.printersOnline + s.devices.networkSwitchesOnline, 0);

    return {
      brand,
      totalStores: brandStores.length,
      posOnline: brandStores.filter(s => s.posStatus === 'online').length,
      posDegraded: brandStores.filter(s => s.posStatus === 'degraded').length,
      posOffline: brandStores.filter(s => s.posStatus === 'offline').length,
      networkOnline: brandStores.filter(s => s.networkStatus === 'online').length,
      networkDegraded: brandStores.filter(s => s.networkStatus === 'degraded').length,
      networkOffline: brandStores.filter(s => s.networkStatus === 'offline').length,
      totalDevices,
      devicesOnline,
    };
  });
}

export function getRegionSummaries(): RegionSummary[] {
  return regions.map(region => {
    const regionStores = stores.filter(s => s.region === region);
    const totalStores = regionStores.length;
    
    if (totalStores === 0) return { region, totalStores: 0, posOnlinePercent: 0, networkOnlinePercent: 0, devicesOnlinePercent: 0 };

    const posOnline = regionStores.filter(s => s.posStatus === 'online').length;
    const networkOnline = regionStores.filter(s => s.networkStatus === 'online').length;
    
    const totalDevices = regionStores.reduce((acc, s) => 
      acc + s.devices.posTerminals + s.devices.scanners + s.devices.printers + s.devices.networkSwitches, 0);
    const devicesOnline = regionStores.reduce((acc, s) => 
      acc + s.devices.posOnline + s.devices.scannersOnline + s.devices.printersOnline + s.devices.networkSwitchesOnline, 0);

    return {
      region,
      totalStores,
      posOnlinePercent: Math.round((posOnline / totalStores) * 100),
      networkOnlinePercent: Math.round((networkOnline / totalStores) * 100),
      devicesOnlinePercent: totalDevices > 0 ? Math.round((devicesOnline / totalDevices) * 100) : 0,
    };
  });
}

export function getOverallStats() {
  const totalStores = stores.length;
  const posOnline = stores.filter(s => s.posStatus === 'online').length;
  const posDegraded = stores.filter(s => s.posStatus === 'degraded').length;
  const posOffline = stores.filter(s => s.posStatus === 'offline').length;
  const networkOnline = stores.filter(s => s.networkStatus === 'online').length;
  const networkDegraded = stores.filter(s => s.networkStatus === 'degraded').length;
  const networkOffline = stores.filter(s => s.networkStatus === 'offline').length;

  const totalDevices = stores.reduce((acc, s) => 
    acc + s.devices.posTerminals + s.devices.scanners + s.devices.printers + s.devices.networkSwitches, 0);
  const devicesOnline = stores.reduce((acc, s) => 
    acc + s.devices.posOnline + s.devices.scannersOnline + s.devices.printersOnline + s.devices.networkSwitchesOnline, 0);

  const totalPosTerminals = stores.reduce((acc, s) => acc + s.devices.posTerminals, 0);
  const posTerminalsOnline = stores.reduce((acc, s) => acc + s.devices.posOnline, 0);
  const totalScanners = stores.reduce((acc, s) => acc + s.devices.scanners, 0);
  const scannersOnline = stores.reduce((acc, s) => acc + s.devices.scannersOnline, 0);
  const totalPrinters = stores.reduce((acc, s) => acc + s.devices.printers, 0);
  const printersOnline = stores.reduce((acc, s) => acc + s.devices.printersOnline, 0);
  const totalSwitches = stores.reduce((acc, s) => acc + s.devices.networkSwitches, 0);
  const switchesOnline = stores.reduce((acc, s) => acc + s.devices.networkSwitchesOnline, 0);

  return {
    totalStores,
    totalBrands: 4,
    pos: { online: posOnline, degraded: posDegraded, offline: posOffline },
    network: { online: networkOnline, degraded: networkDegraded, offline: networkOffline },
    devices: { total: totalDevices, online: devicesOnline },
    deviceBreakdown: {
      posTerminals: { total: totalPosTerminals, online: posTerminalsOnline },
      scanners: { total: totalScanners, online: scannersOnline },
      printers: { total: totalPrinters, online: printersOnline },
      networkSwitches: { total: totalSwitches, online: switchesOnline },
    },
  };
}

export function getStoresByFilter(brand?: Brand, region?: string): Store[] {
  return stores.filter(store => {
    if (brand && store.brand !== brand) return false;
    if (region && store.region !== region) return false;
    return true;
  });
}

export function getIncidentStores(): Store[] {
  return stores.filter(s => s.posStatus === 'offline' || s.networkStatus === 'offline' || s.posStatus === 'degraded' || s.networkStatus === 'degraded')
    .sort((a, b) => {
      const aScore = (a.posStatus === 'offline' ? 2 : a.posStatus === 'degraded' ? 1 : 0) + 
                     (a.networkStatus === 'offline' ? 2 : a.networkStatus === 'degraded' ? 1 : 0);
      const bScore = (b.posStatus === 'offline' ? 2 : b.posStatus === 'degraded' ? 1 : 0) + 
                     (b.networkStatus === 'offline' ? 2 : b.networkStatus === 'degraded' ? 1 : 0);
      return bScore - aScore;
    });
}
