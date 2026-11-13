import React, { useState } from 'react';
import { 
  ActiveScreen, 
  PlanetaryTarget, 
  AnalogLocation 
} from '../types';
import { RadarChart, RadarDataPoint } from '../components/common/RadarChart';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { 
  GitCompare, 
  ArrowRight, 
  Layers, 
  Activity, 
  Thermometer, 
  ChevronDown, 
  Box, 
  Eye,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface Screen4ComparisonEngineProps {
  planetaryTargets: PlanetaryTarget[];
  analogLocations: AnalogLocation[];
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
  onSelectTarget: (target: PlanetaryTarget) => void;
  onSelectAnalog: (analog: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen4ComparisonEngine: React.FC<Screen4ComparisonEngineProps> = ({
  planetaryTargets,
  analogLocations,
  selectedTarget,
  selectedAnalog,
  onSelectTarget,
  onSelectAnalog,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'satellite' | '3d-mesh'>('satellite');

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = planetaryTargets.find((t) => t.id === e.target.value);
    if (target) onSelectTarget(target);
  };

  const handleAnalogChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const analog = analogLocations.find((a) => a.id === e.target.value);
    if (analog) onSelectAnalog(analog);
  };

  // Construct Multi-Axis Radar Dataset
  const radarData: RadarDataPoint[] = [
    {
      axis: 'Geological Mineralogy',
      targetValue: selectedTarget.metrics.mineralMatchIndex,
      analogValue: selectedAnalog.metrics.geologicalSimilarity,
    },
    {
      axis: 'Surface Roughness',
      targetValue: selectedTarget.metrics.roughnessIndex,
      analogValue: selectedAnalog.metrics.terrainRoughness,
    },
    {
      axis: 'Slope Variance',
      targetValue: selectedTarget.metrics.slopeVariance,
      analogValue: selectedAnalog.metrics.slopeDistribution,
    },
    {
      axis: 'Thermal Response',
      targetValue: selectedTarget.metrics.thermalInertia,
      analogValue: selectedAnalog.metrics.thermalDeltaMatch,
    },
    {
      axis: 'Granulometry',
      targetValue: selectedTarget.metrics.morphologyScore,
      analogValue: selectedAnalog.metrics.granulometryMatch,
    },
    {
      axis: 'Volatiles / H₂O Analogy',
      targetValue: selectedTarget.metrics.volatilePotential,
      analogValue: selectedAnalog.metrics.volatilesAnalogy,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-space-void px-6 lg:px-8 py-10 space-y-10 max-w-7xl mx-auto">
      {/* Header & Mission Step */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-inter font-medium text-earth uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-earth animate-pulse"></span>
            <span>Comparative Planetary Analytics // Step 03</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl sm:text-4xl md:text-5xl text-starlight-white tracking-tight">
            Scientific Comparison Engine
          </h1>
          <p className="font-inter text-starlight-dim text-sm md:text-base max-w-2xl leading-relaxed">
            Multi-parametric comparative analysis correlating extraterrestrial target imagery and topography against certified terrestrial analogs on Earth.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => setViewMode('satellite')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-200 ${
              viewMode === 'satellite'
                ? 'bg-white text-space-void font-bold shadow-glass'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High-Res Imagery</span>
          </button>

          <button
            onClick={() => setViewMode('3d-mesh')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-grotesk font-medium uppercase tracking-wider transition-all duration-200 ${
              viewMode === '3d-mesh'
                ? 'bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-bold shadow-mars-glow'
                : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Topographic Mesh</span>
          </button>
        </div>
      </div>

      {/* Target & Analog Selectors Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Extraterrestrial Target Selector Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <label className="text-[11px] font-inter font-medium text-starlight-subtle uppercase tracking-wider flex items-center justify-between">
            <span>PLANETARY TARGET SPECIFICATION</span>
            <span className="text-mars font-bold uppercase">{selectedTarget.planet}</span>
          </label>
          <div className="relative">
            <select
              value={selectedTarget.id}
              onChange={handleTargetChange}
              className="w-full appearance-none bg-white/[0.04] border border-white/[0.12] focus:border-mars rounded-xl px-4 py-3 text-starlight-white font-inter text-sm focus:outline-none cursor-pointer"
            >
              {planetaryTargets.map((pt) => (
                <option key={pt.id} value={pt.id} className="bg-space-surface text-starlight-white">
                  [{pt.planet.toUpperCase()}] {pt.name} ({pt.designation})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight-subtle pointer-events-none" />
          </div>
          <div className="text-xs font-inter text-starlight-dim flex items-center justify-between pt-1">
            <span>Coordinates: {selectedTarget.coordinates}</span>
            <span>Elevation: {selectedTarget.elevation.split(' (')[0]}</span>
          </div>
        </div>

        {/* Terrestrial Analog Selector Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <label className="text-[11px] font-inter font-medium text-starlight-subtle uppercase tracking-wider flex items-center justify-between">
            <span>TERRESTRIAL ANALOG CANDIDATE</span>
            <span className="text-earth font-bold uppercase">{selectedAnalog.country}</span>
          </label>
          <div className="relative">
            <select
              value={selectedAnalog.id}
              onChange={handleAnalogChange}
              className="w-full appearance-none bg-white/[0.04] border border-white/[0.12] focus:border-earth rounded-xl px-4 py-3 text-starlight-white font-inter text-sm focus:outline-none cursor-pointer"
            >
              {analogLocations.map((al) => (
                <option key={al.id} value={al.id} className="bg-space-surface text-starlight-white">
                  [{al.flagCode}] {al.name} — Similarity: {al.overallSimilarity.toFixed(1)}%
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight-subtle pointer-events-none" />
          </div>
          <div className="text-xs font-inter text-starlight-dim flex items-center justify-between pt-1">
            <span>Coordinates: {selectedAnalog.coordinates.display}</span>
            <span>Elevation: {selectedAnalog.elevationMeters}m MSL</span>
          </div>
        </div>
      </div>

      {/* Main Dual Viewport: Visual Comparison */}
      {viewMode === '3d-mesh' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-xs font-inter text-starlight-dim px-2">
              <span className="font-semibold text-mars uppercase">Target 3D Topographic Model // {selectedTarget.name}</span>
              <span className="font-mono text-[11px]">DEM Relief</span>
            </div>
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
          </div>

          <div className="glass-panel p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-xs font-inter text-starlight-dim px-2">
              <span className="font-semibold text-earth uppercase">Terrestrial Analog 3D Model // {selectedAnalog.name}</span>
              <span className="font-mono text-[11px]">SRTM 30m</span>
            </div>
            <Real3DTopography
              locationName={selectedAnalog.name}
              terrainType={selectedAnalog.geology.rockType}
              elevationDatum={`${selectedAnalog.elevationMeters}m MSL`}
              thermalRange={{ min: 4, max: 48, unit: '°C' }}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Extraterrestrial Viewport */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-xs font-inter text-starlight-dim">
              <span className="font-semibold text-mars uppercase">Orbital HiRISE / LOLA // {selectedTarget.name}</span>
              <span className="font-mono text-[11px]">NASA Planetary Data System</span>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/[0.10] group">
              <img
                src={selectedTarget.imagery.overview}
                alt={selectedTarget.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-void via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 text-xs font-mono text-starlight-white bg-space-void/80 px-3 py-1 rounded-md border border-white/[0.12] backdrop-blur-md">
                Surface: {selectedTarget.surfaceType}
              </div>
            </div>
          </div>

          {/* Terrestrial Viewport */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-xs font-inter text-starlight-dim">
              <span className="font-semibold text-earth uppercase">Google Maps Satellite // {selectedAnalog.name}</span>
              <span className="font-mono text-[11px]">Google Earth & Sentinel-2</span>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/[0.10] group">
              <img
                src={selectedAnalog.imagery.hero}
                alt={selectedAnalog.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-void via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 text-xs font-mono text-starlight-white bg-space-void/80 px-3 py-1 rounded-md border border-white/[0.12] backdrop-blur-md">
                Climate: {selectedAnalog.climateType}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Radar Comparison & Fidelity Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Overall Similarity Index Score */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl space-y-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-xs font-mono text-starlight-subtle uppercase tracking-wider">
              MULTI-PARAMETRIC ALGORITHM
            </div>
            <h2 className="font-grotesk font-bold text-3xl text-starlight-white">
              Planetary Fidelity Index
            </h2>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="font-grotesk font-bold text-6xl md:text-7xl text-mars">
              {selectedAnalog.overallSimilarity.toFixed(1)}%
            </span>
            <span className="text-sm font-inter text-starlight-dim font-medium">Correlation Score</span>
          </div>

          <p className="font-inter text-sm text-starlight-dim leading-relaxed">
            Computed across 6 analytical axes incorporating spectroscopic mineral matching, surface roughness indices, slope variance, and diurnal thermal inertia.
          </p>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-inter text-starlight-subtle">
            <div className="flex items-center space-x-1.5 text-telemetry-emerald">
              <ShieldCheck className="w-4 h-4" />
              <span>Statistical Confidence: {selectedAnalog.confidenceScore.toFixed(0)}%</span>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-earth font-semibold flex items-center space-x-1 hover:underline"
            >
              <span>View Full Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Radiant Polar Radar Chart */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center">
          <div className="text-center space-y-1 mb-4">
            <h3 className="font-grotesk font-bold text-lg text-starlight-white">
              6-Axis Scientific Radar Analysis
            </h3>
            <p className="text-xs font-inter text-starlight-subtle">
              Extraterrestrial Target vs. Terrestrial Candidate Parameter Alignment
            </p>
          </div>

          <RadarChart
            data={radarData}
            targetLabel={selectedTarget.name.split(' ')[0]}
            analogLabel={selectedAnalog.name.split(' (')[0]}
            targetColor={selectedTarget.planet === 'mars' ? '#F97316' : '#FFFFFF'}
            analogColor="#38BDF8"
            size={360}
          />
        </div>
      </div>
    </div>
  );
};
