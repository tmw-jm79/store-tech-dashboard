import { 
  brands, 
  brandNames, 
  getZonesByBrand, 
  getRegionsByZone, 
  getDistrictsByRegion,
  type Brand,
  type HierarchyFilter 
} from '../data/storeService';

interface FilterBarProps {
  filter: HierarchyFilter;
  onFilterChange: (filter: HierarchyFilter) => void;
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const zones = filter.brand ? getZonesByBrand(filter.brand) : [];
  const regions = filter.zone ? getRegionsByZone(filter.zone) : [];
  const districts = filter.region ? getDistrictsByRegion(filter.region) : [];

  const handleBrandChange = (brand: string) => {
    onFilterChange({ 
      brand: brand === 'all' ? undefined : brand as Brand 
    });
  };

  const handleZoneChange = (zone: string) => {
    onFilterChange({ 
      ...filter, 
      zone: zone === 'all' ? undefined : zone,
      region: undefined,
      district: undefined
    });
  };

  const handleRegionChange = (region: string) => {
    onFilterChange({ 
      ...filter, 
      region: region === 'all' ? undefined : region,
      district: undefined
    });
  };

  const handleDistrictChange = (district: string) => {
    onFilterChange({ 
      ...filter, 
      district: district === 'all' ? undefined : district
    });
  };

  const hasFilters = filter.brand || filter.zone || filter.region || filter.district;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex flex-wrap gap-4 items-center">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <label className="text-slate-400 text-sm font-medium">Brand:</label>
        <select
          value={filter.brand || 'all'}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brandNames[brand]}</option>
          ))}
        </select>
      </div>

      {/* Zone - only show if brand selected */}
      {filter.brand && zones.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">Zone:</label>
          <select
            value={filter.zone || 'all'}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      )}

      {/* Region - only show if zone selected */}
      {filter.zone && regions.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">Region:</label>
          <select
            value={filter.region || 'all'}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      )}

      {/* District - only show if region selected */}
      {filter.region && districts.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">District:</label>
          <select
            value={filter.district || 'all'}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={() => onFilterChange({})}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
