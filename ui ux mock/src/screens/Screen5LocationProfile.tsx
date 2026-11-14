import React, { useState } from 'react';
import {
  ActiveScreen,
  AnalogLocation,
  PlanetaryTarget
} from '../types';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import {
  FileText,
  MapPin,
  Compass,
  Layers,
  Activity,
  Database,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  ChevronDown,
  Box
} from 'lucide-react';
import { audio } from '../utils/audio';

interface Screen5LocationProfileProps {
  selectedAnalog: AnalogLocation;
  selectedTarget: PlanetaryTarget;
  analogLocations: AnalogLocation[];
  onSelectAnalog: (loc: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen5LocationProfile: React.FC<Screen5LocationProfileProps> = ({
  selectedAnalog,
  selectedTarget,
  analogLocations,
  onSelectAnalog,
  onNavigate,
}) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [show3DMesh, setShow3DMesh] = useState<boolean>(true);

  const handleDownloadReport = () => {
    audio.playConfirm();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`[ORBiALOG REPORT GENERATED] Scientific Technical Dossier for ${selectedAnalog.name} exported successfully.`);
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Document Header formatted like NASA Technical Memorandum (NASA TM) */}
      <div className="bg-obsidian border border-obsidian-border p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-obsidian-border pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-widest">
              <span className="text-mars font-bold">NASA TECHNICAL MEMORANDUM</span>
              <span>//</span>
              <span>ORBiALOG-TM-2026-088</span>
              <span>//</span>
              <span className="text-earth-bright">DE-CLASSIFIED FOR SCIENTIFIC USE</span>
            </div>
            <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
              {selectedAnalog.name}
            </h1>
            <p className="font-mono text-xs text-stone-gray">
              {selectedAnalog.region}, {selectedAnalog.country} • WGS84: {selectedAnalog.coordinates.display}
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-3 font-mono text-xs">
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex items-center space-x-2 px-4 py-2.5 bg-obsidian-card hover:bg-obsidian-surface border border-stone-gray/40 text-mineral-white transition-colors"
            >
              <Download className="w-4 h-4 text-mars" />
              <span>{downloading ? 'GENERATING PDF...' : 'EXPORT DOSSIER'}</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onNavigate('comparison');
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-mars hover:bg-mars-glow text-mineral-white uppercase tracking-wider font-semibold shadow-md transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>RUN COMPARISON</span>
            </button>
          </div>
        </div>

