import React, { useState, useMemo, useEffect } from 'react';
import { ActiveScreen, AnalogLocation, AnalogCategory, PlanetaryTarget } from '../types';
import { RealGISMap } from '../components/common/RealGISMap';
import { Real3DGlobe } from '../components/canvas3d/Real3DGlobe';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { 
  Globe, 
  MapPin, 
  Search, 
  Layers, 
  ArrowRight, 
  Box, 
  Sparkles, 
  ExternalLink,
  FileText,
  Database
} from 'lucide-react';
import { generateAnalogAgencyUrls } from '../data/spaceAgencyResources';
import { orbialogApi } from '../services/orbialogApi';
import { audio } from '../utils/audio';

interface Screen3EarthDiscoveryProps {
  analogLocations: AnalogLocation[];
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
  onSelectAnalog: (analog: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenDataModal?: () => void;
}

export const Screen3EarthDiscovery: React.FC<Screen3EarthDiscoveryProps> = ({
  analogLocations = [],
  selectedTarget,
  selectedAnalog,
  onSelectAnalog,
  onNavigate,
  onOpenDataModal,
}) => {
  const [displayMode, setDisplayMode] = useState<'real-gis' | '3d-globe' | '3d-topography'>('real-gis');

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<'all' | 'moon' | 'mars'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<AnalogCategory[]>([]);
  const [minSimilarity, setMinSimilarity] = useState<number>(80);
  const [onlyHighFidelity, setOnlyHighFidelity] = useState<boolean>(false);
  const [previewLocation, setPreviewLocation] = useState<AnalogLocation>(selectedAnalog || analogLocations[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [imageError, setImageError] = useState<boolean>(false);
  const pageSize = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPlanetFilter, selectedRegion, selectedCategories, minSimilarity, onlyHighFidelity]);

  // Keep previewLocation synced when selectedAnalog changes
  useEffect(() => {
    if (selectedAnalog) {
      setPreviewLocation(selectedAnalog);
    } else if (analogLocations && analogLocations.length > 0) {
      setPreviewLocation(analogLocations[0]);
    }
  }, [selectedAnalog, analogLocations]);

  // Safe filter application logic
  const filteredLocations = useMemo(() => {
    if (!analogLocations || !Array.isArray(analogLocations)) return [];
    return analogLocations.filter((loc) => {
      if (!loc) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name?.toLowerCase().includes(q) ?? false;
        const matchesRegion = loc.region?.toLowerCase().includes(q) ?? false;
        const matchesCountry = loc.country?.toLowerCase().includes(q) ?? false;
        const matchesGeology = loc.geology?.rockType?.toLowerCase().includes(q) ?? false;
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

      const similarity = loc.overallSimilarity ?? 0;
      if (onlyHighFidelity && similarity < 92) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(loc.category as AnalogCategory)) {
        return false;
      }

      if (similarity < minSimilarity) {
        return false;
      }

      return true;
    });
  }, [analogLocations, searchQuery, selectedPlanetFilter, selectedRegion, onlyHighFidelity, selectedCategories, minSimilarity]);

  // Ensure active previewLocation is always valid
  const activeLocation = previewLocation || filteredLocations[0] || analogLocations[0];

  useEffect(() => {
    setImageError(false);
  }, [activeLocation?.id]);

  const [serverLocations, setServerLocations] = useState<AnalogLocation[]>([]);
  const [serverMeta, setServerMeta] = useState<{ total: number; page: number; limit: number; pages: number }>({
    total: filteredLocations.length,
    page: 1,
    limit: 10,
    pages: Math.ceil(filteredLocations.length / 10) || 1,
  });
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // Flowchart S3 --> S (GET /api/v1/sites with server-side pagination & filter params)
  useEffect(() => {
    let isMounted = true;
    orbialogApi.getSites({
      planet: selectedPlanetFilter !== 'all' ? selectedPlanetFilter : undefined,
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      q: searchQuery.trim() || undefined,
      minSimilarity: minSimilarity > 0 ? minSimilarity : undefined,
      page: currentPage,
      limit: 10,
    }).then((res) => {
      if (isMounted) {
        setServerLocations(res.data);
        setServerMeta(res.meta);
        setIsLiveApi(res.isLive);
      }
    });
    return () => { isMounted = false; };
  }, [searchQuery, selectedPlanetFilter, selectedCategories, minSimilarity, currentPage]);

