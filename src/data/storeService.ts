import rawStoresData from './stores.json';
import type { Store, Brand, SystemStatus, DeviceInventory, BrandSummary, RegionSummary, RawStore, NetworkedDevice, PassiveDevice } from './types';
import { fleetTotalsByBrand, storeCountsByBrand } from './types';
export * from './types';

function generateStatus(): SystemStatus {
  const rand = Math.random();
  if (rand < 0.85) return 'online';
  if (rand < 0.95) return 'degraded';
  return 'offline';
}

function generateNetworkedDevice(fleetTotal: number, storeCount: number): NetworkedDevice {
  if (fleetTotal === 0) return { total: 0, online: 0 };
  
  const average = fleetTotal / storeCount;
  // Add some variance: +/- 20% of average
  const variance = average * 0.2;
  const total = Math.max(0, Math.round(average + (Math.random() * 2 - 1) * variance));
  
  // Online percentage: 85% base + up to 10% variance, some degraded/offline
  const onlinePercent = 0.85 + Math.random() * 0.1;
  const online = Math.round(total * onlinePercent);
  
  return { total, online };
}

function generatePassiveDevice(fleetTotal: number, storeCount: number): PassiveDevice {
  if (fleetTotal === 0) return { total: 0 };
  
  const average = fleetTotal / storeCount;
  const variance = average * 0.2;
  const total = Math.max(0, Math.round(average + (Math.random() * 2 - 1) * variance));
  
  return { total };
}

function generateDeviceInventory(brand: Brand): DeviceInventory {
  const fleet = fleetTotalsByBrand[brand];
  const storeCount = storeCountsByBrand[brand];

  return {
    // Networked devices
    posComputers: generateNetworkedDevice(fleet.posComputers, storeCount),
    iPads: generateNetworkedDevice(fleet.iPads, storeCount),
    pinPads: generateNetworkedDevice(fleet.pinPads, storeCount),
    receiptPrinters: generateNetworkedDevice(fleet.receiptPrinters, storeCount),
    laserPrinters: generateNetworkedDevice(fleet.laserPrinters, storeCount),
    chromebooks: generateNetworkedDevice(fleet.chromebooks, storeCount),
    desktopPhones: generateNetworkedDevice(fleet.desktopPhones, storeCount),
    cordlessPhones: generateNetworkedDevice(fleet.cordlessPhones, storeCount),
    
    // Passive devices
    averyMarkdownScanners: generatePassiveDevice(fleet.averyMarkdownScanners, storeCount),
    tailoringPrinters: generatePassiveDevice(fleet.tailoringPrinters, storeCount),
    barcodeScanners: generatePassiveDevice(fleet.barcodeScanners, storeCount),
    cashDrawers: generatePassiveDevice(fleet.cashDrawers, storeCount),
    monitors: generatePassiveDevice(fleet.monitors, storeCount),
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
    devices: generateDeviceInventory(raw.brand as Brand),
    lastUpdated: new Date(Date.now() - Math.random() * 300000).toISOString(),
  }));
}

export const stores = generateStores();

export const regions = [...new Set(stores.map(s => s.region))].sort();

// Hierarchy helpers: Brand → Zone → Region → District → Store
export function getZonesByBrand(brand?: Brand): string[] {
  const filtered = brand ? stores.filter(s => s.brand === brand) : stores;
  return [...new Set(filtered.map(s => s.zone))].sort();
}

export function getRegionsByZone(zone?: string): string[] {
  const filtered = zone ? stores.filter(s => s.zone === zone) : stores;
  return [...new Set(filtered.map(s => s.region))].sort();
}

export function getDistrictsByRegion(region?: string): string[] {
  const filtered = region ? stores.filter(s => s.region === region) : stores;
  return [...new Set(filtered.map(s => s.district))].sort();
}

export function getStoresByDistrict(district?: string): Store[] {
  return district ? stores.filter(s => s.district === district) : stores;
}

export interface HierarchyFilter {
  brand?: Brand;
  zone?: string;
  region?: string;
  district?: string;
  storeId?: string;
}

export function getStoresByHierarchy(filter: HierarchyFilter): Store[] {
  return stores.filter(store => {
    if (filter.brand && store.brand !== filter.brand) return false;
    if (filter.zone && store.zone !== filter.zone) return false;
    if (filter.region && store.region !== filter.region) return false;
    if (filter.district && store.district !== filter.district) return false;
    if (filter.storeId && store.id !== filter.storeId) return false;
    return true;
  });
}

// Helper to sum all networked devices
function sumNetworkedDevices(devices: DeviceInventory): { total: number; online: number } {
  const networked = [
    devices.posComputers,
    devices.iPads,
    devices.pinPads,
    devices.receiptPrinters,
    devices.laserPrinters,
    devices.chromebooks,
    devices.desktopPhones,
    devices.cordlessPhones,
  ];
  return {
    total: networked.reduce((acc, d) => acc + d.total, 0),
    online: networked.reduce((acc, d) => acc + d.online, 0),
  };
}

// Helper to sum all passive devices
function sumPassiveDevices(devices: DeviceInventory): number {
  const passive = [
    devices.averyMarkdownScanners,
    devices.tailoringPrinters,
    devices.barcodeScanners,
    devices.cashDrawers,
    devices.monitors,
  ];
  return passive.reduce((acc, d) => acc + d.total, 0);
}

