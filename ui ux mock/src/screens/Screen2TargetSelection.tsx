import React, { useState } from 'react';
import { ActiveScreen, PlanetaryTarget, PlanetId } from '../types';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { 
  Compass, 
  MapPin, 
  Thermometer, 
  Activity, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Eye,
  Info,
  Box
} from 'lucide-react';
import { audio } from '../utils/audio';

interface Screen2TargetSelectionProps {
  planetaryTargets: PlanetaryTarget[];
  selectedTarget: PlanetaryTarget;
  onSelectTarget: (target: PlanetaryTarget) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen2TargetSelection: React.FC<Screen2TargetSelectionProps> = ({
  planetaryTargets,
  selectedTarget,
  onSelectTarget,
  onNavigate,
}) => {
  const [activePlanetTab, setActivePlanetTab] = useState<PlanetId>(selectedTarget.planet);
  const [activeImageMode, setActiveImageMode] = useState<'overview' | 'elevationMap' | 'spectralOverlay' | '3d-mesh'>('overview');

  const filteredTargets = planetaryTargets.filter((t) => t.planet === activePlanetTab);

  const handleSelectPlanetTab = (p: PlanetId) => {
    audio.playClick();
    setActivePlanetTab(p);
    const firstOfPlanet = planetaryTargets.find((t) => t.planet === p);
    if (firstOfPlanet) onSelectTarget(firstOfPlanet);
  };

  const handleTargetClick = (target: PlanetaryTarget) => {
    audio.playConfirm();
    onSelectTarget(target);
  };

  const handleProceedToDiscovery = () => {
    audio.playConfirm();
    onNavigate('discovery');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header & Mission Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-obsidian-border pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-wider mb-2">
            <span className="text-mars font-bold">MISSION STEP 01</span>
            <span>//</span>
            <span>DESTINATION SPECIFICATION & 3D CRATER RELIEF</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
            Planetary Target Selection
          </h1>
          <p className="font-inter text-stone-gray text-sm md:text-base mt-2 max-w-2xl">
            Select an extraterrestrial mission operational environment. ORBiALOG uses the target's geological,
            thermal, and elevation profile to compute terrestrial analog matches on Earth.
          </p>
        </div>

        {/* Planet Toggle Selector (Moon vs Mars) */}
        <div className="flex items-center space-x-2 font-mono text-xs border border-obsidian-border bg-obsidian-card p-1">
          <button
            onClick={() => handleSelectPlanetTab('moon')}
            className={`flex items-center space-x-2 px-5 py-2.5 transition-all ${
              activePlanetTab === 'moon'
                ? 'bg-lunar text-charcoal font-bold shadow-md'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-lunar-bright"></span>
            <span className="uppercase tracking-wider">THE MOON (LUNA)</span>
          </button>

          <button
            onClick={() => handleSelectPlanetTab('mars')}
            className={`flex items-center space-x-2 px-5 py-2.5 transition-all ${
              activePlanetTab === 'mars'
                ? 'bg-mars text-mineral-white font-bold shadow-md'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-mars-glow"></span>
            <span className="uppercase tracking-wider">MARS (ARES)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Target Cards on Left, Detailed Destination Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Target Cards List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-xs text-stone-gray uppercase tracking-wider flex items-center justify-between">
            <span>AVAILABLE {activePlanetTab.toUpperCase()} SITES [{filteredTargets.length}]</span>
            <span className="text-[10px] text-telemetry-cyan">ORBITAL RESOLUTION: SUB-METER</span>
          </div>

          <div className="space-y-3">
            {filteredTargets.map((target) => {
              const isSelected = target.id === selectedTarget.id;
              return (
                <div
                  key={target.id}
                  onClick={() => handleTargetClick(target)}
                  className={`p-5 cursor-pointer border transition-all duration-200 select-none relative ${
                    isSelected
                      ? 'bg-obsidian-surface border-mars shadow-lg ring-1 ring-mars/40'
                      : 'bg-obsidian hover:bg-obsidian-card border-obsidian-border'
                  }`}
                >
                  {/* Active Indicator Strip */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-mars"></div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-obsidian-card border border-stone-gray/30 text-stone-gray uppercase">
                          {target.designation}
                        </span>
                        {isSelected && (
                          <span className="flex items-center space-x-1 font-mono text-[10px] text-mars font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>MISSION TARGET LOCKED</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-grotesk font-bold text-lg text-mineral-white mt-1.5">
                        {target.name}
                      </h3>
                      <p className="font-mono text-xs text-stone-gray mt-0.5">
                        {target.coordinates}
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-stone-dark text-[10px] uppercase">ELEVATION</div>
                      <div className="text-mineral-white text-xs font-medium">{target.elevation.split(' (')[0]}</div>
                    </div>
                  </div>

                  <p className="font-inter text-xs text-mineral-muted mt-3 line-clamp-2 leading-relaxed">
                    {target.geologicalContext}
                  </p>

                  <div className="mt-4 pt-3 border-t border-obsidian-border flex items-center justify-between font-mono text-[11px] text-stone-gray">
                    <span>PRIMARY SIMILARITY: {target.metrics.mineralMatchIndex}% GEOLOGY</span>
                    <span className="text-mars flex items-center space-x-1 hover:underline">
                      <span>INSPECT DATASET</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 bg-obsidian/70 border border-obsidian-border font-mono text-xs text-stone-gray space-y-2">
            <div className="flex items-center space-x-2 text-mineral-white font-semibold">
              <Info className="w-4 h-4 text-telemetry-cyan" />
              <span>MISSION ARCHITECTURE NOTICE</span>
            </div>
            <p className="text-[11px] leading-relaxed text-mineral-dim">
              Selecting a target initializes the multi-parametric search query across our terrestrial database of 10+ certified field locations, prioritizing candidates with matching geological lithology, surface roughness, and slope variances.
            </p>
          </div>
        </div>

        {/* Right Column: Deep Planetary Target Dossier */}
        <div className="lg:col-span-7 space-y-6 bg-obsidian border border-obsidian-border p-6 lg:p-8">
          {/* Top Dossier Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-border pb-4 gap-3">
            <div>
              <div className="font-mono text-[10px] text-stone-gray uppercase tracking-widest">
                TARGET TELEMETRY REPORT // {selectedTarget.designation}
              </div>
              <h2 className="font-grotesk font-bold text-2xl lg:text-3xl text-mineral-white uppercase mt-0.5">
                {selectedTarget.name}
              </h2>
            </div>

            <button
              onClick={handleProceedToDiscovery}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider transition-all duration-150 shadow-md font-semibold"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>DISCOVER EARTH ANALOGS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Image & Sensor Overlay Switcher OR Real 3D Topographic Mesh */}
          <div className="space-y-3">
            {activeImageMode === '3d-mesh' ? (
              <Real3DTopography
                locationName={selectedTarget.name}
                isPlanetaryTarget={true}
                terrainType={selectedTarget.surfaceType}
                elevationDatum={selectedTarget.elevation.split(' (')[0]}
                thermalRange={{ min: selectedTarget.temperatureRange.min, max: selectedTarget.temperatureRange.max, unit: selectedTarget.temperatureRange.unit }}
              />
            ) : (
              <div className="relative w-full h-72 md:h-80 bg-charcoal-deep border border-obsidian-border overflow-hidden group">
                <img
                  src={selectedTarget.imagery[activeImageMode]}
                  alt={selectedTarget.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-transparent to-transparent opacity-80"></div>

                {/* Coordinates Reticle Overlay */}
                <div className="absolute top-3 left-3 font-mono text-[10px] bg-charcoal/80 border border-stone-gray/30 px-2.5 py-1 text-mineral-white">
                  LOC: {selectedTarget.coordinates} | DATUM: {selectedTarget.planet === 'mars' ? 'MOLA AREOID' : 'LOLA 1737.4 km'}
                </div>

                {/* Mode Badges */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center space-x-2 bg-charcoal/90 px-3 py-1.5 border border-obsidian-border">
                    <span className="w-2 h-2 rounded-full bg-telemetry-emerald"></span>
                    <span className="text-mineral-white uppercase">{activeImageMode} ACTIVE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mode Switcher Buttons */}
            <div className="flex items-center justify-end space-x-1 font-mono text-[11px] bg-obsidian-card p-1 border border-obsidian-border">
              {(
                [
                  ['overview', 'Orbital Visual'],
                  ['elevationMap', 'DTM Relief'],
                  ['spectralOverlay', 'Spectra'],
                  ['3d-mesh', 'Real 3D Mesh'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => {
                    audio.playClick();
                    setActiveImageMode(mode);
                  }}
                  className={`px-3 py-1 uppercase transition-colors ${
                    activeImageMode === mode
                      ? 'bg-mars text-mineral-white font-bold'
                      : 'text-stone-gray hover:text-mineral-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Physical & Environmental Parameter Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-obsidian-card border border-obsidian-border">
              <div className="text-[10px] text-stone-dark uppercase">SURFACE GRAVITY</div>
              <div className="text-mineral-white font-semibold mt-1">{selectedTarget.gravity}</div>
            </div>

            <div className="p-3 bg-obsidian-card border border-obsidian-border">
              <div className="text-[10px] text-stone-dark uppercase">ATMOSPHERE PRESSURE</div>
              <div className="text-mineral-white font-semibold mt-1">{selectedTarget.pressure}</div>
            </div>

            <div className="p-3 bg-obsidian-card border border-obsidian-border">
              <div className="text-[10px] text-stone-dark uppercase">THERMAL LST RANGE</div>
              <div className="text-mars font-bold mt-1">
                {selectedTarget.temperatureRange.min} to {selectedTarget.temperatureRange.max} {selectedTarget.temperatureRange.unit}
              </div>
            </div>

            <div className="p-3 bg-obsidian-card border border-obsidian-border">
              <div className="text-[10px] text-stone-dark uppercase">ELEVATION BOUNDS</div>
              <div className="text-mineral-white font-semibold mt-1 truncate" title={selectedTarget.elevation}>
                {selectedTarget.elevation.split(' (')[0]}
              </div>
            </div>
          </div>

          {/* Detailed Scientific Characteristics */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="font-mono text-xs text-stone-gray uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-mars" />
                <span>SURFACE REGOLITH & LITHOLOGY</span>
              </div>
              <p className="font-inter text-sm text-mineral-muted leading-relaxed">
                {selectedTarget.surfaceType}
              </p>
            </div>

            <div>
              <div className="font-mono text-xs text-stone-gray uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-telemetry-cyan" />
                <span>PRIMARY MORPHOLOGICAL FEATURES</span>
              </div>
              <ul className="space-y-1.5 font-inter text-xs text-mineral-muted">
                {selectedTarget.primaryFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-mars font-mono font-bold">›</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs text-stone-gray uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-earth-bright" />
                <span>KEY EXPLORATION & OPERATIONAL OBJECTIVES</span>
              </div>
              <ul className="space-y-1.5 font-inter text-xs text-mineral-muted">
                {selectedTarget.keyObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-earth-bright font-mono font-bold">›</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Primary Datasets Ingested */}
          <div className="pt-4 border-t border-obsidian-border">
            <div className="font-mono text-xs text-stone-gray uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-telemetry-amber" />
              <span>INGESTED MISSION DATASETS (PDS & ESA)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {selectedTarget.primaryDatasets.map((ds, idx) => (
                <div key={idx} className="p-2.5 bg-obsidian-card border border-obsidian-border font-mono text-[11px]">
                  <div className="text-mineral-white font-medium">{ds.name}</div>
                  <div className="text-stone-gray text-[10px] mt-0.5">{ds.mission} • {ds.resolution}</div>
                  <div className="text-telemetry-cyan text-[9px] mt-1">{ds.linkTitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
