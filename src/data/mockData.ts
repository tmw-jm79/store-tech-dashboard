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

const brands: Brand[] = ['KNG', 'TMW', 'MSP', 'JAB'];

const brandNames: Record<Brand, string> = {
  'KNG': 'K&G Fashion',
  'TMW': "Men's Wearhouse",
  'MSP': 'Moores',
  'JAB': 'Jos. A. Bank'
};

// Raw store data from CSV
const rawStores = [
  { id: 'KNG_0605', name: '#0605 Greensboro', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Greensboro', state: 'NC' },
  { id: 'TMW_0999', name: '#0999 Kng Head Office', brand: 'TMW', zone: 'TMW_R99', region: 'TMW_R99', district: 'TMW_R99_R99A', city: 'Atlanta', state: 'GA' },
  { id: 'KNG_0030', name: '#0030 Irving', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Irving', state: 'TX' },
  { id: 'KNG_0112', name: '#0112West Palm Beach', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'West Palm Beach', state: 'FL' },
  { id: 'KNG_0076', name: '#0076 Flint', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Flint', state: 'MI' },
  { id: 'KNG_0020', name: '#0020 Woodbridge', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Woodbridge', state: 'NJ' },
  { id: 'KNG_0708', name: '#0708 Chicago', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Chicago', state: 'IL' },
  { id: 'KNG_0080', name: '#0080 Seattle', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Tukwila', state: 'WA' },
  { id: 'TMW_7001', name: '#7001 Bespoke Joseph Abboud', brand: 'TMW', zone: 'TMW_ZCO', region: 'TMW_ZCO', district: 'TMW_ZCO_ZCOM', city: 'Teaneck', state: 'NJ' },
  { id: 'KNG_0023', name: '#0023Meadows Business Park', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Baltimore', state: 'MD' },
  { id: 'KNG_0101', name: '#0101 Orlando', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Orlando', state: 'FL' },
  { id: 'KNG_0064', name: '#0064Saint Charles Towne Plaza', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Waldorf', state: 'MD' },
  { id: 'KNG_0017', name: '#0017Poplar Plaza Shopping Center', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Memphis', state: 'TN' },
  { id: 'KNG_0705', name: '#0705Place Mall Shopping Center', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Orland Park', state: 'IL' },
  { id: 'KNG_0074', name: '#0074Steelyard Commons', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Cleveland', state: 'OH' },
  { id: 'KNG_0082', name: '#0082 Tacoma', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Tacoma', state: 'WA' },
  { id: 'KNG_0711', name: '#0711Cermak Plaza Shopping Center', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Berwyn', state: 'IL' },
  { id: 'KNG_0209', name: '#0209 Deptford', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Woodbury', state: 'NJ' },
  { id: 'KNG_0034', name: '#0034Cooper Street Plaza', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Arlington', state: 'TX' },
  { id: 'KNG_0011', name: '#0011Mall Corners Shopping Center', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Duluth', state: 'GA' },
  { id: 'JAB_1021', name: '#1021 Business Outreach', brand: 'JAB', zone: 'JAB_Z', region: 'JAB_ZC', district: 'JAB_ZCOM', city: 'Houston', state: 'TX' },
  { id: 'KNG_0316', name: '#0316Manhattan Place', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Harvey', state: 'LA' },
  { id: 'KNG_0319', name: '#0319 Katy', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Katy', state: 'TX' },
  { id: 'KNG_0304', name: '#0304 Metairie', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Metairie', state: 'LA' },
  { id: 'KNG_0018', name: '#0018100 Oaks Mall', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Nashville', state: 'TN' },
  { id: 'KNG_0063', name: '#0063 Rockville Md', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Kensington', state: 'MD' },
  { id: 'KNG_0308', name: '#0308 Lewisville', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Lewisville', state: 'TX' },
  { id: 'KNG_0014', name: '#0014Southlake', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Morrow', state: 'GA' },
  { id: 'KNG_0314', name: '#0314Hammond Aire Plaza', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Baton Rouge', state: 'LA' },
  { id: 'KNG_0608', name: '#0608 Richmond', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Richmond', state: 'VA' },
  { id: 'KNG_0215', name: '#0215 Manchester', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Manchester', state: 'CT' },
  { id: 'KNG_0909', name: '#0909 Detroit', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Detroit', state: 'MI' },
  { id: 'MSP_0102', name: '#0102 Langley', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Langley', state: 'BC' },
  { id: 'MSP_0015', name: '#0015 Vancouver - Downtown', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Vancouver', state: 'BC' },
  { id: 'MSP_0030', name: '#0030 Regina', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Regina', state: 'SK' },
  { id: 'MSP_0003', name: '#0003 Toronto North', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Thornhill', state: 'ON' },
  { id: 'MSP_0075', name: '#0075 Montreal Downtown', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Montreal', state: 'QC' },
  { id: 'MSP_0123', name: '#0123Park Place', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Barrie', state: 'ON' },
  { id: 'MSP_0127', name: '#0127 Chatham, On', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Chatham', state: 'ON' },
  { id: 'MSP_0047', name: '#0047 Oakville West', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Oakville', state: 'ON' },
  { id: 'MSP_0028', name: '#0028 St. Johns Nfld', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'St. Johns', state: 'NL' },
  { id: 'MSP_0107', name: '#0107Aberdeen Village Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Kamloops', state: 'BC' },
  { id: 'MSP_0062', name: '#0062 Saint Leonard', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Saint Leonard', state: 'QC' },
  { id: 'MSP_0110', name: '#0110 Warehouse Outlet', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Etobicoke', state: 'ON' },
  { id: 'MSP_0024', name: '#0024Dartmouth Crossing', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Dartmouth', state: 'NS' },
  { id: 'MSP_0025', name: '#0025 Newmarket', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Newmarket', state: 'ON' },
  { id: 'MSP_0023', name: '#0023 Halifax - N.S.', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Halifax', state: 'NS' },
  { id: 'MSP_0004', name: '#0004 Toronto Downtown', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Toronto', state: 'ON' },
  { id: 'MSP_0019', name: '#0019 Richmond', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Richmond', state: 'BC' },
  { id: 'MSP_0006', name: '#0006 Ottawa - East', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Ottawa', state: 'ON' },
  { id: 'MSP_0010', name: '#0010 Burnaby', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Burnaby', state: 'BC' },
  { id: 'MSP_0051', name: '#0051 Windsor', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Windsor', state: 'ON' },
  { id: 'MSP_0090', name: '#0090 Woodbridge', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Woodbridge', state: 'ON' },
  { id: 'MSP_0098', name: '#0098 Ajax', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Ajax', state: 'ON' },
  { id: 'MSP_0052', name: '#0052 Red Deer', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Red Deer', state: 'AB' },
  { id: 'MSP_0119', name: '#0119The Boardwalk', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Kitchener', state: 'ON' },
  { id: 'MSP_0053', name: '#0053 Lethbridge', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Lethbridge', state: 'AB' },
  { id: 'MSP_0056', name: '#0056 Lebourgneuf', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Lebourgneuf', state: 'QC' },
  { id: 'MSP_0060', name: '#0060 Waterloo', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Waterloo', state: 'ON' },
  { id: 'MSP_0002', name: '#0002 Scarbrough W Kennedy/401', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Scarborough', state: 'ON' },
  { id: 'MSP_0097', name: '#0097Hyde Park Gate', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Oakville', state: 'ON' },
  { id: 'MSP_0041', name: '#0041 Calgary North East', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Calgary', state: 'AB' },
  { id: 'MSP_0094', name: '#0094 Chicoutimi - Pq', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Chicoutimi', state: 'QC' },
  { id: 'MSP_0037', name: '#0037Southpoint Shopping Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Edmonton', state: 'AB' },
  { id: 'MSP_0007', name: '#0007 Ottawa', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Ottawa', state: 'ON' },
  { id: 'MSP_0026', name: '#0026 Winnipeg West', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Winnipeg', state: 'MB' },
  { id: 'MSP_0044', name: '#0044 Peterborough', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Peterborough', state: 'ON' },
  { id: 'MSP_0042', name: '#0042Calgary Centre South', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Calgary', state: 'AB' },
  { id: 'MSP_0085', name: '#0085 Saint Bruno', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Saint Bruno', state: 'QC' },
  { id: 'MSP_0001', name: 'Moores#0001 Mississauga East', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Mississauga', state: 'ON' },
  { id: 'MSP_0129', name: '#0129 Vaudreuil, Qc', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Vaudreuil', state: 'QC' },
  { id: 'MSP_0038', name: '#0038White Oaks Square', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Edmonton', state: 'AB' },
  { id: 'MSP_0105', name: '#0105 Nanaimo', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Nanaimo', state: 'BC' },
  { id: 'MSP_0014', name: '#0014 London South', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'London', state: 'ON' },
  { id: 'MSP_0065', name: '#0065 Pointe Claire', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Pointe Claire', state: 'QC' },
  { id: 'MSP_0083', name: '#0083Eastgate Square', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Stoney Creek', state: 'ON' },
  { id: 'MSP_0022', name: '#0022 Sudbury', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Sudbury', state: 'ON' },
  { id: 'MSP_0114', name: '#0114 Brampton North', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Brampton', state: 'ON' },
  { id: 'MSP_0045', name: '#0045 Kingston', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Kingston', state: 'ON' },
  { id: 'MSP_0048', name: '#0048Westshore Town Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Victoria', state: 'BC' },
  { id: 'MSP_0005', name: '#0005Woodview Place', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Burlington', state: 'ON' },
  { id: 'MSP_0092', name: '#0092 Brandon', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Brandon', state: 'MB' },
  { id: 'MSP_0081', name: '#0081 - Abbotsford', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Abbotsford', state: 'BC' },
  { id: 'MSP_0039', name: '#0039 Coquitlam', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Coquitlam', state: 'BC' },
  { id: 'MSP_0036', name: '#0036West Point Centre North', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Edmonton', state: 'AB' },
  { id: 'MSP_0059', name: '#0059Park & Tilford Shopping Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'North Vancouver', state: 'BC' },
  { id: 'MSP_0020', name: '#0020 Markham - Toronto', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Markham', state: 'ON' },
  { id: 'MSP_0095', name: '#0095 Dieppe - N.B.', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Dieppe', state: 'NB' },
  { id: 'MSP_0043', name: '#0043 Saskatoon', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Saskatoon', state: 'SK' },
  { id: 'MSP_0079', name: '#0079Bell-Front Shopping Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Belleville', state: 'ON' },
  { id: 'MSP_0082', name: '#0082 Sherbrooke', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Sherbrooke', state: 'QC' },
  { id: 'MSP_0031', name: '#0031 Scarborough East', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Scarborough', state: 'ON' },
  { id: 'MSP_0078', name: '#0078Uptown Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Fredericton', state: 'NB' },
  { id: 'MSP_0071', name: '#0071 Edmonton East', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Edmonton', state: 'AB' },
  { id: 'MSP_0021', name: '#0021 Kitchener', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Kitchener', state: 'ON' },
  { id: 'MSP_0128', name: '#0128 Cornwall, On', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Cornwall', state: 'ON' },
  { id: 'MSP_0091', name: '#0091Galeries de la Capitale', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Quebec', state: 'QC' },
  { id: 'MSP_0069', name: '#0069Heartland Town Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Mississauga', state: 'ON' },
  { id: 'MSP_0027', name: '#0027Crossroads Shopping Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Winnipeg', state: 'MB' },
  { id: 'MSP_0066', name: '#0066 Sainte Foy', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Sainte Foy', state: 'QC' },
  { id: 'MSP_0067', name: '#0067Crowfoot Crossing', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Calgary', state: 'AB' },
  { id: 'MSP_0063', name: '#0063 Laval', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Laval', state: 'QC' },
  { id: 'MSP_0049', name: '#0049 Thunder Bay', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Thunder Bay', state: 'ON' },
  { id: 'MSP_0029', name: '#0029 Sarnia', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Sarnia', state: 'ON' },
  { id: 'MSP_0103', name: '#0103 Ottawa South', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Ottawa', state: 'ON' },
  { id: 'MSP_0061', name: '#0061 Lasalle', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Lasalle', state: 'QC' },
  { id: 'MSP_0992', name: '#0992 Tux Payments', brand: 'MSP', zone: 'MSP_Z', region: 'MSP_ZC', district: 'MSP_ZCOM', city: 'Etobicoke', state: 'ON' },
  { id: 'MSP_0018', name: '#0018 Oshawa', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Oshawa', state: 'ON' },
  { id: 'MSP_0111', name: '#0111Shawnessy Towne Center', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Calgary', state: 'AB' },
  { id: 'MSP_0009', name: '#0009 St. Catharines', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'St. Catharines', state: 'ON' },
  { id: 'MSP_0068', name: '#0068 Brantford', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Brantford', state: 'ON' },
  { id: 'MSP_0108', name: '#0108 Charlottetown, P.E.I.', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Charlottetown', state: 'PE' },
  { id: 'MSP_0100', name: '#0100 Halifax Power Centre,Ns', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Halifax', state: 'NS' },
  { id: 'MSP_0058', name: '#0058Springwater Marketplace', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Barrie', state: 'ON' },
  { id: 'MSP_0126', name: '#0126 North Bay', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'North Bay', state: 'ON' },
  { id: 'MSP_0087', name: '#0087Willow West Mall', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Guelph', state: 'ON' },
  { id: 'MSP_0013', name: '#0013Burlington North', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Burlington', state: 'ON' },
  { id: 'MSP_0112', name: '#0112Spruceland Shopping Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Prince George', state: 'BC' },
  { id: 'MSP_0012', name: '#0012 Hamilton', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Hamilton', state: 'ON' },
  { id: 'MSP_0073', name: '#0073 Pickering', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C003', city: 'Pickering', state: 'ON' },
  { id: 'MSP_0106', name: '#0106 Niagara Falls', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Niagara Falls', state: 'ON' },
  { id: 'MSP_0117', name: '#0117 Mascouche', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Mascouche', state: 'QC' },
  { id: 'MSP_0046', name: '#0046 Sault St. Marie', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Sault Ste. Marie', state: 'ON' },
  { id: 'MSP_0057', name: '#0057 Trois Rivieres', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Trois Rivieres', state: 'QC' },
  { id: 'MSP_0034', name: '#0034St Vital Square', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Winnipeg', state: 'MB' },
  { id: 'MSP_0050', name: '#0050 Victoria', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Victoria', state: 'BC' },
  { id: 'MSP_0011', name: '#0011 Surrey', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C010', city: 'Surrey', state: 'BC' },
  { id: 'MSP_0033', name: '#0033Hylands Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'London', state: 'ON' },
  { id: 'MSP_0115', name: '#0115 Mississauga West', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Mississauga', state: 'ON' },
  { id: 'MSP_0089', name: '#0089-Kelowna', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Kelowna', state: 'BC' },
  { id: 'MSP_0096', name: '#0096Meadowlands Power Centre', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C009', city: 'Ancaster', state: 'ON' },
  { id: 'MSP_0086', name: '#0086 Toronto - North York', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C008', city: 'Toronto', state: 'ON' },
  { id: 'MSP_0064', name: '#0064 Brossard', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C006', city: 'Brossard', state: 'QC' },
  { id: 'MSP_0070', name: '#0070 Orleans - Ottawa', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Cumberland', state: 'ON' },
  { id: 'MSP_0040', name: '#0040 Saint John - Nb', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C001', city: 'Saint John', state: 'NB' },
  { id: 'MSP_0084', name: '#0084Calgary Center North', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Calgary', state: 'AB' },
  { id: 'MSP_0035', name: '#0035SmartCentres Cambridge', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C007', city: 'Cambridge', state: 'ON' },
  { id: 'MSP_0017', name: '#0017 Ottawa - Downtown', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C005', city: 'Ottawa', state: 'ON' },
  { id: 'MSP_0109', name: '#0109 Medicine Hat', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C002', city: 'Medicine Hat', state: 'AB' },
  { id: 'MSP_0125', name: '#0125 Grande Prairie Alberta', brand: 'MSP', zone: 'MSP_C', region: 'MSP_C0', district: 'MSP_C004', city: 'Grande Prairie', state: 'AB' },
  // KNG stores continued
  { id: 'KNG_0069', name: '#0069Marple Crossroads Shopping Center', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Springfield', state: 'PA' },
  { id: 'KNG_0106', name: '#0106Regency Court', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Jacksonville', state: 'FL' },
  { id: 'KNG_0062', name: '#0062 New Carrolton', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'New Carrollton', state: 'MD' },
  { id: 'KNG_0510', name: '#0510 Jackson', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Jackson', state: 'MS' },
  { id: 'KNG_0205', name: '#0205Carle Place', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Carle Place', state: 'NY' },
  { id: 'KNG_0012', name: '#0012 Kennesaw', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Kennesaw', state: 'GA' },
  { id: 'KNG_0033', name: '#0033 Kansas City', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Overland Park', state: 'KS' },
  { id: 'KNG_0310', name: '#0310 Mesquite', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Mesquite', state: 'TX' },
  { id: 'KNG_0706', name: '#0706 Lansing', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Lansing', state: 'IL' },
  { id: 'KNG_0049', name: '#0049 St. Louis Pk', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Brooklyn Center', state: 'MN' },
  { id: 'KNG_0701', name: '#0701 Evergreen', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Evergreen Park', state: 'IL' },
  { id: 'KNG_0028', name: '#0028Twin City Plaza', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Somerville', state: 'MA' },
  { id: 'KNG_0311', name: '#0311Capital Plaza', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Austin', state: 'TX' },
  { id: 'KNG_0903', name: '#0903 Tsw Dearborn', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Dearborn', state: 'MI' },
  { id: 'KNG_0604', name: '#0604Capital Crossing', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Raleigh', state: 'NC' },
  { id: 'KNG_0303', name: '#0303Houston 1960', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Houston', state: 'TX' },
  { id: 'KNG_0206', name: '#0206 Harlem', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'New York', state: 'NY' },
  { id: 'KNG_0071', name: '#0071 Columbus', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Columbus', state: 'OH' },
  { id: 'KNG_0108', name: '#0108Wildwood Centre', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Homewood', state: 'AL' },
  { id: 'KNG_0712', name: '#0712Clocktower Place', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Florissant', state: 'MO' },
  { id: 'KNG_0015', name: '#0015 Stone Mtn', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Stone Mountain', state: 'GA' },
  { id: 'KNG_0036', name: '#0036Meyerland', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Houston', state: 'TX' },
  { id: 'KNG_0105', name: '#0105University Mall', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Tampa', state: 'FL' },
  { id: 'KNG_0309', name: '#0309 Duncanville', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Duncanville', state: 'TX' },
  { id: 'KNG_0312', name: '#0312 Humble', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Humble', state: 'TX' },
  { id: 'KNG_0111', name: '#0111 Margate', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Margate', state: 'FL' },
  { id: 'KNG_0031', name: '#0031 Plano', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'Plano', state: 'TX' },
  { id: 'KNG_0073', name: '#0073Golden Gate Plaza', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Mayfield Heights', state: 'OH' },
  { id: 'KNG_0066', name: '#0066 Cherry Hill', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Cherry Hill', state: 'NJ' },
  { id: 'KNG_0212', name: '#0212 Wyncote', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Wyncote', state: 'PA' },
  { id: 'KNG_0908', name: '#0908 Roseville', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Roseville', state: 'MI' },
  { id: 'KNG_0102', name: '#0102Highland Lakes Plaza', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Orlando', state: 'FL' },
  { id: 'KNG_0021', name: '#0021 Farmingdale', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Farmingdale', state: 'NY' },
  { id: 'KNG_0208', name: '#0208 N. Philly', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Philadelphia', state: 'PA' },
  { id: 'KNG_0702', name: '#0702Finley Square', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Downers Grove', state: 'IL' },
  { id: 'KNG_0216', name: '#0216 Orange', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Orange', state: 'CT' },
  { id: 'KNG_0600', name: '#0600Janaf Shopping Center', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Norfolk', state: 'VA' },
  { id: 'KNG_0010', name: '#0010 Atlanta', brand: 'KNG', zone: 'KNG_R01', region: 'KNG_R01', district: 'KNG_R01_A', city: 'Atlanta', state: 'GA' },
  { id: 'KNG_0709', name: '#0709Brown Deer', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Milwaukee', state: 'WI' },
  { id: 'KNG_0061', name: '#0061The Shoppes at Baileys Crossraods', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Falls Church', state: 'VA' },
  { id: 'KNG_0025', name: '#0025 Reading', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Reading', state: 'MA' },
  { id: 'KNG_0201', name: '#0201 Irvington', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Irvington', state: 'NJ' },
  { id: 'KNG_0016', name: '#0016Tyvola Square', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Charlotte', state: 'NC' },
  { id: 'KNG_0607', name: '#0607Verdae Village', brand: 'KNG', zone: 'KNG_R08', region: 'KNG_R08', district: 'KNG_R08_A', city: 'Greenville', state: 'SC' },
  { id: 'KNG_0305', name: '#0305 San Antonio', brand: 'KNG', zone: 'KNG_R02', region: 'KNG_R02', district: 'KNG_R02_A', city: 'San Antonio', state: 'TX' },
  { id: 'KNG_0261', name: '#0261 Rosedale', brand: 'KNG', zone: 'KNG_R10', region: 'KNG_R10', district: 'KNG_R10_A', city: 'Rosedale', state: 'MD' },
  { id: 'KNG_0027', name: '#0027 Dedham', brand: 'KNG', zone: 'KNG_R09', region: 'KNG_R09', district: 'KNG_R09_A', city: 'Dedham', state: 'MA' },
  { id: 'KNG_0035', name: '#0035Northglenn Marketplace', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Northglenn', state: 'CO' },
  { id: 'KNG_0040', name: '#0040 Indianapolis', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Indianapolis', state: 'IN' },
  { id: 'KNG_0070', name: '#0070 Cincinnati', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Springdale', state: 'OH' },
  { id: 'KNG_0048', name: '#0048HarMar Mall', brand: 'KNG', zone: 'KNG_R04', region: 'KNG_R04', district: 'KNG_R04_A', city: 'Roseville', state: 'MN' },
  { id: 'KNG_0038', name: '#0038Abilene Market', brand: 'KNG', zone: 'KNG_R03', region: 'KNG_R03', district: 'KNG_R03_A', city: 'Aurora', state: 'CO' },
  // TMW stores - sample (truncated for brevity, but including key ones)
  { id: 'TMW_3348', name: '#3348University Town Center', brand: 'TMW', zone: 'TMW_S', region: 'TMW_S2', district: 'TMW_S205', city: 'Sarasota', state: 'FL' },
  { id: 'TMW_2276', name: '#2276 Fresno', brand: 'TMW', zone: 'TMW_W', region: 'TMW_W1', district: 'TMW_W101', city: 'Fresno', state: 'CA' },
  { id: 'TMW_5432', name: '#5432 Paramus', brand: 'TMW', zone: 'TMW_N', region: 'TMW_N4', district: 'TMW_N402', city: 'Paramus', state: 'NJ' },
  { id: 'TMW_3112', name: '#3112Oglethorpe Plaza Center', brand: 'TMW', zone: 'TMW_S', region: 'TMW_S1', district: 'TMW_S103', city: 'Savannah', state: 'GA' },
  { id: 'TMW_2689', name: '#2689Bellis Fair Mall', brand: 'TMW', zone: 'TMW_W', region: 'TMW_W3', district: 'TMW_W305', city: 'Bellingham', state: 'WA' },
  { id: 'TMW_5413', name: '#5413 White Plains, Ny', brand: 'TMW', zone: 'TMW_N', region: 'TMW_N4', district: 'TMW_N402', city: 'White Plains', state: 'NY' },
  { id: 'TMW_4152', name: '#4152 Bismarck', brand: 'TMW', zone: 'TMW_W', region: 'TMW_W4', district: 'TMW_W402', city: 'Bismarck', state: 'ND' },
  { id: 'TMW_2684', name: '#2684Bellevue Galleria', brand: 'TMW', zone: 'TMW_W', region: 'TMW_W3', district: 'TMW_W305', city: 'Bellevue', state: 'WA' },
  { id: 'TMW_4407', name: '#4407The Strip', brand: 'TMW', zone: 'TMW_N', region: 'TMW_N1', district: 'TMW_N103', city: 'North Canton', state: 'OH' },
  { id: 'TMW_4633', name: '#4633Patriot Commons', brand: 'TMW', zone: 'TMW_W', region: 'TMW_W4', district: 'TMW_W406', city: 'Grafton', state: 'WI' },
  // JAB stores - sample
  { id: 'JAB_0017', name: '#0017Morrocroft Village', brand: 'JAB', zone: 'JAB_S', region: 'JAB_S1', district: 'JAB_S101', city: 'Charlotte', state: 'NC' },
  { id: 'JAB_0070', name: '#0070 449 Haywood Road', brand: 'JAB', zone: 'JAB_S', region: 'JAB_S4', district: 'JAB_S402', city: 'Greenville', state: 'SC' },
  { id: 'JAB_0345', name: '#0345The Shops At Riverwoods', brand: 'JAB', zone: 'JAB_W', region: 'JAB_W3', district: 'JAB_W301', city: 'Provo', state: 'UT' },
  { id: 'JAB_0532', name: '#0532The Promenade', brand: 'JAB', zone: 'JAB_W', region: 'JAB_W3', district: 'JAB_W302', city: 'Scottsdale', state: 'AZ' },
  { id: 'JAB_0658', name: '#0658Holmdel Town Center', brand: 'JAB', zone: 'JAB_N', region: 'JAB_N4', district: 'JAB_N407', city: 'Holmdel', state: 'NJ' },
  { id: 'JAB_0067', name: '#0067The Aboretum', brand: 'JAB', zone: 'JAB_S', region: 'JAB_S5', district: 'JAB_S501', city: 'Austin', state: 'TX' },
  { id: 'JAB_0061', name: '#0061La Promenade', brand: 'JAB', zone: 'JAB_S', region: 'JAB_S1', district: 'JAB_S104', city: 'Virginia Beach', state: 'VA' },
  { id: 'JAB_0325', name: '#0325Village Of Rochester Hills', brand: 'JAB', zone: 'JAB_N', region: 'JAB_N1', district: 'JAB_N101', city: 'Rochester Hills', state: 'MI' },
] as const;

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
  return rawStores.map(raw => ({
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

// Get unique regions from data
export const regions = [...new Set(stores.map(s => s.region))].sort();

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

export { brands, brandNames };