  const totalCount = serverMeta.total || filteredLocations.length;
  const totalPages = serverMeta.pages || Math.ceil(totalCount / 10) || 1;
  const paginatedLocations = serverLocations.length > 0
    ? serverLocations
    : filteredLocations.slice((currentPage - 1) * 10, currentPage * 10);

  const handleLocationSelect = (loc: AnalogLocation) => {
    audio.playClick?.();
    setPreviewLocation(loc);
    onSelectAnalog(loc);
  };

  const handleLaunchComparison = () => {
    audio.playConfirm?.();
    onNavigate('comparison');
  };

  const handleOpenProfile = () => {
    audio.playClick?.();
    onNavigate('profile');
  };

  const toggleCategory = (cat: AnalogCategory) => {
    audio.playClick?.();
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
            <span className="text-starlight-white font-semibold">{selectedTarget?.name || 'Jezero Crater'}</span>
          </p>
        </div>

        {/* View Mode Switcher: Google Maps vs 3D Globe vs 3D Topography */}
        <div className="flex items-center p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => { audio.playClick?.(); setDisplayMode('real-gis'); }}
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
            onClick={() => { audio.playClick?.(); setDisplayMode('3d-globe'); }}
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
            onClick={() => { audio.playClick?.(); setDisplayMode('3d-topography'); }}
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
                onClick={() => { audio.playClick?.(); setSelectedPlanetFilter(pf); }}
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
            onClick={() => { audio.playClick?.(); setOnlyHighFidelity(!onlyHighFidelity); }}
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
              onClick={() => { audio.playClick?.(); setSelectedRegion(regId); }}
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
            selectedLocationId={activeLocation?.id || null}
            onSelectLocation={handleLocationSelect}
          />
        )}

        {displayMode === '3d-globe' && (
          <div className="p-4">
            <Real3DGlobe
              locations={filteredLocations}
              selectedLocationId={activeLocation?.id || null}
              onSelectLocation={handleLocationSelect}
            />
          </div>
        )}

        {displayMode === '3d-topography' && (
          <div className="p-4">
            <Real3DTopography
              locationName={activeLocation?.name || 'White Desert'}
              terrainType={activeLocation?.geology?.rockType || 'Yardangs & Chalk Deflation'}
              elevationDatum={`${activeLocation?.elevationMeters || 172}m MSL`}
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
            {paginatedLocations.map((loc) => {
              const isSelected = loc.id === activeLocation?.id;
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
                    <span className="text-xs font-mono text-earth font-bold">[{loc.flagCode || 'SITE'}]</span>
                    <h3 className="font-grotesk font-bold text-base text-starlight-white truncate max-w-[200px]">
                      {loc.name?.split(' (')[0] || loc.id}
                    </h3>
                  </div>

                  <p className="font-inter text-xs text-starlight-dim mt-1">
                    {loc.region}, {loc.country}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2 text-xs font-inter">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-starlight-subtle text-[11px]">Similarity:</span>
                        <span className="text-starlight-white font-bold font-grotesk text-sm">
                          {(loc.overallSimilarity ?? 85).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-starlight-subtle">
                        Conf: {(loc.confidenceScore ?? 90).toFixed(0)}%
                      </div>
                    </div>

                    {/* Real Multi-Agency Telemetry Micro-Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-starlight-dim">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-earth">
                        NASA: {loc.earthdataGranules?.gdemId ? loc.earthdataGranules.gdemId.split('_')[0] : 'ASTER GDEM'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-starlight-white">
                        CSA SAR: {loc.csaRadarsatProducts?.backscatterSigma0Db ?? -14.6} dB
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-telemetry-emerald">
                        JAXA SMC: {loc.jaxaGportalProducts?.amsr2SoilMoisturePercent ?? 2.8}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs">
              <span className="text-starlight-dim text-[11px]">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount} Sites
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => { audio.playClick?.(); setCurrentPage((p) => Math.max(1, p - 1)); }}
                  className="px-3 py-1 rounded bg-white/[0.05] border border-white/[0.10] text-starlight-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.10] transition-colors"
                >
                  ‹ PREV
                </button>
                <span className="px-2 text-earth font-bold">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => { audio.playClick?.(); setCurrentPage((p) => Math.min(totalPages, p + 1)); }}
                  className="px-3 py-1 rounded bg-white/[0.05] border border-white/[0.10] text-starlight-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.10] transition-colors"
                >
                  NEXT ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected Location Dossier Preview Drawer */}
        {activeLocation && (
          <div className="lg:col-span-5 glass-panel p-6 lg:p-7 rounded-3xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-starlight-subtle uppercase">
                    ID: {activeLocation.id}
                  </span>
                  {activeLocation.continent && (
                    <span className="text-[11px] font-inter text-earth font-medium">
                      {activeLocation.continent}
                    </span>
                  )}
                </div>
                <h2 className="font-grotesk font-bold text-xl lg:text-2xl text-starlight-white mt-1.5">
                  {activeLocation.name}
                </h2>
                <p className="font-inter text-xs text-starlight-dim mt-0.5">
                  {activeLocation.coordinates?.display || `${activeLocation.coordinates?.lat}, ${activeLocation.coordinates?.lng}`} • {activeLocation.elevationMeters}m MSL
                </p>
              </div>

              <div className="text-right">
                <div className="font-grotesk font-bold text-2xl text-mars">
                  {(activeLocation.overallSimilarity ?? 85).toFixed(1)}%
                </div>
                <div className="text-[10px] font-inter text-starlight-subtle uppercase">Fidelity Index</div>
              </div>
            </div>

            {/* High-Res Hero Thumbnail */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/[0.10] group">
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-space-void font-mono text-[10px] text-starlight-subtle">
                  REFERENCE IMAGE UNAVAILABLE
                </div>
              ) : (
                <img
                  src={activeLocation.imagery?.hero || activeLocation.imagery?.satellite}
                  alt={activeLocation.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-space-void/90 via-transparent to-transparent" />
              {activeLocation.imagery?.heroAttribution && (
                <a
                  href={activeLocation.imagery.heroAttribution.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 rounded-md border border-white/[0.12] bg-space-void/80 px-2 py-1 text-[9px] text-starlight-white backdrop-blur-md"
                >
                  {activeLocation.imagery.heroAttribution.label}
                </a>
              )}
              <div className="absolute bottom-3 left-3 text-xs font-inter text-starlight-white bg-space-void/80 px-2.5 py-1 rounded-md border border-white/[0.12] backdrop-blur-md">
                Köppen Climate: {activeLocation.climateType || 'Hyper-Arid'}
              </div>
            </div>

            {/* Summary */}
            <p className="font-inter text-xs text-starlight-dim leading-relaxed">
              {activeLocation.summary}
            </p>

            {/* Geological Key Attributes */}
            <div className="space-y-2 text-xs font-inter pt-3 border-t border-white/[0.08]">
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">LITHOLOGY:</span>
                <span className="text-starlight-white text-right max-w-[220px] truncate" title={activeLocation.geology?.rockType}>
                  {activeLocation.geology?.rockType || 'Basaltic regolith & lacustrine clays'}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">DIURNAL RANGE:</span>
                <span className="text-mars font-semibold">{activeLocation.environment?.diurnalRange || '4 °C to 48 °C'}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-starlight-subtle uppercase text-[11px]">ANNUAL PRECIPITATION:</span>
                <span className="text-starlight-white">{activeLocation.environment?.annualPrecipitation || '< 10 mm / year'}</span>
              </div>
            </div>

            {/* Real Space Agency Remote Sensing Telemetry Matrix */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-grotesk font-semibold uppercase tracking-wider text-starlight-subtle flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-earth" />
                  <span>Calibrated Space Agency Granules &amp; Telemetry</span>
                </span>
                {onOpenDataModal && (
                  <button
                    onClick={onOpenDataModal}
                    className="text-[11px] text-earth hover:text-starlight-bright font-medium"
                  >
                    API Hub ↗
                  </button>
                )}
              </div>

              {/* 4-Agency Sensor Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-inter">
                {/* NASA Earthdata */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] font-mono text-starlight-subtle uppercase flex items-center justify-between">
                    <span>🇺🇸 NASA EARTHDATA</span>
                    <span className="text-earth">ASTER / MODIS</span>
                  </div>
                  <div className="text-starlight-white font-mono text-[11px] truncate" title={activeLocation.earthdataGranules?.gdemId || `${activeLocation.id}_GDEM_v3`}>
                    {activeLocation.earthdataGranules?.gdemId || `${activeLocation.id.toUpperCase()}_GDEM_v3`}
                  </div>
                  <div className="text-[10px] text-starlight-dim">
                    LST: <strong className="text-starlight-white">{activeLocation.earthdataGranules?.modisLstId || 'MOD11A2_LST_1km'}</strong>
                  </div>
                </div>

                {/* ESA Copernicus */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] font-mono text-starlight-subtle uppercase flex items-center justify-between">
                    <span>🇪🇺 ESA COPERNICUS</span>
                    <span className="text-earth">SENTINEL-1/2</span>
                  </div>
                  <div className="text-starlight-white font-mono text-[11px]">
                    Ferric Iron: <strong className="text-starlight-white">{activeLocation.copernicusProducts?.ferricIronIndex ?? 1.84}</strong>
                  </div>
                  <div className="text-[10px] text-starlight-dim">
                    Clay Index: <strong className="text-starlight-white">{activeLocation.copernicusProducts?.clayIndex ?? 2.12}</strong>
                  </div>
                </div>

                {/* CSA RADARSAT */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] font-mono text-starlight-subtle uppercase flex items-center justify-between">
                    <span>🇨🇦 CSA RADARSAT</span>
                    <span className="text-mars">C-BAND SAR</span>
                  </div>
                  <div className="text-starlight-white font-mono text-[11px]">
                    σ⁰: <strong className="text-mars">{activeLocation.csaRadarsatProducts?.backscatterSigma0Db ?? -14.6} dB</strong>
                  </div>
                  <div className="text-[10px] text-starlight-dim truncate" title={activeLocation.csaRadarsatProducts?.rcmGranuleId || 'RCM_MEDRES'}>
                    {activeLocation.csaRadarsatProducts?.polarization || 'HH / HV Quad-Pol'}
                  </div>
                </div>

                {/* JAXA G-Portal */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] font-mono text-starlight-subtle uppercase flex items-center justify-between">
                    <span>🇯🇵 JAXA G-PORTAL</span>
                    <span className="text-telemetry-emerald">AMSR2 / GCOM</span>
                  </div>
                  <div className="text-starlight-white font-mono text-[11px]">
                    Soil Moisture: <strong className="text-telemetry-emerald">{activeLocation.jaxaGportalProducts?.amsr2SoilMoisturePercent ?? 2.8}%</strong>
                  </div>
                  <div className="text-[10px] text-starlight-dim">
                    Precip: <strong className="text-starlight-white">{activeLocation.jaxaGportalProducts?.gpmPrecipitationMmHr ?? 0.02} mm/hr</strong>
                  </div>
                </div>
              </div>

              {/* Direct Repository Links */}
              {(() => {
                const lat = activeLocation.coordinates?.lat ?? 0;
                const lng = activeLocation.coordinates?.lng ?? 0;
                const urls = generateAnalogAgencyUrls(lat, lng, activeLocation.name || 'Analog');
                return (
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-inter pt-1">
                    <a
                      href={urls.nasaEarthdata}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium group-hover:text-earth transition-colors">NASA Earthdata</span>
                      <ExternalLink className="w-3 h-3 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.nasaWorldview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium group-hover:text-earth transition-colors">NASA Worldview</span>
                      <ExternalLink className="w-3 h-3 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.esaCopernicus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium group-hover:text-earth transition-colors">ESA Copernicus</span>
                      <ExternalLink className="w-3 h-3 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.csaRadarsat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium group-hover:text-earth transition-colors">CSA RADARSAT</span>
                      <ExternalLink className="w-3 h-3 text-starlight-subtle group-hover:text-earth" />
                    </a>
                  </div>
                );
              })()}
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
