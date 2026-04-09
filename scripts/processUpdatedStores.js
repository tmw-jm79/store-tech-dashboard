import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// City coordinates lookup (subset - will use the full coordinates.ts data)
const cityCoordinates = {
  // Adding common cities that might have 0,0 coordinates
  // US Cities
  "CYPRESS, TX": [29.9691, -95.6972],
  "Surprise, AZ": [33.6292, -112.3679],
  "Corvallis, OR": [44.5646, -123.2620],
  "Myrtle Beach, SC": [33.6891, -78.8867],
  "Davenport, FL": [28.1614, -81.6017],
  "Burlington, NC": [36.0957, -79.4378],
  "Prosper, TX": [33.2362, -96.8011],
  "Longview, TX": [32.5007, -94.7405],
  "Brooksville, FL": [28.5553, -82.3879],
  "Sherman, TX": [33.6357, -96.6089],
  "Fort Smith, AR": [35.3859, -94.3985],
  "Gainesville, GA": [34.2979, -83.8241],
  "Ocala, FL": [29.1872, -82.1401],
  "Jackson, MS": [32.2988, -90.1848],
  "Odessa, TX": [31.8457, -102.3676],
  "Richmond, TX": [29.5822, -95.7608],
  "Gastonia, NC": [35.2621, -81.1873],
  "Bala Cynwyd, PA": [40.0076, -75.2285],
  
  // Import all coordinates from the existing file
  "Birmingham, AL": [33.5207, -86.8025],
  "Huntsville, AL": [34.7304, -86.5861],
  "Mobile, AL": [30.6954, -88.0399],
  "Montgomery, AL": [32.3792, -86.3077],
  "Hoover, AL": [33.4054, -86.8114],
  "Phoenix, AZ": [33.4484, -112.0740],
  "Tucson, AZ": [32.2226, -110.9747],
  "Mesa, AZ": [33.4152, -111.8315],
  "Chandler, AZ": [33.3062, -111.8413],
  "Scottsdale, AZ": [33.4942, -111.9261],
  "Glendale, AZ": [33.5387, -112.1860],
  "Gilbert, AZ": [33.3528, -111.7890],
  "Tempe, AZ": [33.4255, -111.9400],
  "Peoria, AZ": [33.5806, -112.2374],
  "Little Rock, AR": [34.7465, -92.2896],
  "Los Angeles, CA": [34.0522, -118.2437],
  "San Diego, CA": [32.7157, -117.1611],
  "San Jose, CA": [37.3382, -121.8863],
  "San Francisco, CA": [37.7749, -122.4194],
  "Fresno, CA": [36.7378, -119.7871],
  "Sacramento, CA": [38.5816, -121.4944],
  "Long Beach, CA": [33.7701, -118.1937],
  "Oakland, CA": [37.8044, -122.2712],
  "Bakersfield, CA": [35.3733, -119.0187],
  "Anaheim, CA": [33.8366, -117.9143],
  "Denver, CO": [39.7392, -104.9903],
  "Colorado Springs, CO": [38.8339, -104.8214],
  "Aurora, CO": [39.7294, -104.8319],
  "Jacksonville, FL": [30.3322, -81.6557],
  "Miami, FL": [25.7617, -80.1918],
  "Tampa, FL": [27.9506, -82.4572],
  "Orlando, FL": [28.5383, -81.3792],
  "Atlanta, GA": [33.7490, -84.3880],
  "Chicago, IL": [41.8781, -87.6298],
  "Indianapolis, IN": [39.7684, -86.1581],
  "Des Moines, IA": [41.5868, -93.6250],
  "Wichita, KS": [37.6872, -97.3301],
  "Louisville, KY": [38.2527, -85.7585],
  "New Orleans, LA": [29.9511, -90.0715],
  "Baltimore, MD": [39.2904, -76.6122],
  "Boston, MA": [42.3601, -71.0589],
  "Detroit, MI": [42.3314, -83.0458],
  "Minneapolis, MN": [44.9778, -93.2650],
  "Kansas City, MO": [39.0997, -94.5786],
  "St. Louis, MO": [38.6270, -90.1994],
  "Omaha, NE": [41.2565, -95.9345],
  "Las Vegas, NV": [36.1699, -115.1398],
  "Newark, NJ": [40.7357, -74.1724],
  "Albuquerque, NM": [35.0844, -106.6504],
  "New York, NY": [40.7128, -74.0060],
  "Charlotte, NC": [35.2271, -80.8431],
  "Raleigh, NC": [35.7796, -78.6382],
  "Columbus, OH": [39.9612, -82.9988],
  "Cleveland, OH": [41.4993, -81.6944],
  "Cincinnati, OH": [39.1031, -84.5120],
  "Oklahoma City, OK": [35.4676, -97.5164],
  "Tulsa, OK": [36.1540, -95.9928],
  "Portland, OR": [45.5152, -122.6784],
  "Philadelphia, PA": [39.9526, -75.1652],
  "Pittsburgh, PA": [40.4406, -79.9959],
  "Nashville, TN": [36.1627, -86.7816],
  "Memphis, TN": [35.1495, -90.0490],
  "Houston, TX": [29.7604, -95.3698],
  "San Antonio, TX": [29.4241, -98.4936],
  "Dallas, TX": [32.7767, -96.7970],
  "Austin, TX": [30.2672, -97.7431],
  "Fort Worth, TX": [32.7555, -97.3308],
  "Salt Lake City, UT": [40.7608, -111.8910],
  "Virginia Beach, VA": [36.8529, -75.9780],
  "Seattle, WA": [47.6062, -122.3321],
  "Milwaukee, WI": [43.0389, -87.9065],
  // Canada
  "Toronto, ON": [43.6532, -79.3832],
  "Montreal, QC": [45.5017, -73.5673],
  "Vancouver, BC": [49.2827, -123.1207],
  "Calgary, AB": [51.0447, -114.0719],
  "Edmonton, AB": [53.5461, -113.4938],
  "Ottawa, ON": [45.4215, -75.6972],
  "Winnipeg, MB": [49.8951, -97.1384],
};

