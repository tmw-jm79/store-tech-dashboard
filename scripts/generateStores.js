// This script generates the stores.json file from the markdown table format
// Run with: node scripts/generateStores.js < stores.md > src/data/stores.json

const readline = require('readline');

async function parseMarkdownTable() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  });

  const stores = [];
  
  for await (const line of rl) {
    if (line.startsWith('|') && !line.includes('---') && !line.includes('STORECODE')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 10 && parts[0]) {
        stores.push({
          id: parts[0],
          name: parts[1],
          brand: parts[2],
          zone: parts[3],
          region: parts[4],
          district: parts[5],
          city: parts[8],
          state: parts[9]
        });
      }
    }
  }

  console.log(JSON.stringify(stores, null, 2));
  console.error(`Total stores: ${stores.length}`);
  
  // Count by brand
  const brands = {};
  stores.forEach(s => {
    brands[s.brand] = (brands[s.brand] || 0) + 1;
  });
  console.error('By brand:', brands);
}

parseMarkdownTable();
