#!/usr/bin/env node
/**
 * Convert pipe-delimited CSV to stores.json
 * Usage: node scripts/csvToJson.js < scripts/Stores_Listing.csv > src/data/stores.json
 */

import * as readline from 'readline';

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  });

  const stores = [];
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue; // Skip header
    }
    
    const parts = line.split('|');
    if (parts.length >= 10 && parts[0]) {
      stores.push({
        id: parts[0].trim(),
        name: parts[1].trim(),
        brand: parts[2].trim(),
        zone: parts[3].trim(),
        region: parts[4].trim(),
        district: parts[5].trim(),
        city: parts[8].trim(),
        state: parts[9].trim()
      });
    }
  }

  console.log(JSON.stringify(stores, null, 2));
  console.error(`Converted ${stores.length} stores`);
  
  // Count by brand
  const brands = {};
  stores.forEach(s => {
    brands[s.brand] = (brands[s.brand] || 0) + 1;
  });
  console.error('By brand:', JSON.stringify(brands));
}

main().catch(console.error);