// Read the full coordinates from coordinates.ts and merge
import { readFileSync } from 'fs';

let fullCoordinates = { ...cityCoordinates };

try {
  const coordFile = readFileSync('./src/data/coordinates.ts', 'utf-8');
  const matches = coordFile.matchAll(/"([^"]+)":\s*\[([0-9.-]+),\s*([0-9.-]+)\]/g);
  for (const match of matches) {
    const city = match[1];
    const lat = parseFloat(match[2]);
    const lng = parseFloat(match[3]);
    fullCoordinates[city] = [lat, lng];
    // Also add uppercase version
    fullCoordinates[city.toUpperCase()] = [lat, lng];
  }
} catch (e) {
  console.error('Could not load coordinates.ts, using built-in coordinates only');
}

function lookupCoordinates(city, state) {
  // Try exact match first
  const key1 = `${city}, ${state}`;
  if (fullCoordinates[key1]) return fullCoordinates[key1];
  
  // Try uppercase
  const key2 = `${city.toUpperCase()}, ${state}`;
  if (fullCoordinates[key2]) return fullCoordinates[key2];
  
  // Try title case
  const titleCity = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const key3 = `${titleCity}, ${state}`;
  if (fullCoordinates[key3]) return fullCoordinates[key3];
  
  return null;
}

const stores = [];
const rl = createInterface({
  input: createReadStream('./scripts/Stores_Listing_Updated.csv'),
  crlfDelay: Infinity
});

let isFirstLine = true;
let missingCoords = [];

rl.on('line', (line) => {
  if (isFirstLine) {
    isFirstLine = false;
    return; // Skip header
  }
  
  const parts = line.split('|');
  if (parts.length < 14) return;
  
  const [storeCode, storeName, brand, zone, region, district, storeType, storeStatus, mgrShortName, mgrName, city, state, latStr, lngStr] = parts;
  
  let latitude = parseFloat(latStr) || 0;
  let longitude = parseFloat(lngStr) || 0;
  
  // If coordinates are 0, look them up
  if (latitude === 0 && longitude === 0) {
    const coords = lookupCoordinates(city, state);
    if (coords) {
      latitude = coords[0];
      longitude = coords[1];
    } else {
      missingCoords.push({ storeCode, city, state });
    }
  }
  
  stores.push({
    id: storeCode,
    name: storeName,
    brand,
    zone,
    region,
    district,
    storeType,
    storeStatus,
    managerShortName: mgrShortName === '---' ? null : mgrShortName,
    managerName: mgrName === '---' ? null : mgrName,
    city,
    state,
    latitude,
    longitude
  });
});

rl.on('close', () => {
  console.log(JSON.stringify(stores, null, 2));
  
  if (missingCoords.length > 0) {
    console.error('\n// Missing coordinates for:');
    missingCoords.forEach(s => {
      console.error(`// ${s.storeCode}: ${s.city}, ${s.state}`);
    });
  }
  
  console.error(`\n// Total stores: ${stores.length}`);
  console.error(`// Stores with coordinates: ${stores.filter(s => s.latitude !== 0).length}`);
  console.error(`// Stores missing coordinates: ${missingCoords.length}`);
});
