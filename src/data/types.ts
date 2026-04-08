export interface RawStore {
  id: string;
  name: string;
  brand: string;
  zone: string;
  region: string;
  district: string;
  city: string;
  state: string;
}

export interface Store {
  id: string;
  name: string;
  brand: Brand;
  zone: string;
  region: string;
  district: string;
  storeType: string;
  storeStatus: string;
  city: string;
  state: string;
  posStatus: SystemStatus;
  networkStatus: SystemStatus;
  devices: DeviceInventory;
  lastUpdated: string;
}

export type Brand = 'KNG' | 'TMW' | 'MSP' | 'JAB';
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
  region: string;
  totalStores: number;
  posOnlinePercent: number;
  networkOnlinePercent: number;
  devicesOnlinePercent: number;
}

export const brands: Brand[] = ['KNG', 'TMW', 'MSP', 'JAB'];

export const brandNames: Record<Brand, string> = {
  'KNG': 'K&G Superstore',
  'TMW': "Men's Wearhouse",
  'MSP': 'Moores',
  'JAB': 'JoS. A. Bank'
};
