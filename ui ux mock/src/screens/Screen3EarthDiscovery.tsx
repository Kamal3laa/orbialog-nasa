import React, { useState, useMemo } from 'react';
import { 
  ActiveScreen, 
  PlanetaryTarget, 
  AnalogLocation, 
  AnalogCategory 
} from '../types';
import { RealGISMap } from '../components/common/RealGISMap';
import { Real3DGlobe } from '../components/canvas3d/Real3DGlobe';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  Activity, 
  Database, 
  Compass, 
  Sparkles,
  ExternalLink,
  X,
  Globe,
  Box,
  Thermometer
} from 'lucide-react';
import { audio } from '../utils/audio';

interface Screen3EarthDiscoveryProps {
  analogLocations: AnalogLocation[];
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
  onSelectAnalog: (loc: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen3EarthDiscovery: React.FC<Screen3EarthDiscoveryProps> = ({
  analogLocations,
  selectedTarget,
  selectedAnalog,
  onSelectAnalog,
  onNavigate,
}) => {
  // Display View Mode: 2D Real Satellite/Thermal GIS Map vs 3D Digital Globe vs 3D Topography
  const [displayMode, setDisplayMode] = useState<'real-gis' | '3d-globe' | '3d-topography'>('real-gis');
  const [thermalGlobeMode, setThermalGlobeMode] = useState<boolean>(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<'all' | 'moon' | 'mars'>('all');
  const [selectedCategories, setSelectedCategories] = useState<AnalogCategory[]>([]);
  const [minSimilarity, setMinSimilarity] = useState<number>(80);
  const [onlyEgypt, setOnlyEgypt] = useState<boolean>(false);
  const [activeOverlay, setActiveOverlay] = useState<'standard' | 'thermal' | 'elevation' | 'aridity'>('thermal');
  const [previewLocation, setPreviewLocation] = useState<AnalogLocation>(selectedAnalog);

  // Filter application logic
  const filteredLocations = useMemo(() => {
    return analogLocations.filter((loc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesRegion = loc.region.toLowerCase().includes(q);
        const matchesCountry = loc.country.toLowerCase().includes(q);
        const matchesGeology = loc.geology.rockType.toLowerCase().includes(q);
        if (!matchesName && !matchesRegion && !matchesCountry && !matchesGeology) {
          return false;
        }
      }

      if (selectedPlanetFilter !== 'all' && loc.primaryTargetAnalog !== selectedPlanetFilter) {
        return false;
      }

      if (onlyEgypt && !loc.featuredEgypt) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(loc.category)) {
        return false;
      }

      if (loc.overallSimilarity < minSimilarity) {
        return false;
      }

      return true;
    });
  }, [analogLocations, searchQuery, selectedPlanetFilter, selectedCategories, minSimilarity, onlyEgypt]);

  const handleLocationSelect = (loc: AnalogLocation) => {
    audio.playClick();
    setPreviewLocation(loc);
    onSelectAnalog(loc);
  };

  const handleLaunchComparison = () => {
    audio.playConfirm();
    onNavigate('comparison');
  };

  const handleOpenProfile = () => {
    audio.playConfirm();
    onNavigate('profile');
  };

  const toggleCategory = (cat: AnalogCategory) => {
    audio.playClick();
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Target Link Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-obsidian-border pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-wider mb-1">
            <span className="text-mars font-bold">MISSION STEP 02</span>
            <span>//</span>
            <span>REAL EARTH SATELLITE CARTOGRAPHY & THERMAL PROFILING</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
            Earth Analog Discovery
          </h1>
          <p className="font-inter text-stone-gray text-xs md:text-sm mt-1">
            Real satellite Earth observation with MODIS/ASTER Land Surface Temperature (LST) thermal infrared telemetry.{' '}
            Calibrated to extraterrestrial target: <span className="text-mineral-white font-mono font-semibold uppercase">{selectedTarget.name}</span>
          </p>
        </div>

        {/* View Mode Switcher: Real 2D Satellite/Thermal GIS vs 3D Globe vs 3D Topographic Mesh */}
        <div className="flex items-center space-x-2 font-mono text-xs bg-obsidian-card border border-obsidian-border p-1">
          <button
            onClick={() => {
              audio.playClick();
              setDisplayMode('real-gis');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all ${
              displayMode === 'real-gis'
                ? 'bg-mars text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">Real Satellite + Thermal</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setDisplayMode('3d-globe');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all ${
              displayMode === '3d-globe'
                ? 'bg-mars text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="uppercase">3D Digital Globe</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setDisplayMode('3d-topography');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all ${
              displayMode === '3d-topography'
                ? 'bg-earth text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="uppercase">3D Terrain Relief</span>
          </button>
        </div>
      </div>

      {/* Multi-Criteria Filter Bar */}
      <div className="bg-obsidian border border-obsidian-border p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, region, country, or mineralogy (e.g., Chalk, Sabkha, Perchlorate)..."
              className="w-full bg-obsidian-card border border-obsidian-border pl-9 pr-4 py-2 text-mineral-white placeholder-stone-gray/60 focus:outline-none focus:border-mars text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray hover:text-mineral-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Planet Affinity Filter */}
          <div className="flex items-center space-x-1 border border-obsidian-border bg-obsidian-card p-1">
            <span className="px-2 text-stone-dark text-[10px] uppercase font-semibold">PLANET:</span>
            {(['all', 'moon', 'mars'] as const).map((pf) => (
              <button
                key={pf}
                onClick={() => {
                  audio.playClick();
                  setSelectedPlanetFilter(pf);
                }}
                className={`px-3 py-1 uppercase text-[11px] transition-colors ${
                  selectedPlanetFilter === pf
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
              >
                {pf}
              </button>
            ))}
          </div>

          {/* Egypt Priority Toggle Button */}
          <button
            onClick={() => {
              audio.playClick();
              setOnlyEgypt(!onlyEgypt);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 border font-mono text-xs transition-all ${
              onlyEgypt
                ? 'bg-telemetry-amber text-charcoal font-bold border-telemetry-amber shadow-md'
                : 'bg-obsidian-card text-telemetry-amber border-telemetry-amber/40 hover:bg-obsidian-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase">EGYPT PRIORITY [3]</span>
          </button>
        </div>

        {/* Detailed Scientific Criteria Toggles */}
        <div className="pt-3 border-t border-obsidian-border/60 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-stone-gray">
          {/* Analog Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-dark uppercase text-[10px] mr-1">ANALOG TYPES:</span>
            {(
              [
                ['hyper-arid', 'Hyper-Arid'],
                ['sub-sea-level', 'Sub-Sea-Level Basin'],
                ['volcanic-basalt', 'Volcanic Basalt'],
                ['impact-crater', 'Impact Crater'],
                ['polar-desert', 'Polar Desert'],
              ] as [AnalogCategory, string][]
            ).map(([catId, label]) => {
              const active = selectedCategories.includes(catId);
              return (
                <button
                  key={catId}
                  onClick={() => toggleCategory(catId)}
                  className={`px-2.5 py-1 border transition-colors ${
                    active
                      ? 'bg-obsidian-surface border-mars text-mineral-white font-medium'
                      : 'border-obsidian-border bg-obsidian-card hover:border-stone-gray text-stone-gray'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Similarity Slider */}
          <div className="flex items-center space-x-3 bg-obsidian-card px-3 py-1.5 border border-obsidian-border">
            <span className="text-[10px] uppercase text-stone-dark">MIN SIMILARITY:</span>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(Number(e.target.value))}
              className="w-24 accent-mars cursor-pointer"
            />
            <span className="text-mineral-white font-bold">{minSimilarity}%</span>
          </div>
        </div>
      </div>

      {/* Main Visual Display: Real Leaflet Satellite+Thermal GIS Map OR 3D Globe OR 3D Topographic Mesh */}
      {displayMode === 'real-gis' && (
        <RealGISMap
          locations={filteredLocations}
          selectedLocationId={previewLocation.id}
          onSelectLocation={handleLocationSelect}
          activeOverlay={activeOverlay}
        />
      )}

      {displayMode === '3d-globe' && (
        <div className="space-y-2">
          <div className="flex items-center justify-end space-x-2 font-mono text-xs">
            <button
              onClick={() => {
                audio.playClick();
                setThermalGlobeMode(!thermalGlobeMode);
              }}
              className="flex items-center space-x-1.5 px-3 py-1 bg-obsidian border border-obsidian-border text-telemetry-cyan hover:text-mineral-white"
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>GLOBE SHADER: {thermalGlobeMode ? 'THERMAL LST INFRARED' : 'TRUE SATELLITE COLOR'}</span>
            </button>
          </div>
          <Real3DGlobe
            locations={filteredLocations}
            selectedLocationId={previewLocation.id}
            onSelectLocation={handleLocationSelect}
            thermalMode={thermalGlobeMode}
          />
        </div>
      )}

      {displayMode === '3d-topography' && (
        <div className="space-y-2">
          <Real3DTopography
            locationName={previewLocation.name}
            terrainType={previewLocation.geology.rockType}
            elevationDatum={`${previewLocation.elevationMeters}m MSL`}
            thermalRange={{ min: 4, max: 48, unit: '°C' }}
          />
        </div>
      )}

      {/* Bottom Split Layout: Candidate Gallery and Live Telemetry Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Filtered Candidate Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="font-mono text-xs text-stone-gray uppercase tracking-wider flex items-center justify-between">
            <span>FILTERED CANDIDATE CATALOG [{filteredLocations.length}]</span>
            <span className="text-[10px] text-telemetry-emerald">CALIBRATED TO: {selectedTarget.name.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === previewLocation.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className={`p-4 border cursor-pointer transition-all duration-150 select-none relative ${
                    isSelected
                      ? 'bg-obsidian-surface border-mars ring-1 ring-mars/50 shadow-md'
                      : 'bg-obsidian hover:bg-obsidian-card border-obsidian-border'
                  }`}
                >
                  {loc.featuredEgypt && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-telemetry-amber/20 border border-telemetry-amber/50 font-mono text-[9px] text-telemetry-amber font-semibold uppercase">
                      EGYPT ANALOG
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-stone-gray">[{loc.flagCode}]</span>
                    <h3 className="font-grotesk font-bold text-sm text-mineral-white truncate">
                      {loc.name.split(' (')[0]}
                    </h3>
                  </div>

                  <p className="font-mono text-[11px] text-stone-gray mt-0.5">
                    {loc.region}, {loc.country}
                  </p>

                  <div className="mt-3 flex items-center justify-between font-mono text-xs pt-2 border-t border-obsidian-border">
                    <div className="flex items-center space-x-1">
                      <span className="text-stone-dark text-[10px]">SIMILARITY:</span>
                      <span className="text-mineral-white font-bold">{loc.overallSimilarity.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-stone-gray">
                      <span>CONF: {loc.confidenceScore.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scientific Preview HUD Panel */}
        {previewLocation && (
          <div className="lg:col-span-5 bg-obsidian border border-obsidian-border p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-obsidian-border pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-obsidian-card border border-stone-gray/30 text-stone-gray uppercase">
                    ID: {previewLocation.id}
                  </span>
                  {previewLocation.featuredEgypt && (
                    <span className="font-mono text-[10px] text-telemetry-amber font-semibold">
                      ★ KEY EGYPTIAN ANALOG
                    </span>
                  )}
                </div>
                <h2 className="font-grotesk font-bold text-xl text-mineral-white mt-1">
                  {previewLocation.name}
                </h2>
                <p className="font-mono text-xs text-stone-gray mt-0.5">
                  {previewLocation.coordinates.display} • ELEV: {previewLocation.elevationMeters}m
                </p>
              </div>

              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-mars">
                  {previewLocation.overallSimilarity.toFixed(1)}%
                </div>
                <div className="font-mono text-[9px] text-stone-gray uppercase">ANALOG SIMILARITY</div>
              </div>
            </div>

            {/* Quick Hero Image */}
            <div className="relative w-full h-36 bg-charcoal-deep border border-obsidian-border overflow-hidden">
              <img
                src={previewLocation.imagery.hero}
                alt={previewLocation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 font-mono text-[10px] bg-charcoal/80 border border-stone-gray/30 px-2 py-0.5 text-mineral-white">
                CLIMATE: {previewLocation.climateType}
              </div>
            </div>

            {/* Summary */}
            <p className="font-inter text-xs text-mineral-muted leading-relaxed">
              {previewLocation.summary}
            </p>

            {/* Geological & Environmental Snapshot */}
            <div className="space-y-2 font-mono text-xs pt-2 border-t border-obsidian-border">
              <div className="flex items-start justify-between">
                <span className="text-stone-dark text-[11px] uppercase">LITHOLOGY:</span>
                <span className="text-mineral-white text-right text-[11px] max-w-[240px] truncate" title={previewLocation.geology.rockType}>
                  {previewLocation.geology.rockType}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-stone-dark text-[11px] uppercase">LST THERMAL RANGE:</span>
                <span className="text-mars font-bold text-[11px]">{previewLocation.environment.diurnalRange}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-stone-dark text-[11px] uppercase">ANNUAL PRECIP:</span>
                <span className="text-mineral-white text-[11px]">{previewLocation.environment.annualPrecipitation}</span>
              </div>
            </div>

            {/* Action Buttons: 3D Relief vs Compare vs Profile */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => setDisplayMode('3d-topography')}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-obsidian-card hover:bg-obsidian-surface border border-earth text-earth-bright font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Box className="w-3.5 h-3.5" />
                <span>INSPECT IN 3D</span>
              </button>

              <button
                onClick={handleLaunchComparison}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider transition-colors shadow-md font-semibold"
              >
                <span>COMPARE ENGINE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
