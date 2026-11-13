import React from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from '../types';
import { CelestialScene } from '../components/canvas3d/CelestialScene';
import { 
  ArrowRight, 
  Compass, 
  Globe, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Activity,
  Flame,
  Award
} from 'lucide-react';

interface Screen1LandingProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSelectTarget: (target: PlanetaryTarget) => void;
  planetaryTargets: PlanetaryTarget[];
  featuredAnalogs: AnalogLocation[];
}

export const Screen1Landing: React.FC<Screen1LandingProps> = ({
  onNavigate,
  onSelectTarget,
  planetaryTargets,
  featuredAnalogs,
}) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-space-void">
      {/* 3D Celestial Background Visual: Full Viewport Photorealistic Earth, Moon & Mars */}
      <div className="absolute inset-0 z-0 opacity-95">
        <CelestialScene
          interactive={true}
          onSelectPlanet={(planet) => {
            if (planet === 'mars') {
              const marsTarget = planetaryTargets.find((t) => t.planet === 'mars');
              if (marsTarget) onSelectTarget(marsTarget);
              onNavigate('targets');
            } else if (planet === 'moon') {
              const moonTarget = planetaryTargets.find((t) => t.planet === 'moon');
              if (moonTarget) onSelectTarget(moonTarget);
              onNavigate('targets');
            } else {
              onNavigate('discovery');
            }
          }}
        />
      </div>

      {/* Subtle Atmospheric Vignette Gradients (No harsh box edges) */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-space-void via-transparent to-space-void/40" />
      <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-10 bg-gradient-to-r from-space-void/90 via-space-void/40 to-transparent" />

      {/* Main Hero Editorial Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-8">
          {/* Scientific Credential Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl shadow-glass">
            <span className="w-2 h-2 rounded-full bg-mars shadow-[0_0_8px_#F97316] animate-pulse"></span>
            <span className="text-xs font-inter font-medium text-starlight-bright tracking-wide uppercase">
              Planetary Terrestrial Analog Discovery Platform
            </span>
          </div>

          {/* Grand Architectural Headline */}
          <div className="space-y-4">
            <h1 className="font-grotesk font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-starlight-white leading-[1.02]">
              Earth Is Our <br />
              <span className="bg-gradient-to-r from-starlight-white via-starlight-muted to-starlight-dim bg-clip-text text-transparent">
                Planetary Laboratory.
              </span>
            </h1>
            <p className="font-inter text-base sm:text-lg md:text-xl text-starlight-dim max-w-2xl font-normal leading-relaxed">
              Unlocking the extreme geological terrains, hyper-arid yardangs, and polar cold deserts of Earth that directly prepare humanity for the permanent lunar frontier and Martian exploration missions.
            </p>
          </div>

          {/* High-Impact Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('discovery')}
              className="flex items-center space-x-3 px-7 py-4 rounded-full bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-grotesk font-semibold text-sm tracking-wide shadow-mars-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
            >
              <Globe className="w-4 h-4 text-white" />
              <span>Explore 12 Global Analogs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('targets')}
              className="flex items-center space-x-3 px-6 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] hover:border-white/[0.25] text-starlight-white font-grotesk font-medium text-sm tracking-wide backdrop-blur-xl transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-earth" />
              <span>Select Planetary Target</span>
            </button>
          </div>

          {/* Core Platform Pillars Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-2xl">
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-earth font-grotesk font-semibold text-sm">
                <Globe className="w-4 h-4" />
                <span>6 Continents</span>
              </div>
              <p className="text-[11px] text-starlight-subtle mt-1">From Atacama & Sahara to the High Arctic</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-mars font-grotesk font-semibold text-sm">
                <Flame className="w-4 h-4" />
                <span>95%+ Fidelity</span>
              </div>
              <p className="text-[11px] text-starlight-subtle mt-1">CRISM, HiRISE & ASTER spectral correlation</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-telemetry-emerald font-grotesk font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Flight Validated</span>
              </div>
              <p className="text-[11px] text-starlight-subtle mt-1">Rover mobility, drill retention & suit ingress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Curated Benchmarks Bar */}
      <div className="relative z-20 w-full bg-space-surface/75 border-t border-white/[0.08] px-6 lg:px-8 py-4 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Target Body Badges */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-inter font-medium text-starlight-subtle uppercase tracking-wider">
              TARGET DESTINATIONS:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {planetaryTargets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => {
                    onSelectTarget(target);
                    onNavigate('targets');
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.20] text-xs font-inter text-starlight-muted hover:text-starlight-white transition-all duration-150"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${target.planet === 'mars' ? 'bg-mars shadow-[0_0_6px_#F97316]' : 'bg-lunar shadow-[0_0_6px_#FFFFFF]'}`} />
                  <span className="font-medium">{target.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Global Analog Quick Jumps */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-inter font-medium text-starlight-subtle uppercase tracking-wider">
              PRIME BENCHMARKS:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {featuredAnalogs.slice(0, 3).map((analog) => (
                <button
                  key={analog.id}
                  onClick={() => onNavigate('discovery')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-earth/40 text-xs font-inter text-starlight-muted hover:text-starlight-white transition-all duration-150"
                >
                  <span className="text-earth font-mono text-[10px] mr-1.5">[{analog.flagCode}]</span>
                  <span>{analog.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
