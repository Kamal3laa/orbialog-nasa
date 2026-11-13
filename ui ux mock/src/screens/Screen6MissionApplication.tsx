import React, { useState } from 'react';
import { 
  ActiveScreen, 
  MissionApplicationDomain, 
  AnalogLocation, 
  PlanetaryTarget 
} from '../types';
import { MISSION_APPLICATION_DOMAINS } from '../data/missionApplications';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Compass, 
  Navigation, 
  Target, 
  UserCheck, 
  Shield, 
  Info,
  ChevronRight
} from 'lucide-react';
import { audio } from '../utils/audio';

interface Screen6MissionApplicationProps {
  selectedAnalog: AnalogLocation;
  selectedTarget: PlanetaryTarget;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectAnalog: (loc: AnalogLocation) => void;
  analogLocations: AnalogLocation[];
}

export const Screen6MissionApplication: React.FC<Screen6MissionApplicationProps> = ({
  selectedAnalog,
  selectedTarget,
  onNavigate,
  onSelectAnalog,
  analogLocations,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(MISSION_APPLICATION_DOMAINS[0].id);

  const activeDomain =
    MISSION_APPLICATION_DOMAINS.find((d) => d.id === selectedDomainId) ||
    MISSION_APPLICATION_DOMAINS[0];

  const handleDomainSelect = (id: string) => {
    audio.playClick();
    setSelectedDomainId(id);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-obsidian-border pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-wider mb-1">
            <span className="text-mars font-bold">MISSION STEP 05</span>
            <span>//</span>
            <span>OPERATIONAL FLIGHT TESTING QUALIFICATION</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
            Mission Applications
          </h1>
          <p className="font-inter text-stone-gray text-xs md:text-sm mt-1 max-w-2xl">
            Operational qualification testbeds for planetary hardware, autonomy algorithms, and astronaut EVAs 
            utilizing certified terrestrial analog conditions.
          </p>
        </div>

        {/* Active Context Badges */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="px-3 py-1.5 bg-obsidian-card border border-obsidian-border text-stone-gray">
            ACTIVE SITE: <span className="text-earth-bright font-bold">{selectedAnalog.name.split(' (')[0]}</span>
          </div>
          <div className="px-3 py-1.5 bg-obsidian-card border border-obsidian-border text-stone-gray">
            TARGET: <span className="text-mars font-bold">{selectedTarget.name.split(' (')[0]}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Domain Tabs on Left, Full Feasibility & Instrumentation Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 7 Mission Application Domain Selectors */}
        <div className="lg:col-span-5 space-y-3">
          <div className="font-mono text-xs text-stone-gray uppercase tracking-wider">
            MISSION QUALIFICATION DOMAINS [{MISSION_APPLICATION_DOMAINS.length}]
          </div>

          <div className="space-y-2">
            {MISSION_APPLICATION_DOMAINS.map((domain) => {
              const isSelected = domain.id === activeDomain.id;
              return (
                <div
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain.id)}
                  className={`p-4 border cursor-pointer transition-all duration-150 select-none relative ${
                    isSelected
                      ? 'bg-obsidian-surface border-mars shadow-md ring-1 ring-mars/40'
                      : 'bg-obsidian hover:bg-obsidian-card border-obsidian-border'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-mars"></div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-stone-gray uppercase">
                      {domain.code}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-mars' : 'text-stone-dark'}`} />
                  </div>

                  <h3 className="font-grotesk font-bold text-sm text-mineral-white mt-1">
                    {domain.title}
                  </h3>
                  <p className="font-inter text-xs text-mineral-muted mt-0.5 line-clamp-1">
                    {domain.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Earth vs Planet Feasibility Notice */}
          <div className="p-4 bg-obsidian/70 border border-obsidian-border font-mono text-xs text-stone-gray space-y-2">
            <div className="flex items-center space-x-2 text-mineral-white font-semibold">
              <Info className="w-4 h-4 text-telemetry-amber" />
              <span>FEASIBILITY RECOMMENDATION RULE</span>
            </div>
            <p className="text-[11px] leading-relaxed text-mineral-dim">
              Terrestrial testing must rigorously distinguish between what can realistically be tested on Earth (soil shear strength, wheel slip, stereoscopic disparity) and factors governed by fundamental planetary physics (reduced gravity, hard vacuum, cosmic ionizing radiation).
            </p>
          </div>
        </div>

        {/* Right Column: In-Depth Experiment Recommendation & Feasibility Matrix */}
        <div className="lg:col-span-7 bg-obsidian border border-obsidian-border p-6 lg:p-8 space-y-6">
          {/* Top Domain Title & Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-border pb-4 gap-2">
            <div>
              <div className="font-mono text-[10px] text-mars uppercase tracking-widest font-semibold">
                OPERATIONAL DIRECTIVE // {activeDomain.code}
              </div>
              <h2 className="font-grotesk font-bold text-2xl lg:text-3xl text-mineral-white uppercase mt-0.5">
                {activeDomain.title}
              </h2>
              <p className="font-inter text-stone-gray text-xs mt-1">
                {activeDomain.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="font-inter text-sm text-mineral-white leading-relaxed">
            {activeDomain.description}
          </p>

          {/* THE CORE DELIVERABLE: EXPERIMENT RECOMMENDATION PANEL (WHAT CAN BE TESTED VS WHAT CANNOT) */}
          <div className="space-y-4 pt-2">
            <h3 className="font-grotesk font-bold text-base text-mineral-white uppercase flex items-center space-x-2">
              <Layers className="w-4 h-4 text-mars" />
              <span>EXPERIMENT FEASIBILITY MATRIX</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feasible Tests Panel (Green Check) */}
              <div className="bg-obsidian-card border border-telemetry-emerald/40 p-4 space-y-3">
                <div className="flex items-center space-x-2 font-mono text-xs text-telemetry-emerald font-semibold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FEASIBLE ON TERRESTRIAL ANALOG</span>
                </div>
                <ul className="space-y-2 font-inter text-xs text-mineral-muted">
                  {activeDomain.feasibleTests.map((t, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-telemetry-emerald font-mono font-bold">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unfeasible / Boundary Factors Panel (Red/Amber Cross) */}
              <div className="bg-obsidian-card border border-mars/40 p-4 space-y-3">
                <div className="flex items-center space-x-2 font-mono text-xs text-mars font-semibold uppercase">
                  <XCircle className="w-4 h-4" />
                  <span>UNFEASIBLE ON EARTH (REQUIRES LAB/OFFLOAD)</span>
                </div>
                <ul className="space-y-2 font-inter text-xs text-mineral-muted">
                  {activeDomain.unfeasibleFactors.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-mars font-mono font-bold">✕</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Field Instrumentation Requirements */}
          <div className="space-y-3 pt-2">
            <h3 className="font-grotesk font-bold text-base text-mineral-white uppercase flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-telemetry-cyan" />
              <span>RECOMMENDED FIELD INSTRUMENTATION RIGS</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {activeDomain.fieldInstrumentation.map((inst, i) => (
                <div key={i} className="p-3 bg-obsidian-card border border-obsidian-border text-mineral-white flex items-center space-x-2">
                  <span className="text-telemetry-cyan">›</span>
                  <span className="text-[11px]">{inst}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Metrics */}
          <div className="space-y-3 pt-2">
            <h3 className="font-grotesk font-bold text-base text-mineral-white uppercase flex items-center space-x-2">
              <Target className="w-4 h-4 text-telemetry-amber" />
              <span>QUANTITATIVE QUALIFICATION BENCHMARKS</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {activeDomain.validationMetrics.map((met, i) => (
                <div key={i} className="p-3 bg-obsidian-card border border-obsidian-border text-mineral-white flex items-center space-x-2">
                  <span className="text-telemetry-amber">▪</span>
                  <span className="text-[11px]">{met}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-obsidian-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="text-stone-gray text-[11px]">
              RECOMMENDED SITE: <span className="text-earth-bright uppercase font-semibold">{activeDomain.recommendedLocations[0]}</span>
            </div>

            <button
              onClick={() => {
                audio.playConfirm();
                onNavigate('methodology');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-mars hover:bg-mars-glow text-mineral-white uppercase tracking-wider font-semibold transition-colors"
            >
              <span>INSPECT ANALYTICAL METHODOLOGY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

