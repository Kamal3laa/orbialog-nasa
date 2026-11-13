import React, { useState, useMemo } from 'react';
import { ActiveScreen, AnalogLocation, AnalogCategory, PlanetaryTarget } from '../types';
import { RealGISMap } from '../components/common/RealGISMap';
import { Real3DGlobe } from '../components/canvas3d/Real3DGlobe';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { 
  Globe, 
  MapPin, 
  Search, 
  Layers, 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle2, 
  Box, 
  Sparkles, 
  ExternalLink,
  Flame,
  FileText,
  Filter
} from 'lucide-react';

interface Screen3EarthDiscoveryProps {
  analogLocations: AnalogLocation[];
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
  onSelectAnalog: (analog: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen3EarthDiscovery: React.FC<Screen3EarthDiscoveryProps> = ({
  analogLocations,
  selectedTarget,
  selectedAnalog,
  onSelectAnalog,
  onNavigate,
}) => {
  const [displayMode, setDisplayMode] = useState<'real-gis' | '3d-globe' | '3d-topography'>('real-gis');

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<'all' | 'moon' | 'mars'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<AnalogCategory[]>([]);
  const [minSimilarity, setMinSimilarity] = useState<number>(80);
  const [onlyHighFidelity, setOnlyHighFidelity] = useState<boolean>(false);
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

      if (selectedRegion !== 'all' && loc.continent !== selectedRegion) {
        return false;
      }

      if (onlyHighFidelity && loc.overallSimilarity < 92) {
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
  }, [analogLocations, searchQuery, selectedPlanetFilter, selectedRegion, onlyHighFidelity, selectedCategories, minSimilarity]);

  const handleLocationSelect = (loc: AnalogLocation) => {
    setPreviewLocation(loc);
    onSelectAnalog(loc);
  };

  const handleLaunchComparison = () => {
    onNavigate('comparison');
  };

  const handleOpenProfile = () => {
    onNavigate('profile');
  };

  const toggleCategory = (cat: AnalogCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-space-void px-6 lg:px-8 py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header & Target Link Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-inter font-medium text-earth uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-earth animate-pulse"></span>
            <span>Earth Observation Engine // Step 02</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl sm:text-4xl md:text-5xl text-starlight-white tracking-tight">
            Earth Analog Discovery
          </h1>
          <p className="font-inter text-starlight-dim text-sm md:text-base max-w-2xl leading-relaxed">
            High-resolution satellite GIS & planetary exploration matching engine. Calibrated to extraterrestrial mission target:{' '}
            <span className="text-starlight-white font-semibold">{selectedTarget.name}</span>
          </p>
        </div>

        {/* View Mode Switcher: Google Maps vs 3D Globe vs 3D Topography */}
        <div className="flex items-center p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => setDisplayMode('real-gis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-200 ${
              displayMode === 'real-gis'
                ? 'bg-white text-space-void font-bold shadow-glass'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </button>

          <button
            onClick={() => setDisplayMode('3d-globe')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-200 ${
              displayMode === '3d-globe'
                ? 'bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-bold shadow-mars-glow'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Digital Globe</span>
          </button>

          <button
            onClick={() => setDisplayMode('3d-topography')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-200 ${
              displayMode === '3d-topography'
                ? 'bg-earth text-space-void font-bold shadow-sm'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Terrain Relief</span>
          </button>
        </div>
      </div>

      {/* Advanced Scientific Filter Suite */}
      <div className="glass-panel p-6 rounded-3xl space-y-5">
        {/* Top Search & Primary Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight-subtle" />
            <input
              type="text"
              placeholder="Search site, country, geology, mineralogy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.10] focus:border-earth rounded-full pl-11 pr-4 py-2.5 text-xs font-inter text-starlight-white placeholder-starlight-subtle focus:outline-none transition-colors"
            />
          </div>

          {/* Planetary Target Matcher Segment */}
          <div className="flex items-center space-x-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
            {(['all', 'moon', 'mars'] as const).map((pf) => (
              <button
                key={pf}
                onClick={() => setSelectedPlanetFilter(pf)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-150 ${
                  selectedPlanetFilter === pf
                    ? 'bg-white text-space-void font-bold shadow-sm'
                    : 'text-starlight-dim hover:text-starlight-white'
                }`}
              >
                {pf === 'all' ? 'All Analogs' : pf === 'moon' ? 'Moon Analogs' : 'Mars Analogs'}
              </button>
            ))}
          </div>

          {/* Tier-1 High-Fidelity Quick Toggle */}
          <button
            onClick={() => setOnlyHighFidelity(!onlyHighFidelity)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-semibold uppercase tracking-wider transition-all duration-200 ${
              onlyHighFidelity
                ? 'bg-telemetry-emerald text-space-void shadow-md'
                : 'bg-white/[0.04] text-telemetry-emerald border border-telemetry-emerald/40 hover:bg-white/[0.08]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{onlyHighFidelity ? 'Tier-1 Sites Active [>92%]' : 'Tier-1 Quality [>92%]'}</span>
          </button>
        </div>

        {/* Global Continental Regions Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.08] text-xs font-inter">
          <span className="text-starlight-subtle uppercase tracking-wider text-[11px] mr-1">CONTINENTS:</span>
          {[
            ['all', 'All Continents'],
            ['North America', 'North America'],
            ['South America', 'South America'],
            ['Polar / Arctic', 'Polar & Arctic'],
            ['Africa', 'Africa'],
            ['Europe', 'Europe'],
            ['Oceania', 'Oceania'],
          ].map(([regId, label]) => (
            <button
              key={regId}
              onClick={() => setSelectedRegion(regId)}
              className={`px-3 py-1.5 rounded-full transition-all duration-150 ${
                selectedRegion === regId
                  ? 'bg-starlight-white text-space-void font-semibold shadow-sm'
                  : 'bg-white/[0.03] text-starlight-dim border border-white/[0.08] hover:border-white/[0.20] hover:text-starlight-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Categories & Similarity Slider */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08] text-xs font-inter">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-starlight-subtle uppercase tracking-wider text-[11px] mr-1">ANALOG TYPES:</span>
            {[
              ['hyper-arid', 'Hyper-Arid'],
              ['sub-sea-level', 'Sub-Sea-Level Basin'],
              ['volcanic-basalt', 'Volcanic Basalt'],
              ['impact-crater', 'Impact Crater'],
              ['polar-desert', 'Polar Desert'],
            ].map(([catId, label]) => {
              const active = selectedCategories.includes(catId as AnalogCategory);
              return (
                <button
                  key={catId}
                  onClick={() => toggleCategory(catId as AnalogCategory)}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-150 ${
                    active
                      ? 'bg-earth text-space-void font-semibold'
                      : 'bg-white/[0.03] text-starlight-dim border border-white/[0.08] hover:border-white/[0.20]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/[0.08]">
            <span className="text-[11px] uppercase text-starlight-subtle">Min Similarity:</span>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(Number(e.target.value))}
              className="w-24 accent-mars cursor-pointer"
            />
            <span className="text-starlight-white font-bold font-grotesk">{minSimilarity}%</span>
          </div>
        </div>
      </div>

      {/* Main Visual Display: Google Maps Satellite GIS OR 3D Digital Globe OR 3D Topographic Mesh */}
      <div className="rounded-3xl overflow-hidden border border-white/[0.10] shadow-glass bg-space-surface">
        {displayMode === 'real-gis' && (
          <RealGISMap
            locations={filteredLocations}
            selectedLocationId={previewLocation.id}
            onSelectLocation={handleLocationSelect}
          />
        )}

        {displayMode === '3d-globe' && (
          <div className="p-4">
            <Real3DGlobe
              locations={filteredLocations}
              selectedLocationId={previewLocation.id}
              onSelectLocation={handleLocationSelect}
            />
          </div>
        )}

        {displayMode === '3d-topography' && (
          <div className="p-4">
            <Real3DTopography
              locationName={previewLocation.name}
              terrainType={previewLocation.geology.rockType}
              elevationDatum={`${previewLocation.elevationMeters}m MSL`}
              thermalRange={{ min: 4, max: 48, unit: '°C' }}
            />
          </div>
        )}
      </div>

      {/* Bottom Layout: Candidate Catalog Cards & Deep Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Filtered Candidate Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-inter text-starlight-subtle uppercase tracking-wider px-1">
            <span>Verified Candidate Catalog [{filteredLocations.length}]</span>
            <span className="text-earth font-mono text-[11px]">Ranked by Planetary Fidelity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === previewLocation.id;
              const isMars = loc.primaryTargetAnalog === 'mars';
              return (
                <div
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none relative overflow-hidden ${
                    isSelected
                      ? isMars
                        ? 'bg-space-card/90 border-2 border-mars shadow-mars-glow'
                        : 'bg-space-card/90 border-2 border-lunar shadow-cosmic-glow'
                      : 'glass-panel hover:border-white/[0.20]'
                  }`}
                >
                  {/* Continent Badge */}
                  {loc.continent && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-[10px] font-inter text-starlight-dim">
                      {loc.continent}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-earth font-bold">[{loc.flagCode}]</span>
                    <h3 className="font-grotesk font-bold text-base text-starlight-white truncate max-w-[200px]">
                      {loc.name.split(' (')[0]}
                    </h3>
                  </div>

                  <p className="font-inter text-xs text-starlight-dim mt-1">
                    {loc.region}, {loc.country}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-inter">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-starlight-subtle text-[11px]">Similarity:</span>
                      <span className="text-starlight-white font-bold font-grotesk text-sm">
                        {loc.overallSimilarity.toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-[11px] text-starlight-subtle">
                      Conf: {loc.confidenceScore.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Location Dossier Preview Drawer */}
        {previewLocation && (
          <div className="lg:col-span-5 glass-panel p-6 lg:p-7 rounded-3xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-starlight-subtle uppercase">
                    ID: {previewLocation.id}
                  </span>
                  {previewLocation.continent && (
                    <span className="text-[11px] font-inter text-earth font-medium">
                      {previewLocation.continent}
                    </span>
                  )}
                </div>
                <h2 className="font-grotesk font-bold text-xl lg:text-2xl text-starlight-white mt-1.5">
                  {previewLocation.name}
                </h2>
                <p className="font-inter text-xs text-starlight-dim mt-0.5">
                  {previewLocation.coordinates.display} • {previewLocation.elevationMeters}m MSL
                </p>
              </div>

              <div className="text-right">
                <div className="font-grotesk font-bold text-2xl text-mars">
                  {previewLocation.overallSimilarity.toFixed(1)}%
                </div>
                <div className="text-[10px] font-inter text-starlight-subtle uppercase">Fidelity Index</div>
              </div>
            </div>

            {/* High-Res Hero Thumbnail */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/[0.10] group">
              <img
                src={previewLocation.imagery.hero}
                alt={previewLocation.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-void/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs font-inter text-starlight-white bg-space-void/80 px-2.5 py-1 rounded-md border border-white/[0.12] backdrop-blur-md">
                Köppen Climate: {previewLocation.climateType}
              </div>
            </div>

            {/* Summary */}
            <p className="font-inter text-xs text-starlight-dim leading-relaxed">
              {previewLocation.summary}
            </p>

            {/* Geological Key Attributes */}
            <div className="space-y-2 text-xs font-inter pt-3 border-t border-white/[0.08]">
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">LITHOLOGY:</span>
                <span className="text-starlight-white text-right max-w-[220px] truncate" title={previewLocation.geology.rockType}>
                  {previewLocation.geology.rockType}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">DIURNAL RANGE:</span>
                <span className="text-mars font-semibold">{previewLocation.environment.diurnalRange}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">ANNUAL PRECIPITATION:</span>
                <span className="text-starlight-white">{previewLocation.environment.annualPrecipitation}</span>
              </div>
            </div>

            {/* Actions: Compare Engine & Full Profile */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleLaunchComparison}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider shadow-mars-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Compare Target</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleOpenProfile}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] text-starlight-white font-grotesk font-medium text-xs uppercase tracking-wider transition-all duration-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Dossier</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
