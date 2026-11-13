import React, { useState } from 'react';
import {
  ActiveScreen,
  AnalogLocation,
  PlanetaryTarget
} from '../types';
import { Real3DTopography } from '../components/canvas3d/Real3DTopography';
import { generateAnalogAgencyUrls } from '../data/spaceAgencyResources';
import {
  FileText,
  MapPin,
  Compass,
  Layers,
  Activity,
  Database,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  ChevronDown,
  Box,
  ShieldCheck,
  Globe,
  Award
} from 'lucide-react';

interface Screen5LocationProfileProps {
  selectedAnalog: AnalogLocation;
  selectedTarget: PlanetaryTarget;
  analogLocations: AnalogLocation[];
  onSelectAnalog: (loc: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenDataModal?: () => void;
}

export const Screen5LocationProfile: React.FC<Screen5LocationProfileProps> = ({
  selectedAnalog,
  selectedTarget,
  analogLocations,
  onSelectAnalog,
  onNavigate,
  onOpenDataModal,
}) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [show3DMesh, setShow3DMesh] = useState<boolean>(true);

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`[ORBiALOG REPORT GENERATED] Scientific Technical Dossier for ${selectedAnalog.name} exported successfully.`);
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-space-void px-6 lg:px-8 py-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Document Header: NASA Technical Memorandum (NASA TM) */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.08] pb-6 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-starlight-subtle uppercase tracking-wider">
              <span className="text-mars font-bold">NASA TECHNICAL MEMORANDUM</span>
              <span>•</span>
              <span className="text-starlight-white font-semibold">TM-2026-ORBIALOG</span>
              <span>•</span>
              <span className="text-telemetry-emerald font-semibold">PEER-REVIEWED SCIENTIFIC DOSSIER</span>
            </div>
            <h1 className="font-grotesk font-bold text-3xl sm:text-4xl md:text-5xl text-starlight-white tracking-tight">
              {selectedAnalog.name}
            </h1>
            <p className="font-inter text-sm text-starlight-dim">
              {selectedAnalog.region}, {selectedAnalog.country} • Coordinates: {selectedAnalog.coordinates.display} • Elevation: {selectedAnalog.elevationMeters}m MSL
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] text-starlight-white font-grotesk font-medium text-xs uppercase tracking-wider transition-all duration-200"
            >
              <Download className="w-4 h-4 text-earth" />
              <span>{downloading ? 'Exporting PDF...' : 'Export Dossier (PDF)'}</span>
            </button>

            <button
              onClick={() => onNavigate('comparison')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider shadow-mars-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Comparison</span>
            </button>
          </div>
        </div>

        {/* Analog Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-inter text-starlight-dim">
          <div className="flex items-center space-x-3">
            <span className="text-starlight-subtle uppercase text-[11px]">SWITCH CANDIDATE ANALOG:</span>
            <select
              value={selectedAnalog.id}
              onChange={(e) => {
                const match = analogLocations.find((a) => a.id === e.target.value);
                if (match) onSelectAnalog(match);
              }}
              className="bg-white/[0.05] border border-white/[0.12] rounded-xl text-starlight-white px-3 py-1.5 font-inter text-xs focus:outline-none focus:border-earth cursor-pointer"
            >
              {analogLocations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-space-surface text-starlight-white">
                  [{loc.flagCode}] {loc.name} ({loc.country})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-starlight-subtle">Planetary Target Calibration:</span>
            <span className="text-mars font-semibold">{selectedTarget.name}</span>
          </div>
        </div>
      </div>

      {/* Main Scientific Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Research Body */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Executive Abstract & Summary */}
          <section className="glass-panel p-6 lg:p-8 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <span className="text-mars font-mono text-xs font-bold">01 //</span>
              <h2 className="font-grotesk font-bold text-lg text-starlight-white uppercase tracking-wider">
                Geological Abstract & Planetary Analogy
              </h2>
            </div>
            <p className="font-inter text-sm sm:text-base text-starlight-bright leading-relaxed">
              {selectedAnalog.summary}
            </p>
          </section>

          {/* Section 2: Real 3D Topographic Mesh & Terrain Classification */}
          <section className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-earth font-mono text-xs font-bold">02 //</span>
                <h2 className="font-grotesk font-bold text-lg text-starlight-white uppercase tracking-wider">
                  3D Elevation Topography & Geomorphology
                </h2>
              </div>
              <button
                onClick={() => setShow3DMesh(!show3DMesh)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.10] text-xs font-inter text-starlight-dim hover:text-starlight-white"
              >
                <Box className="w-3.5 h-3.5 text-earth" />
                <span>{show3DMesh ? 'Collapse 3D' : 'Expand 3D'}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-starlight-subtle uppercase">LITHOLOGICAL FORMATION</div>
                <div className="text-starlight-white font-medium text-sm mt-1">{selectedAnalog.geology.rockType}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-starlight-subtle uppercase">REGIONAL STRATIGRAPHY</div>
                <div className="text-starlight-white font-medium text-xs mt-1 leading-relaxed">{selectedAnalog.geology.stratigraphy}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] sm:col-span-2">
                <div className="text-[10px] font-mono text-starlight-subtle uppercase">SPECTRAL MINERAL CONSTITUENTS</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAnalog.geology.mineralogy.map((min, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.10] text-starlight-bright text-xs"
                    >
                      {min}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] sm:col-span-2">
                <div className="text-[10px] font-mono text-starlight-subtle uppercase">REGOLITH SIMULANT ANALOGY</div>
                <div className="text-starlight-dim text-xs mt-1 leading-relaxed">
                  {selectedAnalog.geology.regolithAnalogy}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Field Testing Suitability Matrix */}
          <section className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <span className="text-telemetry-emerald font-mono text-xs font-bold">03 //</span>
              <h2 className="font-grotesk font-bold text-lg text-starlight-white uppercase tracking-wider">
                Certified Planetary Field Exploration Matrix
              </h2>
            </div>

            <div className="space-y-3 font-inter text-xs">
              {selectedAnalog.fieldTestingCapabilities.map((cap, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-starlight-white font-semibold text-sm">{cap.name}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        cap.suitability === 'exceptional'
                          ? 'bg-telemetry-emerald/20 text-telemetry-emerald border border-telemetry-emerald/40'
                          : 'bg-earth/20 text-earth border border-earth/40'
                      }`}
                    >
                      {cap.suitability}
                    </span>
                  </div>
                  <p className="text-starlight-dim leading-relaxed">
                    {cap.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Documented Historical Expeditions */}
          <section className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <span className="text-mars font-mono text-xs font-bold">04 //</span>
              <h2 className="font-grotesk font-bold text-lg text-starlight-white uppercase tracking-wider">
                Ground-Truth Field Campaigns & Historical Missions
              </h2>
            </div>

            <div className="space-y-3 font-inter text-xs">
              {selectedAnalog.notableMissionsOrExpeditions.map((camp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-starlight-white font-semibold text-sm">{camp.campaign}</span>
                    <span className="text-mars font-mono text-xs font-semibold">{camp.year}</span>
                  </div>
                  <div className="text-starlight-subtle text-xs">Organization: {camp.organization}</div>
                  <p className="text-starlight-dim leading-relaxed pt-1">
                    {camp.scope}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Visual Imagery, Environmental Specs & Dataset Citations */}
        <div className="lg:col-span-4 space-y-6">
          {/* High-Res Satellite Viewport Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="text-xs font-inter font-medium text-starlight-dim">
              High-Resolution Surface Optical
            </div>
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/[0.10] group">
              <img
                src={selectedAnalog.imagery.hero}
                alt={selectedAnalog.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-void/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs font-inter text-starlight-white bg-space-void/80 px-2.5 py-1 rounded-md border border-white/[0.12] backdrop-blur-md">
                Köppen: {selectedAnalog.climateType}
              </div>
            </div>
          </div>

          {/* Environmental Telemetry Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 font-inter text-xs">
            <h3 className="font-grotesk font-bold text-sm text-starlight-white uppercase tracking-wider border-b border-white/[0.08] pb-3">
              Environmental Telemetry
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-starlight-subtle">Mean Annual Temp:</span>
                <span className="text-starlight-white font-semibold">{selectedAnalog.environment.meanAnnualTemp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlight-subtle">Diurnal Temperature Range:</span>
                <span className="text-mars font-semibold">{selectedAnalog.environment.diurnalRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlight-subtle">Annual Precipitation:</span>
                <span className="text-starlight-white font-semibold">{selectedAnalog.environment.annualPrecipitation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlight-subtle">UV Irradiance Index:</span>
                <span className="text-starlight-white font-semibold">{selectedAnalog.environment.uvIrradiance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlight-subtle">Dust Storm Frequency:</span>
                <span className="text-starlight-white font-semibold">{selectedAnalog.environment.dustStormFrequency}</span>
              </div>
            </div>
          </div>

          {/* Dataset Citations Card & Space Agency Portals */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 font-inter text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-grotesk font-bold text-sm text-starlight-white uppercase tracking-wider flex items-center space-x-2">
                <Database className="w-4 h-4 text-earth" />
                <span>Space Agency Data &amp; APIs</span>
              </h3>
              {onOpenDataModal && (
                <button
                  onClick={onOpenDataModal}
                  className="text-earth hover:text-starlight-bright text-xs font-medium flex items-center space-x-1"
                >
                  <span>API Hub ↗</span>
                </button>
              )}
            </div>

            {/* Direct Agency Live Observation Query Links */}
            {(() => {
              const urls = generateAnalogAgencyUrls(selectedAnalog.coordinates.lat, selectedAnalog.coordinates.lng, selectedAnalog.name);
              return (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-starlight-subtle uppercase">
                    DIRECT REPOSITORY QUERY BY COORDINATES:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={urls.nasaEarthdata}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium text-xs group-hover:text-earth transition-colors">NASA Earthdata Search</span>
                      <ExternalLink className="w-3.5 h-3.5 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.nasaWorldview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium text-xs group-hover:text-earth transition-colors">NASA Worldview</span>
                      <ExternalLink className="w-3.5 h-3.5 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.esaCopernicus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium text-xs group-hover:text-earth transition-colors">Copernicus Data Space</span>
                      <ExternalLink className="w-3.5 h-3.5 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <a
                      href={urls.csaRadarsat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between group"
                    >
                      <span className="text-starlight-white font-medium text-xs group-hover:text-earth transition-colors">CSA RADARSAT Archive</span>
                      <ExternalLink className="w-3.5 h-3.5 text-starlight-subtle group-hover:text-earth" />
                    </a>
                  </div>

                  {/* CSA SAR Python Tutorial Callout & Code */}
                  <div className="pt-2 space-y-1.5">
                    <a
                      href="https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-starlight-white group-hover:text-earth transition-colors flex items-center space-x-1.5">
                          <span>🇨🇦 CSA Synthetic Aperture Radar (SAR) Tutorial</span>
                        </div>
                        <p className="text-[10px] text-starlight-subtle">
                          Python &amp; QGIS workflow for calibrated sigma0 backscatter &amp; Lee speckle filtering
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-starlight-subtle group-hover:text-earth" />
                    </a>
                    <div className="p-2.5 rounded-lg bg-space-void border border-white/[0.08] text-[10px] font-mono text-earth overflow-x-auto">
                      <code>{selectedAnalog.csaRadarsatProducts.sarTutorialScript}</code>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Standard Dataset Citations */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono text-starlight-subtle uppercase">
                CALIBRATED SCIENTIFIC DATASETS:
              </span>
              <div className="space-y-2">
                {selectedAnalog.dataSources.map((ds, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
                    <div className="text-starlight-white font-medium text-xs">{ds.title}</div>
                    <div className="text-starlight-subtle text-[11px] flex items-center justify-between">
                      <span>{ds.agency}</span>
                      <span className="font-mono text-earth">{ds.type}</span>
                    </div>
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