        {/* Quick Analog Switcher for ease of exploration */}
        <div className="flex items-center space-x-3 font-mono text-xs text-stone-gray">
          <span className="text-stone-dark uppercase text-[10px]">INSPECT ANOTHER ANALOG:</span>
          <select
            value={selectedAnalog.id}
            onChange={(e) => {
              const match = analogLocations.find((a) => a.id === e.target.value);
              if (match) {
                audio.playClick();
                onSelectAnalog(match);
              }
            }}
            className="bg-obsidian-card border border-obsidian-border text-mineral-white px-3 py-1 font-mono text-xs focus:outline-none focus:border-mars cursor-pointer"
          >
            {analogLocations.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-charcoal text-mineral-white">
                {loc.featuredEgypt ? '★ [EG] ' : `[${loc.flagCode}] `}
                {loc.name} ({loc.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scientific Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Research Body */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Executive Abstract & Summary */}
          <section className="bg-obsidian border border-obsidian-border p-6 space-y-3">
            <h2 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2 border-b border-obsidian-border pb-2">
              <span className="text-mars font-mono text-xs font-bold">01 //</span>
              <span>GEOLOGICAL ABSTRACT & ANALOG SYNOPSIS</span>
            </h2>
            <p className="font-inter text-sm text-mineral-white leading-relaxed font-normal">
              {selectedAnalog.summary}
            </p>
          </section>

          {/* Section 2: Real 3D Topographic Mesh & Thermal Displacement */}
          <section className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
              <h2 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2">
                <span className="text-mars font-mono text-xs font-bold">02 //</span>
                <span>REAL 3D TOPOGRAPHIC MESH & THERMAL DISPLACEMENT</span>
              </h2>
              <button
                onClick={() => setShow3DMesh(!show3DMesh)}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-obsidian-card border border-obsidian-border font-mono text-[11px] text-stone-gray hover:text-mineral-white"
              >
                <Box className="w-3.5 h-3.5 text-mars" />
                <span>{show3DMesh ? 'HIDE 3D' : 'SHOW 3D'}</span>
              </button>
            </div>

            {show3DMesh && (
              <Real3DTopography
                locationName={selectedAnalog.name}
                terrainType={selectedAnalog.geology.rockType}
                elevationDatum={`${selectedAnalog.elevationMeters}m MSL`}
                thermalRange={{ min: 4, max: 48, unit: '°C' }}
              />
            )}

            <div className="space-y-3 font-mono text-xs pt-2">
              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">LITHOLOGICAL CLASSIFICATION</div>
                <div className="text-mineral-white font-medium text-xs mt-1">{selectedAnalog.geology.rockType}</div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">KEY MINERAL CONSTITUENTS (SPECTRAL PHASES)</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAnalog.geology.mineralogy.map((min, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-obsidian-surface border border-stone-gray/30 text-mineral-white text-[11px]"
                    >
                      {min}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">PLANETARY REGOLITH SIMULANT ANALOGY</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.regolithAnalogy}
                </div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">AEOLIAN GEOMORPHOLOGY & BEDFORMS</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.aeolianFeatures}
                </div>
              </div>

              <div className="p-3 bg-obsidian-card border border-obsidian-border">
                <div className="text-[10px] text-stone-dark uppercase">REGIONAL STRATIGRAPHIC SEQUENCE</div>
                <div className="text-mineral-white text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.stratigraphy}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Field Testing Suitability & Experiments */}
          <section className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h2 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2 border-b border-obsidian-border pb-2">
              <span className="text-mars font-mono text-xs font-bold">03 //</span>
              <span>QUALIFIED FIELD EXPLORATION EXPERIMENTS</span>
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {selectedAnalog.fieldTestingCapabilities.map((cap, i) => (
                <div key={i} className="p-4 bg-obsidian-card border border-obsidian-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-mineral-white font-semibold">{cap.name}</span>
                    <span
                      className={`px-2 py-0.5 uppercase text-[10px] font-bold ${cap.suitability === 'exceptional'
                        ? 'bg-telemetry-emerald/20 text-telemetry-emerald border border-telemetry-emerald/40'
                        : 'bg-telemetry-cyan/20 text-telemetry-cyan border border-telemetry-cyan/40'
                        }`}
                    >
                      {cap.suitability}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-mineral-muted pt-1 leading-relaxed">
                    {cap.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Documented Missions & Expeditions */}
          <section className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h2 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2 border-b border-obsidian-border pb-2">
              <span className="text-mars font-mono text-xs font-bold">04 //</span>
              <span>HISTORICAL ANALOG CAMPAIGNS & GROUND TRUTHING</span>
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {selectedAnalog.notableMissionsOrExpeditions.map((camp, i) => (
                <div key={i} className="p-3.5 bg-obsidian-card border border-obsidian-border">
                  <div className="flex items-center justify-between">
                    <span className="text-mineral-white font-semibold">{camp.campaign}</span>
                    <span className="text-mars">{camp.year}</span>
                  </div>
                  <div className="text-stone-gray text-[11px] mt-0.5">ORGANIZATION: {camp.organization}</div>
                  <p className="font-inter text-xs text-mineral-dim mt-1.5 leading-relaxed">
                    {camp.scope}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Data Source Attributions */}
          <section className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h2 className="font-grotesk font-bold text-lg text-mineral-white uppercase flex items-center space-x-2 border-b border-obsidian-border pb-2">
              <span className="text-mars font-mono text-xs font-bold">05 //</span>
              <span>DATASET PROVENANCE & PEER-REVIEWED CITATIONS</span>
            </h2>

            <div className="space-y-2 font-mono text-xs">
              {selectedAnalog.dataSources.map((ds, i) => (
                <div key={i} className="p-3 bg-obsidian-card border border-obsidian-border flex items-center justify-between">
                  <div>
                    <div className="text-mineral-white font-medium">{ds.title}</div>
                    <div className="text-stone-gray text-[10px] mt-0.5">
                      AGENCY: {ds.agency} • TYPE: {ds.type}
                    </div>
                  </div>
                  <div className="text-telemetry-cyan text-[10px] font-mono">
                    {ds.datasetId}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Research Dossier Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hero Imagery Card */}
          <div className="bg-obsidian border border-obsidian-border p-4 space-y-3">
            <div className="font-mono text-xs text-stone-gray uppercase tracking-wider flex items-center justify-between">
              <span>ORBITAL RECONNAISSANCE</span>
              <span className="text-telemetry-emerald text-[10px]">LIVE FEED</span>
            </div>
            <div className="relative h-64 bg-charcoal-deep border border-obsidian-border overflow-hidden">
              <img
                src={selectedAnalog.imagery.hero}
                alt={selectedAnalog.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 font-mono text-[10px] bg-charcoal/80 border border-stone-gray/30 px-2 py-1 text-mineral-white truncate">
                {selectedAnalog.name} • {selectedAnalog.coordinates.display}
              </div>
            </div>
          </div>

          {/* Environmental Conditions Box */}
          <div className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h3 className="font-grotesk font-bold text-base text-mineral-white uppercase border-b border-obsidian-border pb-2">
              Environmental Parameters
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[11px] pb-1 border-b border-obsidian-border/50">
                <span className="text-stone-dark uppercase">KÖPPEN CLIMATE:</span>
                <span className="text-mineral-white">{selectedAnalog.climateType}</span>
              </div>
              <div className="flex justify-between text-[11px] pb-1 border-b border-obsidian-border/50">
                <span className="text-stone-dark uppercase">MEAN ANNUAL TEMP:</span>
                <span className="text-mineral-white">{selectedAnalog.environment.meanAnnualTemp}</span>
              </div>
              <div className="flex justify-between text-[11px] pb-1 border-b border-obsidian-border/50">
                <span className="text-stone-dark uppercase">DIURNAL THERMAL RANGE:</span>
                <span className="text-mars font-bold">{selectedAnalog.environment.diurnalRange}</span>
              </div>
              <div className="flex justify-between text-[11px] pb-1 border-b border-obsidian-border/50">
                <span className="text-stone-dark uppercase">ANNUAL PRECIPITATION:</span>
                <span className="text-mineral-white">{selectedAnalog.environment.annualPrecipitation}</span>
              </div>
              <div className="flex justify-between text-[11px] pb-1 border-b border-obsidian-border/50">
                <span className="text-stone-dark uppercase">UV IRRADIANCE INDEX:</span>
                <span className="text-mineral-white">{selectedAnalog.environment.uvIrradiance}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-dark uppercase">ARIDITY INDEX (AI):</span>
                <span className="text-mars font-bold">{selectedAnalog.environment.aridityIndex}</span>
              </div>
            </div>
          </div>

          {/* Target Affinity Card */}
          <div className="bg-obsidian border border-obsidian-border p-6 space-y-4">
            <h3 className="font-grotesk font-bold text-base text-mineral-white uppercase border-b border-obsidian-border pb-2">
              Cross-Planetary Match
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-stone-dark uppercase text-[10px]">CORRELATED MISSIONS:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedAnalog.matchedTargets.map((tid) => (
                    <span
                      key={tid}
                      className="px-2 py-0.5 bg-obsidian-card border border-stone-gray/30 text-mineral-white text-[10px] uppercase"
                    >
                      {tid.replace('mars-', 'MARS: ').replace('luna-', 'MOON: ').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-stone-dark uppercase text-[10px]">ANALOG SIMILARITY SCORE:</span>
                <div className="text-3xl font-bold text-mars mt-1">
                  {selectedAnalog.overallSimilarity.toFixed(1)}%
                </div>
              </div>

              <button
                onClick={() => {
                  audio.playConfirm();
                  onNavigate('comparison');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors mt-2"
              >
                <span>RUN COMPARISON ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
