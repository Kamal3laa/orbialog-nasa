import React, { useState, useMemo } from 'react';
import { PlanetaryTarget, AnalogSite } from '../../types';
import { PLANETARY_BODIES } from '../../data/planetaryBodies';
import { ANALOG_SITES } from '../../data/analogSites';
import { calculateFidelityComparison, formatCoordinates } from '../../utils/calculations';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Layers, AlertTriangle, CheckCircle2, Info, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ComparisonEngineProps {
  initialTarget?: PlanetaryTarget | null;
  initialAnalog?: AnalogSite | null;
  onSelectSiteForProfile: (site: AnalogSite) => void;
}

export const ComparisonEngine: React.FC<ComparisonEngineProps> = ({
  initialTarget,
  initialAnalog,
  onSelectSiteForProfile,
}) => {
  // Collect all Moon and Mars targets
  const allTargets: PlanetaryTarget[] = useMemo(() => {
    return [
      ...PLANETARY_BODIES.Moon.primaryTargets,
      ...PLANETARY_BODIES.Mars.primaryTargets,
    ];
  }, []);

  const [selectedTarget, setSelectedTarget] = useState<PlanetaryTarget>(
    initialTarget || allTargets.find((t) => t.id === 'jezero-crater') || allTargets[0]
  );

  const [selectedAnalog, setSelectedAnalog] = useState<AnalogSite>(
    initialAnalog || ANALOG_SITES.find((s) => s.id === 'white-desert-egypt') || ANALOG_SITES[0]
  );

  const [activeDimensionKey, setActiveDimensionKey] = useState<string>('aeolianDynamics');

  // Compute 9-dimension fidelity calculations
  const comparison = useMemo(() => {
    return calculateFidelityComparison(selectedTarget, selectedAnalog);
  }, [selectedTarget, selectedAnalog]);

  // Radar Chart Data formatting
  const radarData = useMemo(() => {
    return comparison.dimensions.map((dim) => ({
      subject: dim.label.split(' ')[0], // short label for radar spoke
      fullLabel: dim.label,
      targetScore: dim.planetaryTargetScore,
      analogScore: dim.analogSiteScore,
      similarity: dim.similarityPercentage,
    }));
  }, [comparison]);

  const activeDimension = comparison.dimensions.find((d) => d.key === activeDimensionKey) || comparison.dimensions[0];

  return (
    <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-charcoal">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
              <Layers className="w-4 h-4" />
              <span>MODULE 03 // QUANTITATIVE FIDELITY ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading-sci font-bold text-mineral-white">
              Analog Comparison & Parity Engine
            </h2>
            <p className="text-sm font-sans text-stone-gray max-w-2xl">
              Cross-correlate environmental parameters between planetary targets and terrestrial analogs across 9 quantitative dimensions.
            </p>
          </div>

          {/* Overall Similarity Badge */}
          <div className="p-4 bg-obsidian border border-white/15 flex items-center space-x-4">
            <div>
              <span className="text-[10px] font-mono-sci text-stone-gray block">
                COMPOSITE ANALOG FIDELITY
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-heading-sci font-bold text-mars-rust">
                  {comparison.overallSimilarity}%
                </span>
                <span className="text-xs font-mono-sci text-stone-gray">
                  {comparison.overallSimilarity >= 80 ? 'HIGH PARITY' : 'MODERATE PARITY'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-mars-rust/40 flex items-center justify-center bg-mars-rust/10">
              <ArrowRightLeft className="w-5 h-5 text-mars-rust" />
            </div>
          </div>
        </div>

        {/* Selection Strip: Target Planet vs Terrestrial Analog */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Celestial Site Selector */}
          <div className="p-4 bg-obsidian border border-white/15 space-y-2">
            <label className="text-xs font-mono-sci text-stone-gray block flex items-center justify-between">
              <span>01. SELECT PLANETARY TARGET</span>
              <span className="text-mars-rust font-bold">{selectedTarget.planetId.toUpperCase()}</span>
            </label>
            <select
              value={selectedTarget.id}
              onChange={(e) => {
                sound.playClick();
                const found = allTargets.find((t) => t.id === e.target.value);
                if (found) setSelectedTarget(found);
              }}
              className="w-full bg-charcoal border border-white/20 px-3 py-2 text-sm font-mono-sci text-mineral-white focus:outline-none focus:border-mars-rust"
            >
              <optgroup label="Moon Targets">
                {PLANETARY_BODIES.Moon.primaryTargets.map((t) => (
                  <option key={t.id} value={t.id}>
                    Moon // {t.name} ({t.coordinates})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mars Targets">
                {PLANETARY_BODIES.Mars.primaryTargets.map((t) => (
                  <option key={t.id} value={t.id}>
                    Mars // {t.name} ({t.coordinates})
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="text-[11px] font-mono-sci text-stone-gray flex justify-between pt-1">
              <span>ELEV: {selectedTarget.elevationM} m</span>
              <span>SLOPE: {selectedTarget.slopeAvgDeg}°</span>
              <span>ROCKS: {selectedTarget.rockAbundancePercent}%</span>
            </div>
          </div>

          {/* Terrestrial Candidate Site Selector */}
          <div className="p-4 bg-obsidian border border-white/15 space-y-2">
            <label className="text-xs font-mono-sci text-stone-gray block flex items-center justify-between">
              <span>02. SELECT TERRESTRIAL ANALOG</span>
              <span className="text-earth-accent font-bold">
                {selectedAnalog.isEgyptianCandidate ? '★ EGYPT CANDIDATE' : 'VALIDATED SITE'}
              </span>
            </label>
            <select
              value={selectedAnalog.id}
              onChange={(e) => {
                sound.playClick();
                const found = ANALOG_SITES.find((s) => s.id === e.target.value);
                if (found) setSelectedAnalog(found);
              }}
              className="w-full bg-charcoal border border-white/20 px-3 py-2 text-sm font-mono-sci text-mineral-white focus:outline-none focus:border-mars-rust"
            >
              <optgroup label="Egyptian Candidate Sites (Under Study)">
                {ANALOG_SITES.filter((s) => s.isEgyptianCandidate).map((s) => (
                  <option key={s.id} value={s.id}>
                    ★ {s.name} ({s.country})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Global Validated Analogs">
                {ANALOG_SITES.filter((s) => !s.isEgyptianCandidate).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country})
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="text-[11px] font-mono-sci text-stone-gray flex justify-between pt-1">
              <span>ELEV: {selectedAnalog.elevationM} m</span>
              <span>LAT/LNG: {formatCoordinates(selectedAnalog.coordinates.lat, selectedAnalog.coordinates.lng)}</span>
            </div>
          </div>
        </div>

        {/* Scientific Integrity Advisory Banner */}
        <div className="p-3.5 bg-obsidian border border-white/10 flex items-start space-x-3 text-xs font-mono-sci text-stone-gray">
          <Info className="w-4 h-4 text-earth-accent flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-mineral-white font-bold">DATA INTEGRITY PROTOCOL: </span>
            Planetary metrics represent verified NASA/USGS archival benchmark observations. Terrestrial analog metrics are calibrated from satellite DEMs and published peer-reviewed field reports. Demonstrative extrapolation models are isolated from primary empirical measurements.
          </div>
        </div>

        {/* Central Visualization Grid: Radar Chart & Bar Parity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 9-Dimension Radar Visualization (6 cols) */}
          <div className="lg:col-span-6 p-6 bg-obsidian border border-white/15 space-y-4 reticle-corner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono-sci text-stone-gray uppercase">
                RADAR SIMILARITY POLYGON (9 AXES)
              </span>
              <div className="flex items-center space-x-4 text-[10px] font-mono-sci">
                <span className="flex items-center space-x-1.5 text-stone-gray">
                  <span className="w-2.5 h-2.5 bg-white/20 border border-white/40"></span>
                  <span>TARGET BASELINE</span>
                </span>
                <span className="flex items-center space-x-1.5 text-mars-rust">
                  <span className="w-2.5 h-2.5 bg-mars-rust"></span>
                  <span>TERRESTRIAL MATCH</span>
                </span>
              </div>
            </div>

            {/* Radar Canvas with Recharts */}
            <div className="w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(232, 229, 220, 0.12)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    stroke="#88877F"
                    tick={{ fill: '#E8E5DC', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="rgba(232, 229, 220, 0.1)"
                    tick={{ fill: '#88877F', fontSize: 8 }}
                  />
                  <Radar
                    name="Target Baseline"
                    dataKey="targetScore"
                    stroke="#A8AAA6"
                    fill="#A8AAA6"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="Terrestrial Analog"
                    dataKey="analogScore"
                    stroke="#B75B3D"
                    fill="#B75B3D"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] font-mono-sci text-stone-gray text-center pt-2">
              Geometric overlap indicates environmental parity. Discrepancies highlight areas requiring off-nominal testing mitigations.
            </p>
          </div>

          {/* Bar Chart Similarity Breakdown (6 cols) */}
          <div className="lg:col-span-6 p-6 bg-obsidian border border-white/15 space-y-4 reticle-corner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono-sci text-stone-gray uppercase">
                SIMILARITY SCORE BY DIMENSION (%)
              </span>
              <span className="text-[10px] font-mono-sci text-stone-gray">
                CLICK BAR TO INSPECT RATIONALE
              </span>
            </div>

            <div className="w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={radarData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#88877F" tick={{ fill: '#88877F', fontSize: 10 }} />
                  <YAxis
                    dataKey="subject"
                    type="category"
                    stroke="#88877F"
                    tick={{ fill: '#E8E5DC', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#191B19',
                      borderColor: 'rgba(232, 229, 220, 0.2)',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}% Similarity`, 'Score']}
                  />
                  <Bar
                    dataKey="similarity"
                    fill="#B75B3D"
                    radius={[0, 2, 2, 0]}
                    onClick={(entry) => {
                      sound.playClick();
                      const match = comparison.dimensions.find((d) => d.label.startsWith(entry.subject));
                      if (match) setActiveDimensionKey(match.key);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-sci text-stone-gray pt-2">
              <span className="text-emerald-400">● 80%+ High Fidelity</span>
              <span className="text-telemetry-amber">● 55-79% Moderate Parity</span>
              <span className="text-mars-rust">● &lt;55% High Discrepancy</span>
            </div>
          </div>
        </div>

        {/* Dimension Drill-down Detail & Scientific Rationale */}
        <div className="p-6 bg-obsidian border border-white/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono-sci text-mars-rust">INSPECTED DIMENSION:</span>
              <span className="text-lg font-heading-sci font-bold text-mineral-white">
                {activeDimension.label}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono-sci">
              <span className="text-stone-gray">FIDELITY RATING:</span>
              <span
                className={`px-2 py-0.5 font-bold ${
                  activeDimension.fidelityStatus === 'HIGH_FIDELITY'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : activeDimension.fidelityStatus === 'MODERATE_FIDELITY'
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                    : 'bg-red-950/60 text-red-400 border border-red-500/40'
                }`}
              >
                {activeDimension.fidelityStatus.replace(/_/g, ' ')} ({activeDimension.similarityPercentage}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-sci">
            <div className="p-3 bg-charcoal border border-white/10 space-y-1">
              <span className="text-stone-gray text-[10px] block">TARGET EXPECTED REGIME</span>
              <span className="text-base font-bold text-mineral-white">
                {activeDimension.planetaryTargetScore} / 100
              </span>
              <p className="text-stone-gray text-[11px] font-sans mt-1">
                {selectedTarget.name} baseline requirement
              </p>
            </div>

            <div className="p-3 bg-charcoal border border-white/10 space-y-1">
              <span className="text-stone-gray text-[10px] block">TERRESTRIAL SITE FIDELITY</span>
              <span className="text-base font-bold text-mars-rust">
                {activeDimension.analogSiteScore} / 100
              </span>
              <p className="text-stone-gray text-[11px] font-sans mt-1">
                Measured at {selectedAnalog.name}
              </p>
            </div>

            <div className="p-3 bg-charcoal border border-white/10 space-y-1">
              <span className="text-stone-gray text-[10px] block">SCIENTIFIC IMPACT</span>
              <p className="text-mineral-white text-xs font-sans leading-normal">
                {activeDimension.scienceRationale}
              </p>
            </div>
          </div>

          {/* Dimension Selector Pills */}
          <div className="pt-2 flex flex-wrap gap-1.5 font-mono-sci text-xs">
            {comparison.dimensions.map((dim) => {
              const isActive = dim.key === activeDimensionKey;
              return (
                <button
                  key={dim.key}
                  onClick={() => {
                    sound.playClick();
                    setActiveDimensionKey(dim.key);
                  }}
                  className={`px-3 py-1.5 border transition-all ${
                    isActive
                      ? 'border-mars-rust bg-mars-rust/20 text-mineral-white font-bold'
                      : 'border-white/10 bg-charcoal text-stone-gray hover:text-mineral-white'
                  }`}
                >
                  {dim.label} ({dim.similarityPercentage}%)
                </button>
              );
            })}
          </div>
        </div>

        {/* Non-Replicated Planetary Boundary Factors */}
        <div className="p-5 bg-charcoal border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold">UNREPLICATED PLANETARY BOUNDARY FACTORS (LIMITATIONS)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-sci text-stone-gray">
            <div className="p-2.5 bg-obsidian border border-white/5">
              <span className="text-mineral-white block font-semibold">01. GRAVITY GAP</span>
              <span>Earth (1.0g) vs {selectedTarget.planetId === 'Moon' ? '0.166g (Moon)' : '0.38g (Mars)'}. Requires offloading crane or software mass compensation.</span>
            </div>
            <div className="p-2.5 bg-obsidian border border-white/5">
              <span className="text-mineral-white block font-semibold">02. PRESSURE GAP</span>
              <span>Terrestrial 101.3 kPa vs {selectedTarget.planetId === 'Moon' ? '<10⁻¹² Pa' : '6.4 mbar'}. Heat convection differs from true vacuum radiation.</span>
            </div>
            <div className="p-2.5 bg-obsidian border border-white/5">
              <span className="text-mineral-white block font-semibold">03. RADIATION GAP</span>
              <span>Terrestrial magnetosphere absorbs cosmic rays. Rad-hardened avionics must be tested in particle accelerators.</span>
            </div>
            <div className="p-2.5 bg-obsidian border border-white/5">
              <span className="text-mineral-white block font-semibold">04. ELECTROSTATIC CHARGE</span>
              <span>Terrestrial humidity dissipates static charges. Lunar/Martian dry dust clings adhesively to optical glass.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

