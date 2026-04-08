export interface Store {
  id: string;
  name: string;
  brand: Brand;
  region: Region;
  state: string;
  city: string;
  country: 'US' | 'Canada';
  posStatus: SystemStatus;
  networkStatus: SystemStatus;
  devices: DeviceInventory;
  lastUpdated: string;
}

export type Brand = 'Alpine Outfitters' | 'Urban Threads' | 'HomeStyle' | 'TechMart';
export type Region = 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'Canada East' | 'Canada West';
export type SystemStatus = 'online' | 'degraded' | 'offline';

export interface DeviceInventory {
  posTerminals: number;
  posOnline: number;
  scanners: number;
  scannersOnline: number;
  printers: number;
  printersOnline: number;
  networkSwitches: number;
  networkSwitchesOnline: number;
}

export interface BrandSummary {
  brand: Brand;
  totalStores: number;
  posOnline: number;
  posDegraded: number;
  posOffline: number;
  networkOnline: number;
  networkDegraded: number;
  networkOffline: number;
  totalDevices: number;
  devicesOnline: number;
}

export interface RegionSummary {
  region: Region;
  totalStores: number;
  posOnlinePercent: number;
  networkOnlinePercent: number;
  devicesOnlinePercent: number;
}

const brands: Brand[] = ['Alpine Outfitters', 'Urban Threads', 'HomeStyle', 'TechMart'];
const usRegions: Region[] = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
const canadaRegions: Region[] = ['Canada East', 'Canada West'];

const usStates: Record<Region, { state: string; cities: string[] }[]> = {
  'Northeast': [
    { state: 'NY', cities: ['New York', 'Buffalo', 'Albany', 'Rochester'] },
    { state: 'MA', cities: ['Boston', 'Worcester', 'Springfield'] },
    { state: 'PA', cities: ['Philadelphia', 'Pittsburgh', 'Harrisburg'] },
    { state: 'NJ', cities: ['Newark', 'Jersey City', 'Trenton'] },
    { state: 'CT', cities: ['Hartford', 'New Haven', 'Stamford'] },
  ],
  'Southeast': [
    { state: 'FL', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'] },
    { state: 'GA', cities: ['Atlanta', 'Savannah', 'Augusta'] },
    { state: 'NC', cities: ['Charlotte', 'Raleigh', 'Durham'] },
    { state: 'VA', cities: ['Richmond', 'Virginia Beach', 'Norfolk'] },
    { state: 'TN', cities: ['Nashville', 'Memphis', 'Knoxville'] },
  ],
  'Midwest': [
    { state: 'IL', cities: ['Chicago', 'Springfield', 'Peoria'] },
    { state: 'OH', cities: ['Columbus', 'Cleveland', 'Cincinnati'] },
    { state: 'MI', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor'] },
    { state: 'IN', cities: ['Indianapolis', 'Fort Wayne', 'Evansville'] },
    { state: 'WI', cities: ['Milwaukee', 'Madison', 'Green Bay'] },
  ],
  'Southwest': [
    { state: 'TX', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio'] },
    { state: 'AZ', cities: ['Phoenix', 'Tucson', 'Mesa'] },
    { state: 'NM', cities: ['Albuquerque', 'Santa Fe', 'Las Cruces'] },
    { state: 'OK', cities: ['Oklahoma City', 'Tulsa', 'Norman'] },
  ],
  'West': [
    { state: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'] },
    { state: 'WA', cities: ['Seattle', 'Tacoma', 'Spokane'] },
    { state: 'OR', cities: ['Portland', 'Eugene', 'Salem'] },
    { state: 'CO', cities: ['Denver', 'Colorado Springs', 'Boulder'] },
    { state: 'NV', cities: ['Las Vegas', 'Reno', 'Henderson'] },
  ],
  'Canada East': [],
  'Canada West': [],
};

const canadaProvinces: Record<Region, { state: string; cities: string[] }[]> = {
  'Canada East': [
    { state: 'ON', cities: ['Toronto', 'Ottawa', 'Hamilton', 'London'] },
    { state: 'QC', cities: ['Montreal', 'Quebec City', 'Laval'] },
    { state: 'NS', cities: ['Halifax', 'Sydney'] },
    { state: 'NB', cities: ['Moncton', 'Saint John'] },
  ],
  'Canada West': [
    { state: 'BC', cities: ['Vancouver', 'Victoria', 'Surrey'] },
    { state: 'AB', cities: ['Calgary', 'Edmonton', 'Red Deer'] },
    { state: 'MB', cities: ['Winnipeg', 'Brandon'] },
    { state: 'SK', cities: ['Saskatoon', 'Regina'] },
  ],
  'Northeast': [],
  'Southeast': [],
  'Midwest': [],
  'Southwest': [],
  'West': [],
};

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
  const stores: Store[] = [];
  let storeId = 1;

  // Generate US stores (~850)
  for (const brand of brands) {
    for (const region of usRegions) {
      const locations = usStates[region];
      const storesPerRegion = Math.floor(40 + Math.random() * 15);
      
      for (let i = 0; i < storesPerRegion; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const city = location.cities[Math.floor(Math.random() * location.cities.length)];
        
        stores.push({
          id: `STR-${String(storeId++).padStart(5, '0')}`,
          name: `${brand} - ${city} ${Math.floor(Math.random() * 100) + 1}`,
          brand,
          region,
          state: location.state,
          city,
          country: 'US',
          posStatus: generateStatus(),
          networkStatus: generateStatus(),
          devices: generateDeviceInventory(),
          lastUpdated: new Date(Date.now() - Math.random() * 300000).toISOString(),
        });
      }
    }
  }

  // Generate Canada stores (~200)
  for (const brand of brands) {
    for (const region of canadaRegions) {
      const locations = canadaProvinces[region];
      const storesPerRegion = Math.floor(10 + Math.random() * 8);
      
      for (let i = 0; i < storesPerRegion; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const city = location.cities[Math.floor(Math.random() * location.cities.length)];
        
        stores.push({
          id: `STR-${String(storeId++).padStart(5, '0')}`,
          name: `${brand} - ${city} ${Math.floor(Math.random() * 50) + 1}`,
          brand,
          region,
          state: location.state,
          city,
          country: 'Canada',
          posStatus: generateStatus(),
          networkStatus: generateStatus(),
          devices: generateDeviceInventory(),
          lastUpdated: new Date(Date.now() - Math.random() * 300000).toISOString(),
        });
      }
    }
  }

  return stores;
}

export const stores = generateStores();

export function getBrandSummaries(): BrandSummary[] {
  return brands.map(brand => {
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
  const allRegions = [...usRegions, ...canadaRegions];
  
  return allRegions.map(region => {
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
      devicesOnlinePercent: Math.round((devicesOnline / totalDevices) * 100),
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
    totalBrands: brands.length,
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

export function getStoresByFilter(brand?: Brand, region?: Region, status?: SystemStatus): Store[] {
  return stores.filter(store => {
    if (brand && store.brand !== brand) return false;
    if (region && store.region !== region) return false;
    if (status && store.posStatus !== status && store.networkStatus !== status) return false;
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

export { brands, usRegions, canadaRegions };
