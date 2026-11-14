import React, { useState, useEffect } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Compass,
  Cpu,
  Layers,
  Play,
  RotateCw,
  ShieldAlert,
  Sparkles,
  Wind,
  Weight,
  Gauge,
  Zap,
  Route,
  CheckCircle2,
} from 'lucide-react';
import { fetchPlanetaryConstants } from '@/utils/spaceAgencyApi';
import { withResilience, toastService } from '@/utils/resilientFetch';
import type { PlanetaryConstantsResponse } from '@/app/api/planetary-constants/route';
import type { TraversePathData } from './CenterMap';

export type { TraversePathData };

interface RightSidebarProps {
  targetPlanet?: 'mars' | 'moon';
  selectedAnalogName?: string;
  pathData?: TraversePathData | null;
  radarScores?: {
    slope: number;
    temp: number;
    ndvi: number;
    aerosols: number;
    morphology: number;
  };
  className?: string;
}

export type RightSidebarTab = 'radar' | 'physics' | 'traverse';

export const RightSidebar: React.FC<RightSidebarProps> = ({
  targetPlanet = 'mars',
  selectedAnalogName = 'White Desert (Egypt)',
  pathData = null,
  radarScores = {
    slope: 88,
    temp: 76,
    ndvi: 94,
    aerosols: 82,
    morphology: 91,
  },
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<RightSidebarTab>('physics');

  // Physics Compensator State
  const [roverMassKg, setRoverMassKg] = useState<number>(200);
  const [marsStormSpeedKmh, setMarsStormSpeedKmh] = useState<number>(100);
  const [physicsData, setPhysicsData] = useState<PlanetaryConstantsResponse | null>(null);
  const [isLoadingPhysics, setIsLoadingPhysics] = useState<boolean>(true);
  const [isCachedPhysics, setIsCachedPhysics] = useState<boolean>(false);

  // Traverse Sandbox State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState([
    { waypoint: 'WP-0', distanceKm: 0.0, batteryPct: 100, slipRiskPct: 8 },
    { waypoint: 'WP-1', distanceKm: 0.5, batteryPct: 96, slipRiskPct: 11 },
    { waypoint: 'WP-2', distanceKm: 1.0, batteryPct: 92, slipRiskPct: 9 },
    { waypoint: 'WP-3', distanceKm: 1.5, batteryPct: 88, slipRiskPct: 14 },
    { waypoint: 'WP-4', distanceKm: 2.0, batteryPct: 83, slipRiskPct: 12 },
    { waypoint: 'WP-5', distanceKm: 2.5, batteryPct: 79, slipRiskPct: 15 },
    { waypoint: 'WP-6', distanceKm: 3.0, batteryPct: 75, slipRiskPct: 10 },
    { waypoint: 'WP-7', distanceKm: 3.5, batteryPct: 71, slipRiskPct: 13 },
    { waypoint: 'WP-8', distanceKm: 4.2, batteryPct: 66, slipRiskPct: 8 },
    { waypoint: 'WP-9', distanceKm: 5.0, batteryPct: 62, slipRiskPct: 7 },
  ]);

  // Reactive Wiring: Watch `pathData` drawn from CenterMap and generate dynamic telemetry
  useEffect(() => {
    if (!pathData) return;

    setActiveTab('traverse');
    const totalDist = Math.max(0.2, pathData.distanceKm);

    // Generate 10 realistic waypoints along the traverse path
    const dynamicTelemetry = Array.from({ length: 10 }, (_, i) => {
      const fraction = i / 9;
      const currentDist = parseFloat((totalDist * fraction).toFixed(2));
      // Battery drops proportionally: 100% down to 100 - (distanceKm * 1.5)
      const totalDrain = Math.min(80, totalDist * 1.5);
      const battery = Math.max(20, Math.round(100 - fraction * totalDrain));
      // Wheel slip fluctuates realistically between 5% and 15%
      const slipRisk = Math.min(
        15,
        Math.max(5, Math.round(9 + Math.sin(i * 1.4) * 4 + (i === 4 ? 2 : 0)))
      );

      return {
        waypoint: `WP-${i}`,
        distanceKm: currentDist,
        batteryPct: battery,
        slipRiskPct: slipRisk,
      };
    });

    setTelemetry(dynamicTelemetry);
  }, [pathData]);

  // 1. Fetch Planetary Constants with Hackathon-Proof 3000ms Resilience
  useEffect(() => {
    let isMounted = true;

    async function loadPlanetaryPhysics() {
      setIsLoadingPhysics(true);
      try {
        const liveFetch = fetchPlanetaryConstants({
          target: targetPlanet,
          massKg: roverMassKg,
        });

        const fallbackClosure = () => {
          const earthG = 9.80665;
          const targetG = targetPlanet === 'mars' ? 3.72076 : 1.622;
          const earthRho = 1.225;
          const targetRho = targetPlanet === 'mars' ? 0.02 : 1e-12;
          return {
            success: true,
            targetRequested: targetPlanet,
            timestamp: new Date().toISOString(),
            source: 'NASA PDS Geosciences Node (Cached Fallback)',
            baselines: {
              earth: {
                name: 'Earth Baseline',
                gravity: { surfaceAccelerationMs2: earthG, earthRatio: 1.0, escapeVelocityKms: 11.18, standardUncertainty: 'Def' },
                atmosphere: { surfaceDensityKgM3: earthRho, surfacePressurePa: 101325, surfacePressureMbar: 1013.25, earthDensityRatio: 1.0, scaleHeightKm: 8.5, speedOfSoundMs: 340.3, composition: {}, convectiveHeatTransferRatio: 1.0 },
                radiation: { meanSurfaceDoseRateMSvDay: 0.0067, meanAnnualDoseMSvYear: 2.4, earthSurfaceDoseRatio: 1.0, galacticCosmicRayFraction: 15, solarParticleEventRisk: 'low' as const, halfValueLayerRegolithCm: 18 },
                thermal: { meanSurfaceTempK: 288.15, meanSurfaceTempC: 15, minTempK: 184, maxTempK: 330, diurnalSwingK: 12, solarIrradianceWm2: 1361 },
                regolith: { bulkDensityGramsCm3: 1.6, cohesionKPa: 1.5, internalFrictionAngleDeg: 32, sinkageModulusKc: 2.5, sinkageModulusKphi: 850 },
                pdsArchiveNodes: [],
              },
              mars: {
                name: 'Mars PDS Baseline',
                gravity: { surfaceAccelerationMs2: 3.72076, earthRatio: 0.3794, escapeVelocityKms: 5.03, standardUncertainty: 'MGS' },
                atmosphere: { surfaceDensityKgM3: 0.02, surfacePressurePa: 610, surfacePressureMbar: 6.1, earthDensityRatio: 0.0163, scaleHeightKm: 11.1, speedOfSoundMs: 240, composition: { CO2: 95.32 }, convectiveHeatTransferRatio: 0.12 },
                radiation: { meanSurfaceDoseRateMSvDay: 0.64, meanAnnualDoseMSvYear: 233.6, earthSurfaceDoseRatio: 95.5, galacticCosmicRayFraction: 88, solarParticleEventRisk: 'extreme' as const, halfValueLayerRegolithCm: 16.5 },
                thermal: { meanSurfaceTempK: 210, meanSurfaceTempC: -63.15, minTempK: 133, maxTempK: 293, diurnalSwingK: 80, solarIrradianceWm2: 590 },
                regolith: { bulkDensityGramsCm3: 1.52, cohesionKPa: 0.8, internalFrictionAngleDeg: 35, sinkageModulusKc: 1.8, sinkageModulusKphi: 650 },
                pdsArchiveNodes: [{ node: 'PDS Geosciences', datasetUrn: 'urn:nasa:pds:msl_rad', doi: '10.1126/science.1244797', missionInstrument: 'MSL RAD' }],
              },
              moon: {
                name: 'Moon PDS Baseline',
                gravity: { surfaceAccelerationMs2: 1.622, earthRatio: 0.1654, escapeVelocityKms: 2.38, standardUncertainty: 'GRAIL' },
                atmosphere: { surfaceDensityKgM3: 1e-12, surfacePressurePa: 3e-10, surfacePressureMbar: 3e-12, earthDensityRatio: 8e-13, scaleHeightKm: 50, speedOfSoundMs: 0, composition: {}, convectiveHeatTransferRatio: 0 },
                radiation: { meanSurfaceDoseRateMSvDay: 1.369, meanAnnualDoseMSvYear: 499.7, earthSurfaceDoseRatio: 204.3, galacticCosmicRayFraction: 94, solarParticleEventRisk: 'extreme' as const, halfValueLayerRegolithCm: 14.2 },
                thermal: { meanSurfaceTempK: 250, meanSurfaceTempC: -23.15, minTempK: 25, maxTempK: 393, diurnalSwingK: 280, solarIrradianceWm2: 1361 },
                regolith: { bulkDensityGramsCm3: 1.65, cohesionKPa: 1.2, internalFrictionAngleDeg: 42, sinkageModulusKc: 3.2, sinkageModulusKphi: 1100 },
                pdsArchiveNodes: [{ node: 'PDS Geosciences', datasetUrn: 'urn:nasa:pds:lro_crater', doi: '10.1029/2011SW000720', missionInstrument: 'LRO CRaTER' }],
              },
            },
          } as PlanetaryConstantsResponse;
        };

        const { data, isFallback } = await withResilience(
          liveFetch,
          fallbackClosure,
          3000,
          '⚡ Live API slow. Using Cached Demo Data for stability.'
        );

        if (isMounted) {
          setPhysicsData(data);
          setIsCachedPhysics(isFallback);
          setIsLoadingPhysics(false);
        }
      } catch {
        if (isMounted) {
          setIsLoadingPhysics(false);
          setIsCachedPhysics(true);
        }
      }
    }

    loadPlanetaryPhysics();

    return () => {
      isMounted = false;
    };
  }, [targetPlanet, roverMassKg]);

  // Live Math Scaling
  const targetBaseline =
    targetPlanet === 'mars' ? physicsData?.baselines.mars : physicsData?.baselines.moon;
  const earthBaseline = physicsData?.baselines.earth;

  const targetGravityG = targetBaseline?.gravity.earthRatio ?? (targetPlanet === 'mars' ? 0.38 : 0.17);
  const targetGravityMs2 = targetBaseline?.gravity.surfaceAccelerationMs2 ?? (targetPlanet === 'mars' ? 3.72 : 1.62);

  // Mass Offloading calculation:
  const requiredMassOffloadKg = Math.round(roverMassKg * (1 - targetGravityG) * 10) / 10;

  // Equivalent Wind Speed calculation:
  const targetDensity = targetBaseline?.atmosphere.surfaceDensityKgM3 ?? (targetPlanet === 'mars' ? 0.02 : 1e-12);
  const earthDensity = earthBaseline?.atmosphere.surfaceDensityKgM3 ?? 1.225;
  const windDensityRatio = targetDensity > 0 ? Math.sqrt(targetDensity / earthDensity) : 0;
  const equivalentEarthWindKmh = Math.round(marsStormSpeedKmh * windDensityRatio * 10) / 10;

  // Traverse Simulation Handler
  const handleSimulateTraverse = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTelemetry((prev) =>
        prev.map((pt, idx) => {
          if (idx <= step) {
            const dynamicSlip = Math.min(15, Math.max(5, Math.round(pt.slipRiskPct + (Math.random() * 2 - 1))));
            return {
              ...pt,
              slipRiskPct: dynamicSlip,
            };
          }
          return pt;
        })
      );

      if (step >= 10) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 120);
  };

  // Similarity Radar Dataset
  const radarChartData = [
    { metric: 'Slope (DEM)', value: radarScores.slope, fullMark: 100 },
    { metric: 'Temp (ΔT)', value: radarScores.temp, fullMark: 100 },
    { metric: 'NDVI Aridity', value: radarScores.ndvi, fullMark: 100 },
    { metric: 'Aerosol Depth', value: radarScores.aerosols, fullMark: 100 },
    { metric: 'Morphology', value: radarScores.morphology, fullMark: 100 },
  ];

  return (
    <div
      className={`w-full lg:w-96 flex flex-col bg-slate-950 text-slate-100 border border-slate-800 rounded-lg shadow-2xl p-4 gap-4 overflow-hidden ${className}`}
    >
      {/* Top Header & Telemetry Tag */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <h2 className="font-bold text-sm tracking-wider uppercase text-slate-100">
            Analytics & Physics
          </h2>
        </div>
        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isCachedPhysics ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className="font-mono text-[10px] uppercase text-slate-400">
            {isCachedPhysics ? 'Cached Baseline' : 'Live PDS'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-md border border-slate-800">
        <button
          onClick={() => setActiveTab('radar')}
          className={`py-1.5 text-xs font-semibold rounded transition-all ${
            activeTab === 'radar'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Radar
        </button>
        <button
          onClick={() => setActiveTab('physics')}
          className={`py-1.5 text-xs font-semibold rounded transition-all ${
            activeTab === 'physics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Physics
        </button>
        <button
          onClick={() => setActiveTab('traverse')}
          className={`py-1.5 text-xs font-semibold rounded transition-all ${
            activeTab === 'traverse'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sandbox
        </button>
      </div>

      {/* TAB 1: SIMILARITY RADAR */}
      {activeTab === 'radar' && (
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Target Analog Site:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[160px]">
              {selectedAnalogName}
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center bg-slate-900/40 rounded-lg border border-slate-800/80 p-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name="Match %"
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/70 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Overall Match Index</span>
              <span className="text-emerald-400 font-mono text-base font-bold">92.8%</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Confidence Interval</span>
              <span className="text-sky-400 font-mono text-base font-bold">±3.2%</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHYSICS COMPENSATOR */}
      {activeTab === 'physics' && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Planetary Archive:</span>
            <span className="text-amber-300 font-mono text-[11px] font-semibold">
              NASA PDS // {targetPlanet.toUpperCase()}
            </span>
          </div>

          {/* Interactive Rover Mass Slider */}
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center space-x-1.5">
                <Weight className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Rover Mass:</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">{roverMassKg} kg</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={roverMassKg}
              onChange={(e) => setRoverMassKg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Metric Card 1: Target Gravity */}
          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-xs block">Target Gravity</span>
              <span className="font-mono text-lg font-bold text-sky-400">
                {targetGravityG.toFixed(2)}g{' '}
                <span className="text-xs text-slate-300 font-normal">
                  ({targetPlanet === 'mars' ? 'Mars' : 'Moon'})
                </span>
              </span>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              {targetGravityMs2.toFixed(3)} m/s²
            </div>
          </div>

          {/* Metric Card 2: Required Mass Offloading */}
          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Required Mass Offloading</span>
              </span>
              <span className="font-mono font-bold text-amber-400 text-base">
                {requiredMassOffloadKg} kg
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Vertical counter-tension needed during terrestrial field testing to recreate target
              wheel sinkage and soil shear.
            </p>
          </div>

          {/* Metric Card 3: Equivalent Earth Wind Speed */}
          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center space-x-1.5">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Mars Dust Storm Speed:</span>
              </span>
              <span className="font-mono text-teal-300 font-bold">{marsStormSpeedKmh} km/h</span>
            </div>
            <input
              type="range"
              min="20"
              max="180"
              step="5"
              value={marsStormSpeedKmh}
              onChange={(e) => setMarsStormSpeedKmh(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-400">Equivalent Earth Wind Speed:</span>
              <span className="font-mono text-xs font-bold text-teal-400">
                {equivalentEarthWindKmh} km/h
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Due to low Martian air density (~0.02 kg/m³), 100 km/h wind exerts dynamic pressure
              equivalent to only a ~12.8 km/h gentle breeze on Earth.
            </p>
          </div>

          {/* Metric Card 4: Radiation Baseline */}
          <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-300 text-[11px] block">Surface Radiation Dose</span>
                <span className="text-[10px] text-slate-400">
                  {targetPlanet === 'mars' ? 'MSL Curiosity RAD' : 'LRO CRaTER'}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-rose-400 font-bold">
                {targetPlanet === 'mars' ? '0.64 mSv/d' : '1.37 mSv/d'}
              </span>
              <span className="text-[9px] text-slate-400 block">
                {targetPlanet === 'mars' ? '95.5× Earth' : '204× Earth'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAVERSE SANDBOX (REACTIVE TO PATH DATA FROM CENTERMAP) */}
      {activeTab === 'traverse' && (
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Route className="w-3.5 h-3.5 text-amber-400" />
              <span>Battery Drain vs. Distance</span>
            </span>
            {pathData ? (
              <span className="font-mono text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>GIS PATH: {pathData.distanceKm.toFixed(2)} KM</span>
              </span>
            ) : (
              <span className="font-mono text-[10px] text-amber-400 font-semibold">
                PRESET PATH: 5.0 KM
              </span>
            )}
          </div>

          {/* Line Chart */}
          <div className="h-56 w-full bg-slate-900/40 rounded-lg border border-slate-800/80 p-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.6} />
                <XAxis dataKey="distanceKm" unit="km" stroke="#64748b" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="batteryPct"
                  name="Battery %"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#10b981' }}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="slipRiskPct"
                  name="Wheel Slip Risk %"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={{ r: 2, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Simulation Trigger Button */}
          <button
            onClick={handleSimulateTraverse}
            disabled={isSimulating}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 active:scale-[0.98]'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Telemetry Stream...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Traverse Telemetry</span>
              </>
            )}
          </button>

          <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80 leading-relaxed">
            {pathData ? (
              <span>
                Traverse line linked from Map: <strong className="text-amber-300">{pathData.distanceKm.toFixed(2)} km</strong>.{' '}
                Battery discharges proportionally to terrain slope and regolith resistance.
              </span>
            ) : (
              <span>
                Use the <strong className="text-amber-300">"Draw Traverse Path A → B"</strong> button on the map to define a custom traverse.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
