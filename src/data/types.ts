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

// Networked devices - have online/offline status
export interface NetworkedDevice {
  total: number;
  online: number;
}

// Passive devices - count only, no status
export interface PassiveDevice {
  total: number;
}

export interface DeviceInventory {
  // Networked devices (can be online/offline)
  posComputers: NetworkedDevice;
  iPads: NetworkedDevice;
  pinPads: NetworkedDevice;
  receiptPrinters: NetworkedDevice;
  laserPrinters: NetworkedDevice;
  chromebooks: NetworkedDevice;
  desktopPhones: NetworkedDevice;
  cordlessPhones: NetworkedDevice;
  
  // Passive devices (count only)
  averyMarkdownScanners: PassiveDevice;
  tailoringPrinters: PassiveDevice;
  barcodeScanners: PassiveDevice;
  cashDrawers: PassiveDevice;
  monitors: PassiveDevice;
}

// Fleet totals by brand from Hardware Refresh Strategy
export const fleetTotalsByBrand: Record<Brand, Record<string, number>> = {
  TMW: {
    posComputers: 2540,
    iPads: 4943,
    pinPads: 2427,
    receiptPrinters: 2540,
    laserPrinters: 1905,
    averyMarkdownScanners: 1905,
    tailoringPrinters: 635,
    barcodeScanners: 2540,
    cashDrawers: 2540,
    chromebooks: 635,
    monitors: 2540,
    desktopPhones: 4508,
    cordlessPhones: 647,
  },
  JAB: {
    posComputers: 776,
    iPads: 1036,
    pinPads: 591,
    receiptPrinters: 776,
    laserPrinters: 582,
    averyMarkdownScanners: 388,
    tailoringPrinters: 194,
    barcodeScanners: 776,
    cashDrawers: 776,
    chromebooks: 194,
    monitors: 776,
    desktopPhones: 986,
    cordlessPhones: 196,
  },
  MSP: {
    posComputers: 330,
    iPads: 741,
    pinPads: 259,
    receiptPrinters: 330,
    laserPrinters: 330,
    averyMarkdownScanners: 0, // MSP has no Avery devices
    tailoringPrinters: 0, // MSP has none
    barcodeScanners: 330,
    cashDrawers: 330,
    chromebooks: 110,
    monitors: 330,
    desktopPhones: 623,
    cordlessPhones: 112,
  },
  KNG: {
    posComputers: 486,
    iPads: 387,
    pinPads: 414,
    receiptPrinters: 486,
    laserPrinters: 243,
    averyMarkdownScanners: 324,
    tailoringPrinters: 0, // KNG has none
    barcodeScanners: 486,
    cashDrawers: 486,
    chromebooks: 162,
    monitors: 486,
    desktopPhones: 586,
    cordlessPhones: 167,
  },
};

// Store counts by brand (for calculating averages)
export const storeCountsByBrand: Record<Brand, number> = {
  TMW: 651,
  JAB: 182,
  MSP: 108,
  KNG: 81,
};

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
