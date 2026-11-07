import React, { useState, useMemo } from 'react';
import { AnalogSite, AnalogCategory } from '../../types';
import { ANALOG_SITES } from '../../data/analogSites';
import { CartographicMap } from './CartographicMap';
import { formatCoordinates } from '../../utils/calculations';
import { Search, Compass, Layers, FileText, Sparkles, Filter, ChevronRight, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AnalogDiscoveryProps {
  onSelectSiteForProfile: (site: AnalogSite) => void;
  onSelectSiteForComparison: (site: AnalogSite) => void;
  onNavigate: (sectionId: string) => void;
}

export const AnalogDiscovery: React.FC<AnalogDiscoveryProps> = ({
  onSelectSiteForProfile,
  onSelectSiteForComparison,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<'ALL' | 'EGYPT' | 'MOON' | 'MARS'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<AnalogCategory | 'ALL'>('ALL');
  const [selectedSite, setSelectedSite] = useState<AnalogSite>(ANALOG_SITES[0]);
  const [hoveredSite, setHoveredSite] = useState<AnalogSite | null>(null);

  const filteredSites = useMemo(() => {
    return ANALOG_SITES.filter((site) => {
      // Planet / Egypt Filter
      if (selectedPlanetFilter === 'EGYPT' && !site.isEgyptianCandidate) return false;
      if (selectedPlanetFilter === 'MOON' && !site.targetPlanets.includes('Moon')) return false;
      if (selectedPlanetFilter === 'MARS' && !site.targetPlanets.includes('Mars')) return false;

      // Category Filter
      if (selectedCategory !== 'ALL' && !site.categories.includes(selectedCategory)) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = site.name.toLowerCase().includes(query);
        const matchRegion = site.region.toLowerCase().includes(query);
        const matchCountry = site.country.toLowerCase().includes(query);
        const matchGeol = site.geologicalDescription.toLowerCase().includes(query);
        const matchApps = site.testingApplications.some((app) => app.toLowerCase().includes(query));
        return matchName || matchRegion || matchCountry || matchGeol || matchApps;
      }

      return true;
    });
  }, [searchQuery, selectedPlanetFilter, selectedCategory]);

  return (
    <section id="discovery" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-obsidian">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
              <Compass className="w-4 h-4" />
              <span>MODULE 02 // EARTH ANALOG DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading-sci font-bold text-mineral-white">
              Global Terrestrial Analog Catalog
            </h2>
            <p className="text-sm font-sans text-stone-gray max-w-2xl">
              Identify natural geological proving grounds on Earth capable of testing lunar base structures and Mars rovers. Includes newly designated Egyptian candidate testbeds.
            </p>
          </div>

          {/* Quick Target Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono-sci text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedPlanetFilter('ALL');
              }}
              className={`px-3 py-1.5 border transition-all ${
                selectedPlanetFilter === 'ALL'
                  ? 'border-mineral-white bg-mineral-white text-charcoal font-bold'
                  : 'border-white/10 text-stone-gray hover:text-white hover:border-white/20'
              }`}
            >
              ALL SITES ({ANALOG_SITES.length})
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setSelectedPlanetFilter('EGYPT');
              }}
              className={`px-3 py-1.5 border transition-all flex items-center space-x-1.5 ${
                selectedPlanetFilter === 'EGYPT'
                  ? 'border-mars-rust bg-mars-rust text-white font-bold'
                  : 'border-mars-rust/40 text-mars-rust hover:bg-mars-rust/10'
              }`}
            >
              <span>★ EGYPT CANDIDATES (3)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedPlanetFilter('MOON');
              }}
              className={`px-3 py-1.5 border transition-all ${
                selectedPlanetFilter === 'MOON'
                  ? 'border-lunar-silver bg-lunar-silver text-charcoal font-bold'
                  : 'border-white/10 text-stone-gray hover:text-white'
              }`}
            >
              LUNA TARGETS
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedPlanetFilter('MARS');
              }}
              className={`px-3 py-1.5 border transition-all ${
                selectedPlanetFilter === 'MARS'
                  ? 'border-mars-rust bg-mars-rust/30 text-white font-bold'
                  : 'border-white/10 text-stone-gray hover:text-white'
              }`}
            >
              ARES TARGETS
            </button>
          </div>
        </div>

        {/* Search & Fine Category Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by site name, country, yardang, permafrost, basalt, sabkha..."
              className="w-full bg-charcoal border border-white/15 pl-9 pr-4 py-2.5 text-xs font-mono-sci text-mineral-white placeholder-stone-gray focus:outline-none focus:border-mars-rust transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray hover:text-white text-xs font-mono-sci"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Category Filter Selector */}
          <div className="md:col-span-5 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-gray flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                sound.playClick();
                setSelectedCategory(e.target.value as any);
              }}
              className="w-full bg-charcoal border border-white/15 px-3 py-2.5 text-xs font-mono-sci text-mineral-white focus:outline-none focus:border-mars-rust"
            >
              <option value="ALL">ALL ANALOG CATEGORIES</option>
              <option value="geological">GEOLOGICAL & STRATIGRAPHIC</option>
              <option value="arid-desert">ARID & HYPER-DESERT</option>
              <option value="extreme-temp">EXTREME TEMPERATURE</option>
              <option value="volcanic">VOLCANIC & BASALTIC</option>
              <option value="polar-ice">POLAR & PERMAFROST CRYOSPHERE</option>
              <option value="subsurface-cave">SUBSURFACE & LAVA TUBES</option>
              <option value="dust-erosion">DUST & AEOLIAN DYNAMICS</option>
            </select>
          </div>
        </div>

        {/* Interactive GIS Cartographic Map Engine */}
        <div className="space-y-2">
          <CartographicMap
            sites={filteredSites}
            selectedSite={selectedSite}
            onSelectSite={(site) => setSelectedSite(site)}
            hoveredSite={hoveredSite}
            onHoverSite={(site) => setHoveredSite(site)}
          />
        </div>

        {/* Selected Site Highlight Card + Catalog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Detailed Selected Site Banner (5 cols) */}
          {selectedSite && (
            <div className="lg:col-span-5 p-6 bg-charcoal border border-white/15 space-y-5 reticle-corner">
              {/* Site Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {selectedSite.isEgyptianCandidate ? (
                      <span className="px-2 py-0.5 bg-mars-rust text-white text-[10px] font-mono-sci font-bold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>EGYPTIAN CANDIDATE SITE</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-white/10 text-stone-gray text-[10px] font-mono-sci">
                        {selectedSite.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono-sci text-earth-accent font-semibold">
                    FIDELITY: {selectedSite.fidelityScore}%
                  </span>
                </div>

                <h3 className="text-2xl font-heading-sci font-bold text-mineral-white">
                  {selectedSite.name}
                </h3>
                <p className="text-xs font-mono-sci text-mars-rust">
                  {selectedSite.region}, {selectedSite.country} | {formatCoordinates(selectedSite.coordinates.lat, selectedSite.coordinates.lng)}
                </p>
              </div>

              {/* Egyptian Scientific Validation Advisory if applicable */}
              {selectedSite.isEgyptianCandidate && (
                <div className="p-3 bg-mars-rust/10 border border-mars-rust/30 flex items-start space-x-2.5 text-xs font-mono-sci text-mineral-white/90">
                  <ShieldAlert className="w-4 h-4 text-mars-rust flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-mars-rust font-bold block">SCIENTIFIC VALIDATION REQUIRED</span>
                    Candidate site undergoing quantitative geomorphological assessment for NASA Space Apps 2026.
                  </div>
                </div>
              )}

              {/* Geological Summary */}
              <p className="text-xs font-sans text-stone-gray leading-relaxed">
                {selectedSite.shortSummary}
              </p>

              {/* Environmental Metrics Mini-Bars */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono-sci text-stone-gray uppercase block">
                  ENVIRONMENTAL REGIME BENCHMARKS
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono-sci">
                  <div>
                    <div className="flex justify-between text-stone-gray text-[10px]">
                      <span>AEOLIAN DYNAMICS</span>
                      <span className="text-mineral-white">{selectedSite.metrics.aeolianDynamics}%</span>
                    </div>
                    <div className="w-full bg-obsidian h-1.5 mt-1 border border-white/5">
                      <div
                        className="bg-mars-rust h-full"
                        style={{ width: `${selectedSite.metrics.aeolianDynamics}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-gray text-[10px]">
                      <span>MINERALOGY MATCH</span>
                      <span className="text-mineral-white">{selectedSite.metrics.mineralMatch}%</span>
                    </div>
                    <div className="w-full bg-obsidian h-1.5 mt-1 border border-white/5">
                      <div
                        className="bg-earth-accent h-full"
                        style={{ width: `${selectedSite.metrics.mineralMatch}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-gray text-[10px]">
                      <span>TERRAIN ROUGHNESS</span>
                      <span className="text-mineral-white">{selectedSite.metrics.terrainRoughness}%</span>
                    </div>
                    <div className="w-full bg-obsidian h-1.5 mt-1 border border-white/5">
                      <div
                        className="bg-stone-gray h-full"
                        style={{ width: `${selectedSite.metrics.terrainRoughness}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-gray text-[10px]">
                      <span>THERMAL EXTREME</span>
                      <span className="text-mineral-white">{selectedSite.metrics.thermalExtreme}%</span>
                    </div>
                    <div className="w-full bg-obsidian h-1.5 mt-1 border border-white/5">
                      <div
                        className="bg-telemetry-amber h-full"
                        style={{ width: `${selectedSite.metrics.thermalExtreme}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    sound.playChirp();
                    onSelectSiteForProfile(selectedSite);
                  }}
                  className="flex-1 px-4 py-2.5 bg-mineral-white hover:bg-white text-charcoal text-xs font-mono-sci font-bold uppercase transition-colors flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>RESEARCH DOSSIER</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectSiteForComparison(selectedSite);
                    onNavigate('comparison');
                  }}
                  className="flex-1 px-4 py-2.5 bg-mars-rust hover:bg-mars-light text-white text-xs font-mono-sci font-bold uppercase transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>COMPARE TARGET</span>
                </button>
              </div>
            </div>
          )}

          {/* Catalog Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-sci text-stone-gray pb-1">
              <span>FILTERED SITES: {filteredSites.length} LOCATIONS</span>
              <span>CLICK TO CENTER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSites.map((site) => {
                const isSelected = selectedSite?.id === site.id;
                return (
                  <div
                    key={site.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSite(site);
                    }}
                    className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-mars-rust bg-charcoal shadow-technical-active'
                        : 'border-white/10 bg-charcoal/50 hover:border-white/25 hover:bg-charcoal'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-sci text-stone-gray">
                          {site.country.toUpperCase()}
                        </span>
                        {site.isEgyptianCandidate ? (
                          <span className="text-[9px] font-mono-sci px-1.5 py-0.5 bg-mars-rust/20 border border-mars-rust text-mars-rust font-semibold">
                            CANDIDATE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono-sci text-stone-gray">
                            {site.targetPlanets.join(' / ')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading-sci font-bold text-mineral-white text-base">
                        {site.name}
                      </h4>

                      <p className="text-xs font-sans text-stone-gray line-clamp-2">
                        {site.shortSummary}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs font-mono-sci border-t border-white/5 mt-3">
                      <span className="text-stone-gray">FIDELITY: <b className="text-mineral-white">{site.fidelityScore}%</b></span>
                      <span className="text-mars-rust flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                        <span>SELECT</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

