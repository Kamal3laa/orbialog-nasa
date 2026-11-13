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
  AlertTriangle, 
  Database, 
  Layers, 
  Activity, 
  Thermometer, 
  Compass, 
  ShieldCheck,
  ChevronDown,
  Box,
  Eye
} from 'lucide-react';
import { audio } from '../utils/audio';

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
    if (target) {
      audio.playClick();
      onSelectTarget(target);
    }
  };

  const handleAnalogChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const analog = analogLocations.find((a) => a.id === e.target.value);
    if (analog) {
      audio.playClick();
      onSelectAnalog(analog);
    }
  };

  // Construct Multi-Axis Radar Dataset
  const radarData: RadarDataPoint[] = [
    {
      axis: 'Geological Chemistry',
      targetValue: selectedTarget.metrics.mineralMatchIndex,
      analogValue: selectedAnalog.metrics.geologicalSimilarity,
    },
    {
      axis: 'Surface Roughness',
      targetValue: selectedTarget.metrics.roughnessIndex,
      analogValue: selectedAnalog.metrics.terrainRoughness,
    },
    {
      axis: 'Slope Distribution',
      targetValue: selectedTarget.metrics.slopeVariance,
      analogValue: selectedAnalog.metrics.slopeDistribution,
    },
    {
      axis: 'Thermal Delta',
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
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-obsidian-border pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-wider mb-1">
            <span className="text-mars font-bold">MISSION STEP 03</span>
            <span>//</span>
            <span>SCIENTIFIC CORRELATION & 3D TOPOGRAPHIC ENGINE</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
            Scientific Comparison Engine
          </h1>
          <p className="font-inter text-stone-gray text-xs md:text-sm mt-1 max-w-2xl">
            Quantitative cross-planetary parametric evaluation with 3D elevation displacement and thermal infrared radiation comparisons.
          </p>
        </div>

        {/* View Mode Toggle (Imagery vs Real 3D Topographic Mesh) */}
        <div className="flex items-center space-x-2 font-mono text-xs bg-obsidian-card border border-obsidian-border p-1">
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('satellite');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all ${
              viewMode === 'satellite'
                ? 'bg-mars text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="uppercase">Orbital Multispectral</span>
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('3d-mesh');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all ${
              viewMode === '3d-mesh'
                ? 'bg-earth text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="uppercase">Real 3D Topographic Mesh</span>
          </button>
        </div>
      </div>

      {/* Target & Analog Selector Command Console */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-obsidian border border-obsidian-border p-6">
        {/* Planetary Target Selector Dropdown */}
        <div className="space-y-2">
          <label className="block font-mono text-[11px] text-stone-gray uppercase tracking-wider flex items-center justify-between">
            <span>[A] PLANETARY DESTINATION TARGET:</span>
            <span className="text-mars font-semibold uppercase">{selectedTarget.planet} REGIME</span>
          </label>
          <div className="relative">
            <select
              value={selectedTarget.id}
              onChange={handleTargetChange}
              className="w-full appearance-none bg-obsidian-card border border-obsidian-border px-4 py-3 text-mineral-white font-mono text-xs focus:outline-none focus:border-mars cursor-pointer"
            >
              {planetaryTargets.map((pt) => (
                <option key={pt.id} value={pt.id} className="bg-charcoal text-mineral-white">
                  {pt.planet === 'mars' ? 'MARS // ' : 'MOON // '}
                  {pt.name} ({pt.designation})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray pointer-events-none" />
          </div>
          <div className="font-mono text-[10px] text-stone-gray flex items-center justify-between pt-1">
            <span>COORDS: {selectedTarget.coordinates}</span>
            <span>DATUM: {selectedTarget.elevation.split(' (')[0]}</span>
          </div>
        </div>

        {/* Terrestrial Analog Candidate Selector Dropdown */}
        <div className="space-y-2">
          <label className="block font-mono text-[11px] text-stone-gray uppercase tracking-wider flex items-center justify-between">
            <span>[B] TERRESTRIAL ANALOG CANDIDATE:</span>
            <span className="text-earth-bright font-semibold uppercase">EARTH WGS84</span>
          </label>
          <div className="relative">
            <select
              value={selectedAnalog.id}
              onChange={handleAnalogChange}
              className="w-full appearance-none bg-obsidian-card border border-obsidian-border px-4 py-3 text-mineral-white font-mono text-xs focus:outline-none focus:border-earth cursor-pointer"
            >
              {analogLocations.map((al) => (
                <option key={al.id} value={al.id} className="bg-charcoal text-mineral-white">
                  {al.featuredEgypt ? '★ [EG] ' : `[${al.flagCode}] `}
                  {al.name} — Similarity: {al.overallSimilarity.toFixed(1)}%
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray pointer-events-none" />
          </div>
          <div className="font-mono text-[10px] text-stone-gray flex items-center justify-between pt-1">
            <span>COORDS: {selectedAnalog.coordinates.display}</span>
            <span>ELEVATION: {selectedAnalog.elevationMeters}m MSL</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Section: Side-by-Side Visuals OR Real 3D Topographic Mesh */}
      {viewMode === '3d-mesh' ? (
        <div className="space-y-3">
          <div className="font-mono text-xs text-stone-gray uppercase tracking-wider flex items-center justify-between">
            <span>INTERACTIVE 3D TOPOGRAPHIC RELIEF & THERMAL DISPLACEMENT [DRAG TO ROTATE]</span>
            <span className="text-mars font-bold">TARGET: {selectedTarget.name} VS ANALOG: {selectedAnalog.name}</span>
          </div>
          <Real3DTopography
            locationName={`${selectedTarget.name} & ${selectedAnalog.name}`}
            isPlanetaryTarget={true}
            terrainType={selectedAnalog.geology.rockType}
            elevationDatum={`${selectedAnalog.elevationMeters}m MSL`}
            thermalRange={{ min: selectedTarget.temperatureRange.min, max: 48, unit: selectedTarget.temperatureRange.unit }}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Side-by-Side Visual Comparison & Detailed Cross-Match */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Satellite / Sensor View */}
            <div className="bg-obsidian border border-obsidian-border p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-mars font-semibold uppercase tracking-wider">TARGET: {selectedTarget.designation}</span>
                <span className="text-[10px] text-stone-gray">{selectedTarget.planet.toUpperCase()}</span>
              </div>
              <div className="relative h-56 bg-charcoal-deep border border-obsidian-border overflow-hidden group">
                <img
                  src={selectedTarget.imagery.overview}
                  alt={selectedTarget.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 font-mono text-[9px] bg-charcoal/80 border border-stone-gray/30 px-2 py-0.5 text-mineral-white">
                  SENSOR: {selectedTarget.primaryDatasets[0]?.instrument || 'ORBITAL SENSOR'}
                </div>
                <div className="absolute bottom-2 left-2 right-2 font-mono text-[10px] bg-charcoal/80 px-2 py-1 text-stone-gray truncate">
                  {selectedTarget.name}
                </div>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-stone-gray">
                  <span>PRESSURE:</span>
                  <span className="text-mineral-white">{selectedTarget.pressure}</span>
                </div>
                <div className="flex justify-between text-stone-gray">
                  <span>GRAVITY:</span>
                  <span className="text-mineral-white">{selectedTarget.gravity}</span>
                </div>
                <div className="flex justify-between text-stone-gray">
                  <span>THERMAL LST:</span>
                  <span className="text-mars font-bold">
                    {selectedTarget.temperatureRange.min} to {selectedTarget.temperatureRange.max} {selectedTarget.temperatureRange.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Analog Terrestrial Satellite View */}
            <div className="bg-obsidian border border-obsidian-border p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-earth-bright font-semibold uppercase tracking-wider">ANALOG: {selectedAnalog.name.split(' (')[0]}</span>
                <span className="text-[10px] text-stone-gray">{selectedAnalog.country.toUpperCase()}</span>
              </div>
              <div className="relative h-56 bg-charcoal-deep border border-obsidian-border overflow-hidden group">
                <img
                  src={selectedAnalog.imagery.hero}
                  alt={selectedAnalog.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 font-mono text-[9px] bg-charcoal/80 border border-stone-gray/30 px-2 py-0.5 text-mineral-white">
                  SENSOR: LANDSAT 9 / SENTINEL-2 MSI
                </div>
                <div className="absolute bottom-2 left-2 right-2 font-mono text-[10px] bg-charcoal/80 px-2 py-1 text-stone-gray truncate">
                  {selectedAnalog.region}
                </div>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-stone-gray">
                  <span>PRESSURE:</span>
                  <span className="text-mineral-white">~1,013 mbar (Standard SL)</span>
                </div>
                <div className="flex justify-between text-stone-gray">
                  <span>GRAVITY:</span>
                  <span className="text-mineral-white">9.81 m/s² (1.00 g)</span>
                </div>
                <div className="flex justify-between text-stone-gray">
                  <span>THERMAL LST:</span>
                  <span className="text-mars font-bold">{selectedAnalog.environment.diurnalRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Geological & Geomorphic Comparison Table */}
          <div className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h3 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2">
              <Layers className="w-4 h-4 text-mars" />
              <span>LITHOLOGICAL & TERRAIN PARAMETRIC CROSS-MATCH</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">PRIMARY TARGET SURFACE</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedTarget.surfaceType}
                </div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">ANALOG EQUIVALENT REGOLITH & LITHOLOGY</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.regolithAnalogy}
                </div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">AEOLIAN DYNAMICS & MICRO-MORPHOLOGY</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.aeolianFeatures}
                </div>
              </div>
            </div>

            {/* Critical Divergence / Limitations Alert Box */}
            <div className="p-4 bg-obsidian-surface border border-mars/40 space-y-2">
              <div className="flex items-center space-x-2 font-mono text-xs text-mars font-semibold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>SCIENTIFIC LIMITATIONS & TERRESTRIAL BOUNDARY FACTORS</span>
              </div>
              <ul className="space-y-1 font-inter text-xs text-mineral-dim">
                {selectedAnalog.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-mono text-mars font-bold">!</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Parametric Radar Chart & Similarity Metrics */}
        <div className="lg:col-span-5 bg-obsidian border border-obsidian-border p-6 lg:p-8 space-y-6">
          <div className="flex items-start justify-between border-b border-obsidian-border pb-4">
            <div>
              <div className="font-mono text-[10px] text-stone-gray uppercase tracking-widest">
                MAHALANOBIS SIMILARITY VECTOR
              </div>
              <h2 className="font-grotesk font-bold text-2xl text-mineral-white uppercase mt-0.5">
                Analogy Correlation
              </h2>
            </div>

            <div className="text-right">
              <div className="font-mono text-3xl font-bold text-mars">
                {selectedAnalog.overallSimilarity.toFixed(1)}%
              </div>
              <div className="font-mono text-[9px] text-stone-gray uppercase">
                CONFIDENCE: {selectedAnalog.confidenceScore.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Interactive Radar Chart Visualization */}
          <div className="flex justify-center py-2">
            <RadarChart
              data={radarData}
              targetLabel={`${selectedTarget.name.split(' ')[0]} Target`}
              analogLabel={`${selectedAnalog.name.split(' ')[0]} Analog`}
              size={340}
            />
          </div>

          {/* Parametric Dimension Breakdown Progress Bars */}
          <div className="space-y-3 pt-2 font-mono text-xs border-t border-obsidian-border">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-gray">GEOLOGICAL SIMILARITY</span>
                <span className="text-mineral-white font-bold">{selectedAnalog.metrics.geologicalSimilarity}%</span>
              </div>
              <div className="w-full h-1.5 bg-obsidian-card">
                <div
                  className="h-full bg-mars"
                  style={{ width: `${selectedAnalog.metrics.geologicalSimilarity}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-gray">SURFACE ROUGHNESS INDEX</span>
                <span className="text-mineral-white font-bold">{selectedAnalog.metrics.terrainRoughness}%</span>
              </div>
              <div className="w-full h-1.5 bg-obsidian-card">
                <div
                  className="h-full bg-lunar"
                  style={{ width: `${selectedAnalog.metrics.terrainRoughness}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-gray">SLOPE DISTRIBUTION VARIANCE</span>
                <span className="text-mineral-white font-bold">{selectedAnalog.metrics.slopeDistribution}%</span>
              </div>
              <div className="w-full h-1.5 bg-obsidian-card">
                <div
                  className="h-full bg-earth-bright"
                  style={{ width: `${selectedAnalog.metrics.slopeDistribution}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-gray">THERMAL DELTA CORRESPONDENCE</span>
                <span className="text-mineral-white font-bold">{selectedAnalog.metrics.thermalDeltaMatch}%</span>
              </div>
              <div className="w-full h-1.5 bg-obsidian-card">
                <div
                  className="h-full bg-telemetry-amber"
                  style={{ width: `${selectedAnalog.metrics.thermalDeltaMatch}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Direct Navigation to Profile and Mission Operations */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                audio.playConfirm();
                onNavigate('profile');
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-obsidian-card hover:bg-obsidian-surface border border-stone-gray/40 text-mineral-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <span>INSPECT FULL DOSSIER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                audio.playConfirm();
                onNavigate('applications');
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider transition-colors shadow-md font-semibold"
            >
              <span>MISSION TESTING OPS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
