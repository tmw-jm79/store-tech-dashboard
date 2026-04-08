import type { Brand } from '../data/mockData';
import { brands, regions } from '../data/mockData';

interface FilterBarProps {
  selectedBrand: Brand | 'all';
  selectedRegion: string | 'all';
  onBrandChange: (brand: Brand | 'all') => void;
  onRegionChange: (region: string | 'all') => void;
}

const brandLabels: Record<Brand, string> = {
  'KNG': 'K&G Fashion',
  'TMW': "Men's Wearhouse",
  'MSP': 'Moores',
  'JAB': 'Jos. A. Bank'
};

export function FilterBar({ selectedBrand, selectedRegion, onBrandChange, onRegionChange }: FilterBarProps) {
  // Group regions by brand prefix
  const brandRegions = regions.filter(r => {
    if (selectedBrand === 'all') return true;
    return r.startsWith(selectedBrand);
  });

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm font-medium">Brand:</label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            onBrandChange(e.target.value as Brand | 'all');
            onRegionChange('all'); // Reset region when brand changes
          }}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brandLabels[brand]}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm font-medium">Region:</label>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Regions</option>
          {brandRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {(selectedBrand !== 'all' || selectedRegion !== 'all') && (
        <button
          onClick={() => {
            onBrandChange('all');
            onRegionChange('all');
          }}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