export function getBrandSummaries(): BrandSummary[] {
  const brandList: Brand[] = ['KNG', 'TMW', 'MSP', 'JAB'];
  return brandList.map(brand => {
    const brandStores = stores.filter(s => s.brand === brand);
    
    let totalNetworked = 0;
    let networkedOnline = 0;
    let totalPassive = 0;
    
    brandStores.forEach(s => {
      const networked = sumNetworkedDevices(s.devices);
      totalNetworked += networked.total;
      networkedOnline += networked.online;
      totalPassive += sumPassiveDevices(s.devices);
    });

    return {
      brand,
      totalStores: brandStores.length,
      posOnline: brandStores.filter(s => s.posStatus === 'online').length,
      posDegraded: brandStores.filter(s => s.posStatus === 'degraded').length,
      posOffline: brandStores.filter(s => s.posStatus === 'offline').length,
      networkOnline: brandStores.filter(s => s.networkStatus === 'online').length,
      networkDegraded: brandStores.filter(s => s.networkStatus === 'degraded').length,
      networkOffline: brandStores.filter(s => s.networkStatus === 'offline').length,
      totalDevices: totalNetworked + totalPassive,
      devicesOnline: networkedOnline,
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
    
    let totalNetworked = 0;
    let networkedOnline = 0;
    
    regionStores.forEach(s => {
      const networked = sumNetworkedDevices(s.devices);
      totalNetworked += networked.total;
      networkedOnline += networked.online;
    });

    return {
      region,
      totalStores,
      posOnlinePercent: Math.round((posOnline / totalStores) * 100),
      networkOnlinePercent: Math.round((networkOnline / totalStores) * 100),
      devicesOnlinePercent: totalNetworked > 0 ? Math.round((networkedOnline / totalNetworked) * 100) : 0,
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

  // Aggregate all device types
  const deviceTotals = {
    // Networked devices
    posComputers: { total: 0, online: 0 },
    iPads: { total: 0, online: 0 },
    pinPads: { total: 0, online: 0 },
    receiptPrinters: { total: 0, online: 0 },
    laserPrinters: { total: 0, online: 0 },
    chromebooks: { total: 0, online: 0 },
    desktopPhones: { total: 0, online: 0 },
    cordlessPhones: { total: 0, online: 0 },
    // Passive devices
    averyMarkdownScanners: { total: 0 },
    tailoringPrinters: { total: 0 },
    barcodeScanners: { total: 0 },
    cashDrawers: { total: 0 },
    monitors: { total: 0 },
  };

  stores.forEach(s => {
    // Networked
    deviceTotals.posComputers.total += s.devices.posComputers.total;
    deviceTotals.posComputers.online += s.devices.posComputers.online;
    deviceTotals.iPads.total += s.devices.iPads.total;
    deviceTotals.iPads.online += s.devices.iPads.online;
    deviceTotals.pinPads.total += s.devices.pinPads.total;
    deviceTotals.pinPads.online += s.devices.pinPads.online;
    deviceTotals.receiptPrinters.total += s.devices.receiptPrinters.total;
    deviceTotals.receiptPrinters.online += s.devices.receiptPrinters.online;
    deviceTotals.laserPrinters.total += s.devices.laserPrinters.total;
    deviceTotals.laserPrinters.online += s.devices.laserPrinters.online;
    deviceTotals.chromebooks.total += s.devices.chromebooks.total;
    deviceTotals.chromebooks.online += s.devices.chromebooks.online;
    deviceTotals.desktopPhones.total += s.devices.desktopPhones.total;
    deviceTotals.desktopPhones.online += s.devices.desktopPhones.online;
    deviceTotals.cordlessPhones.total += s.devices.cordlessPhones.total;
    deviceTotals.cordlessPhones.online += s.devices.cordlessPhones.online;
    // Passive
    deviceTotals.averyMarkdownScanners.total += s.devices.averyMarkdownScanners.total;
    deviceTotals.tailoringPrinters.total += s.devices.tailoringPrinters.total;
    deviceTotals.barcodeScanners.total += s.devices.barcodeScanners.total;
    deviceTotals.cashDrawers.total += s.devices.cashDrawers.total;
    deviceTotals.monitors.total += s.devices.monitors.total;
  });

  const totalNetworked = 
    deviceTotals.posComputers.total + deviceTotals.iPads.total + deviceTotals.pinPads.total +
    deviceTotals.receiptPrinters.total + deviceTotals.laserPrinters.total + deviceTotals.chromebooks.total +
    deviceTotals.desktopPhones.total + deviceTotals.cordlessPhones.total;
  
  const networkedOnline = 
    deviceTotals.posComputers.online + deviceTotals.iPads.online + deviceTotals.pinPads.online +
    deviceTotals.receiptPrinters.online + deviceTotals.laserPrinters.online + deviceTotals.chromebooks.online +
    deviceTotals.desktopPhones.online + deviceTotals.cordlessPhones.online;

  const totalPassive = 
    deviceTotals.averyMarkdownScanners.total + deviceTotals.tailoringPrinters.total +
    deviceTotals.barcodeScanners.total + deviceTotals.cashDrawers.total + deviceTotals.monitors.total;

  return {
    totalStores,
    totalBrands: 4,
    pos: { online: posOnline, degraded: posDegraded, offline: posOffline },
    network: { online: networkOnline, degraded: networkDegraded, offline: networkOffline },
    devices: { 
      totalNetworked, 
      networkedOnline, 
      totalPassive,
      total: totalNetworked + totalPassive,
    },
    deviceBreakdown: deviceTotals,
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
