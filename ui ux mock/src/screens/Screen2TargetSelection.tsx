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
  Eye,
  Info,
  Box,
  Sparkles,
  ShieldAlert,
  Flame,
  Globe
} from 'lucide-react';

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
    setActivePlanetTab(p);
    const firstOfPlanet = planetaryTargets.find((t) => t.planet === p);
    if (firstOfPlanet) onSelectTarget(firstOfPlanet);
  };

  const handleTargetClick = (target: PlanetaryTarget) => {
    onSelectTarget(target);
  };

  const handleProceedToDiscovery = () => {
    onNavigate('discovery');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-space-void px-6 lg:px-8 py-10 space-y-10 max-w-7xl mx-auto">
      {/* Header & Planet Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-inter font-medium text-earth uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-earth animate-pulse"></span>
            <span>Mission Destination Catalog // Step 01</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl sm:text-4xl md:text-5xl text-starlight-white tracking-tight">
            Planetary Target Selection
          </h1>
          <p className="font-inter text-starlight-dim text-sm md:text-base max-w-2xl leading-relaxed">
            Select an extraterrestrial operational target. ORBiALOG calibrates its lithological, elevation, and thermal datasets to rank the highest-fidelity terrestrial analogs on Earth.
          </p>
        </div>

        {/* Studio-Grade Segmented Planet Switcher */}
        <div className="flex items-center p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => handleSelectPlanetTab('moon')}
            className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-full font-grotesk text-xs uppercase tracking-wider transition-all duration-200 ${
              activePlanetTab === 'moon'
                ? 'bg-white text-space-void font-bold shadow-glass'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>The Moon (Luna)</span>
          </button>

          <button
            onClick={() => handleSelectPlanetTab('mars')}
            className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-full font-grotesk text-xs uppercase tracking-wider transition-all duration-200 ${
              activePlanetTab === 'mars'
                ? 'bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-bold shadow-mars-glow'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Mars (Ares)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Target Cards, Right High-Res Telemetry Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Target Cards List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-inter text-starlight-subtle uppercase tracking-wider px-1">
            <span>Available {activePlanetTab} Sites [{filteredTargets.length}]</span>
            <span className="text-earth font-mono text-[11px]">NASA PDS Calibrated</span>
          </div>

          <div className="space-y-3">
            {filteredTargets.map((target) => {
              const isSelected = target.id === selectedTarget.id;
              const isMars = target.planet === 'mars';
              return (
                <div
                  key={target.id}
                  onClick={() => handleTargetClick(target)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none relative ${
                    isSelected
                      ? isMars
                        ? 'bg-space-card/90 border-2 border-mars shadow-mars-glow'
                        : 'bg-space-card/90 border-2 border-lunar shadow-cosmic-glow'
                      : 'glass-panel hover:border-white/[0.20]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-starlight-dim uppercase tracking-wider">
                          {target.designation}
                        </span>
                        {isSelected && (
                          <span className="flex items-center space-x-1 font-inter text-[11px] text-earth font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active Selection</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-grotesk font-bold text-lg text-starlight-white mt-2">
                        {target.name}
                      </h3>
                      <p className="font-inter text-xs text-starlight-dim mt-0.5">
                        {target.coordinates} • {target.elevation.split(' (')[0]}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-starlight-subtle uppercase">LITHOLOGY</div>
                      <div className="text-sm font-grotesk font-bold text-starlight-white">
                        {target.metrics.mineralMatchIndex}%
                      </div>
                    </div>
                  </div>

                  <p className="font-inter text-xs text-starlight-dim mt-3 line-clamp-2 leading-relaxed">
                    {target.geologicalContext}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-inter text-starlight-subtle">
                    <span>Target Surface: {target.surfaceType}</span>
                    <span className="text-earth font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Inspect Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Note */}
          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-starlight-white font-grotesk font-medium text-xs">
              <Info className="w-4 h-4 text-earth" />
              <span>Extraterrestrial Baseline Model</span>
            </div>
            <p className="text-xs text-starlight-subtle leading-relaxed">
              Every target encapsulates orbital DTMs from Mars Reconnaissance Orbiter (HiRISE/CTX) or Lunar Reconnaissance Orbiter (LOLA), setting the benchmark for terrestrial analog discovery.
            </p>
          </div>
        </div>

        {/* Right Column: High-Resolution Planetary Dossier & 3D Topography */}
        <div className="lg:col-span-7 glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-5 gap-4">
            <div>
              <div className="text-[11px] font-mono text-starlight-subtle uppercase tracking-wider">
                Planetary Mission Report // {selectedTarget.designation}
              </div>
              <h2 className="font-grotesk font-bold text-2xl lg:text-3xl text-starlight-white mt-1">
                {selectedTarget.name}
              </h2>
            </div>

            <button
              onClick={handleProceedToDiscovery}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider shadow-mars-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Match Earth Analogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Image & Sensor Mode Switcher OR Interactive 3D Mesh */}
          <div className="space-y-3">
            {activeImageMode === '3d-mesh' ? (
              <Real3DTopography
                locationName={selectedTarget.name}
                isPlanetaryTarget={true}
                terrainType={selectedTarget.surfaceType}
                elevationDatum={selectedTarget.elevation.split(' (')[0]}
                thermalRange={{
                  min: selectedTarget.temperatureRange.min,
                  max: selectedTarget.temperatureRange.max,
                  unit: selectedTarget.temperatureRange.unit,
                }}
              />
            ) : (
              <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/[0.10] bg-space-surface group">
                <img
                  src={selectedTarget.imagery[activeImageMode]}
                  alt={selectedTarget.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-void via-transparent to-transparent opacity-75" />

                <div className="absolute top-4 left-4 text-xs font-mono bg-space-void/80 border border-white/[0.12] px-3 py-1.5 rounded-lg text-starlight-bright backdrop-blur-md">
                  COORDS: {selectedTarget.coordinates} | DATUM: {selectedTarget.planet === 'mars' ? 'MOLA AREOID' : 'LOLA 1737.4 km'}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs font-inter bg-space-void/80 border border-white/[0.12] px-3 py-1.5 rounded-lg text-starlight-white backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-telemetry-emerald"></span>
                  <span className="font-medium uppercase">{activeImageMode} ACTIVE</span>
                </div>
              </div>
            )}

            {/* View Mode Switcher Pills */}
            <div className="flex items-center justify-end space-x-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              {(
                [
                  ['overview', 'Orbital Optical'],
                  ['elevationMap', 'DTM Elevation'],
                  ['spectralOverlay', 'Spectral Mineralogy'],
                  ['3d-mesh', 'Interactive 3D Topography'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setActiveImageMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-inter transition-all duration-150 ${
                    activeImageMode === mode
                      ? 'bg-white text-space-void font-semibold shadow-sm'
                      : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Parameter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="text-[10px] font-mono text-starlight-subtle uppercase">TEMPERATURE</div>
              <div className="text-sm font-grotesk font-bold text-starlight-white mt-1">
                {selectedTarget.temperatureRange.min}° to {selectedTarget.temperatureRange.max}°{selectedTarget.temperatureRange.unit}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="text-[10px] font-mono text-starlight-subtle uppercase">SURFACE GRAVITY</div>
              <div className="text-sm font-grotesk font-bold text-starlight-white mt-1">
                {selectedTarget.gravity}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="text-[10px] font-mono text-starlight-subtle uppercase">BAROMETRIC PRESSURE</div>
              <div className="text-sm font-grotesk font-bold text-starlight-white mt-1">
                {selectedTarget.pressure}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="text-[10px] font-mono text-starlight-subtle uppercase">SOLAR INSOLATION</div>
              <div className="text-sm font-grotesk font-bold text-starlight-white mt-1">
                {selectedTarget.illumination.split(' (')[0]}
              </div>
            </div>
          </div>

          {/* Geological Context & Primary Objectives */}
          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-xs font-inter font-semibold uppercase tracking-wider text-starlight-dim">
                Geological & Geomorphological Profile
              </h4>
              <p className="text-sm text-starlight-muted font-inter leading-relaxed mt-1">
                {selectedTarget.geologicalContext}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-inter font-semibold uppercase tracking-wider text-starlight-dim">
                Key Science & Mission Objectives
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {selectedTarget.keyObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-starlight-dim">
                    <CheckCircle2 className="w-3.5 h-3.5 text-earth mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
