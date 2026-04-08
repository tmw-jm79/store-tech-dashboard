import type { Brand, Region } from '../data/mockData';
import { brands, usRegions, canadaRegions } from '../data/mockData';

interface FilterBarProps {
  selectedBrand: Brand | 'all';
  selectedRegion: Region | 'all';
  onBrandChange: (brand: Brand | 'all') => void;
  onRegionChange: (region: Region | 'all') => void;
}

export function FilterBar({ selectedBrand, selectedRegion, onBrandChange, onRegionChange }: FilterBarProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm font-medium">Brand:</label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value as Brand | 'all')}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm font-medium">Region:</label>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value as Region | 'all')}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Regions</option>
          <optgroup label="United States">
            {usRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </optgroup>
          <optgroup label="Canada">
            {canadaRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </optgroup>
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
