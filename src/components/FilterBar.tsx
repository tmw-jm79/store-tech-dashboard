import { X } from 'lucide-react';
import { 
  brands, 
  brandNames, 
  getZonesByBrand, 
  getRegionsByZone, 
  getDistrictsByRegion,
  getStoresByDistrict,
  type Brand,
  type HierarchyFilter 
} from '../data/storeService';

interface FilterBarProps {
  filter: HierarchyFilter;
  onFilterChange: (filter: HierarchyFilter) => void;
  darkMode?: boolean;
}

export function FilterBar({ filter, onFilterChange, darkMode = true }: FilterBarProps) {
  const zones = filter.brand ? getZonesByBrand(filter.brand) : [];
  const regions = filter.zone ? getRegionsByZone(filter.zone) : [];
  const districts = filter.region ? getDistrictsByRegion(filter.region) : [];
  const storesInDistrict = filter.district ? getStoresByDistrict(filter.district) : [];

  const handleBrandChange = (brand: string) => {
    onFilterChange({ 
      brand: brand === 'all' ? undefined : brand as Brand 
    });
  };

  const clearBrand = () => {
    onFilterChange({});
  };

  const handleZoneChange = (zone: string) => {
    onFilterChange({ 
      ...filter, 
      zone: zone === 'all' ? undefined : zone,
      region: undefined,
      district: undefined,
      storeId: undefined
    });
  };

  const clearZone = () => {
    onFilterChange({ 
      brand: filter.brand 
    });
  };

  const handleRegionChange = (region: string) => {
    onFilterChange({ 
      ...filter, 
      region: region === 'all' ? undefined : region,
      district: undefined,
      storeId: undefined
    });
  };

  const clearRegion = () => {
    onFilterChange({ 
      brand: filter.brand,
      zone: filter.zone
    });
  };

  const handleDistrictChange = (district: string) => {
    onFilterChange({ 
      ...filter, 
      district: district === 'all' ? undefined : district,
      storeId: undefined
    });
  };

  const clearDistrict = () => {
    onFilterChange({ 
      brand: filter.brand,
      zone: filter.zone,
      region: filter.region
    });
  };

  const handleStoreChange = (storeId: string) => {
    onFilterChange({ 
      ...filter, 
      storeId: storeId === 'all' ? undefined : storeId
    });
  };

  const clearStore = () => {
    onFilterChange({ 
      brand: filter.brand,
      zone: filter.zone,
      region: filter.region,
      district: filter.district
    });
  };

  const hasFilters = filter.brand || filter.zone || filter.region || filter.district || filter.storeId;

  const selectClass = darkMode 
    ? "bg-slate-700 text-white border-slate-600" 
    : "bg-white text-gray-900 border-gray-300";
  const labelClass = darkMode ? "text-slate-400" : "text-gray-600";
  const clearBtnClass = darkMode 
    ? "text-slate-400 hover:text-white hover:bg-slate-600" 
    : "text-gray-400 hover:text-gray-700 hover:bg-gray-200";

  return (
    <div className={`${darkMode ? 'bg-slate-800/50' : 'bg-white shadow-sm border border-gray-200'} rounded-lg p-4 flex flex-wrap gap-4 items-center`}>
      {/* Brand */}
      <div className="flex items-center gap-2">
        <label className={`${labelClass} text-sm font-medium`}>Brand:</label>
        <select
          value={filter.brand || 'all'}
          onChange={(e) => handleBrandChange(e.target.value)}
          className={`${selectClass} rounded-lg px-3 py-2 text-sm border focus:border-blue-500 focus:outline-none`}
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brandNames[brand]}</option>
          ))}
        </select>
        {filter.brand && (
          <button
            onClick={clearBrand}
            className={`p-1 ${clearBtnClass} rounded`}
            title="Clear brand filter"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Zone - only show if brand selected */}
      {filter.brand && zones.length > 0 && (
        <div className="flex items-center gap-2">
          <label className={`${labelClass} text-sm font-medium`}>Zone:</label>
          <select
            value={filter.zone || 'all'}
            onChange={(e) => handleZoneChange(e.target.value)}
            className={`${selectClass} rounded-lg px-3 py-2 text-sm border focus:border-blue-500 focus:outline-none`}
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
          {filter.zone && (
            <button
              onClick={clearZone}
              className={`p-1 ${clearBtnClass} rounded`}
              title="Clear zone filter"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Region - only show if zone selected */}
      {filter.zone && regions.length > 0 && (
        <div className="flex items-center gap-2">
          <label className={`${labelClass} text-sm font-medium`}>Region:</label>
          <select
            value={filter.region || 'all'}
            onChange={(e) => handleRegionChange(e.target.value)}
            className={`${selectClass} rounded-lg px-3 py-2 text-sm border focus:border-blue-500 focus:outline-none`}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {filter.region && (
            <button
              onClick={clearRegion}
              className={`p-1 ${clearBtnClass} rounded`}
              title="Clear region filter"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* District - only show if region selected */}
      {filter.region && districts.length > 0 && (
        <div className="flex items-center gap-2">
          <label className={`${labelClass} text-sm font-medium`}>District:</label>
          <select
            value={filter.district || 'all'}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className={`${selectClass} rounded-lg px-3 py-2 text-sm border focus:border-blue-500 focus:outline-none`}
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {filter.district && (
            <button
              onClick={clearDistrict}
              className={`p-1 ${clearBtnClass} rounded`}
              title="Clear district filter"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Store - only show if district selected */}
      {filter.district && storesInDistrict.length > 0 && (
        <div className="flex items-center gap-2">
          <label className={`${labelClass} text-sm font-medium`}>Store:</label>
          <select
            value={filter.storeId || 'all'}
            onChange={(e) => handleStoreChange(e.target.value)}
            className={`${selectClass} rounded-lg px-3 py-2 text-sm border focus:border-blue-500 focus:outline-none`}
          >
            <option value="all">All Stores ({storesInDistrict.length})</option>
            {storesInDistrict.map(store => (
              <option key={store.id} value={store.id}>{store.name} - {store.city}, {store.state}</option>
            ))}
          </select>
          {filter.storeId && (
            <button
              onClick={clearStore}
              className={`p-1 ${clearBtnClass} rounded`}
              title="Clear store filter"
            >
              <X size={16} />
            </button>
          )}
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
