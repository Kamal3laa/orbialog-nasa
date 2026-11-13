import React from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from '../types';
import { CelestialScene } from '../components/canvas3d/CelestialScene';
import { 
  ArrowRight, 
  Compass, 
  Globe, 
  Database, 
  Activity, 
  Crosshair, 
  Layers, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { audio } from '../utils/audio';

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
  const handleCta = (screen: ActiveScreen) => {
    audio.playConfirm();
    onNavigate(screen);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-charcoal">
      {/* 3D Celestial Background Visual (Earth, Moon, Mars in Cinematic Layout) */}
      <div className="absolute inset-0 z-0 opacity-90">
        <CelestialScene 
          interactive={true} 
          onSelectPlanet={(planet) => {
            audio.playClick();
            if (planet === 'mars') {
              const marsTarget = planetaryTargets.find(t => t.planet === 'mars');
              if (marsTarget) onSelectTarget(marsTarget);
              onNavigate('targets');
            } else if (planet === 'moon') {
              const moonTarget = planetaryTargets.find(t => t.planet === 'moon');
              if (moonTarget) onSelectTarget(moonTarget);
              onNavigate('targets');
            } else {
              onNavigate('discovery');
            }
          }}
        />
      </div>

      {/* Subtle Aerospace Coordinate Graticule Lines */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-grid-pattern opacity-40"></div>

      {/* Scientific Overlay Reticles */}
      <div className="absolute top-12 left-10 pointer-events-none z-10 hidden lg:block font-mono text-[11px] text-stone-gray/70 space-y-1">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-3.5 h-3.5 text-mars" />
          <span className="text-mineral-white font-semibold">ORBITAL EPHEMERIS: J2026.4</span>
        </div>
        <div>EQUATORIAL RA: 14h 29m 42s | DEC: -62° 40' 46"</div>
        <div>HELIOCENTRIC SOLAR DISTANCE: 1.524 AU (MARS) / 1.000 AU (EARTH)</div>
        <div className="text-telemetry-emerald">SUBSYSTEM STATUS: ALL FLIGHT INSTRUMENTS NOMINAL</div>
      </div>

      {/* Main Cinematic Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 pt-16 pb-8 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Scientific Classification Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-obsidian/90 border border-obsidian-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-mars animate-pulse"></span>
            <span className="text-mineral-white uppercase tracking-wider font-medium">
              NASA SPACE APPS CHALLENGE 2026 // EXPEDITION INTELLIGENCE
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="font-grotesk font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-mineral-white uppercase leading-[0.95]">
              Earth is our <br />
              <span className="text-stone-gray">Laboratory.</span>
            </h1>
            <div className="h-1 w-24 bg-mars"></div>
          </div>

          {/* Supporting Text */}
          <p className="font-inter text-lg md:text-xl text-mineral-muted max-w-2xl font-normal leading-relaxed">
            Discover the places on Earth that can prepare humanity for its next planetary frontier. 
            A scientific comparison engine bridging terrestrial terrain to permanent lunar outposts and future Martian exploration missions.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 font-mono text-xs">
            <button
              onClick={() => handleCta('discovery')}
              className="flex items-center space-x-3 px-6 py-3.5 bg-mars hover:bg-mars-glow text-mineral-white uppercase tracking-wider transition-all duration-150 shadow-lg group"
            >
              <Globe className="w-4 h-4" />
              <span className="font-semibold">EXPLORE ANALOGS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleCta('targets')}
              className="flex items-center space-x-3 px-6 py-3.5 bg-obsidian-card hover:bg-obsidian-surface border border-stone-gray/40 text-mineral-white uppercase tracking-wider transition-all duration-150"
            >
              <Compass className="w-4 h-4 text-lunar" />
              <span>SELECT TARGET</span>
            </button>

            <button
              onClick={() => handleCta('methodology')}
              className="flex items-center space-x-2 px-5 py-3.5 bg-transparent hover:bg-obsidian/50 border border-obsidian-border text-stone-gray hover:text-mineral-white uppercase tracking-wider transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>VIEW METHODOLOGY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Strip & Quick Destination Jumpers */}
      <div className="relative z-20 w-full bg-obsidian/95 border-t border-obsidian-border px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Quick Targets Selector Strip */}
          <div className="flex items-center space-x-2 text-stone-gray">
            <span className="text-[10px] uppercase text-stone-dark font-semibold tracking-wider">TARGET DESTINATIONS:</span>
            <div className="flex items-center space-x-2">
              {planetaryTargets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => {
                    audio.playClick();
                    onSelectTarget(target);
                    onNavigate('targets');
                  }}
                  className="px-2.5 py-1 bg-obsidian-card hover:bg-obsidian-surface border border-obsidian-border text-mineral-muted hover:text-mineral-white text-[11px] transition-colors flex items-center space-x-1.5"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${target.planet === 'mars' ? 'bg-mars' : 'bg-lunar'}`}></span>
                  <span>{target.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Terrestrial Benchmark (Highlighting Egypt & Global candidates) */}
          <div className="flex items-center space-x-3 text-[11px] text-stone-gray">
            <span className="text-stone-dark uppercase">FEATURED TERRESTRIAL ANALOGS:</span>
            <div className="flex items-center space-x-2">
              {featuredAnalogs.slice(0, 3).map((analog) => (
                <button
                  key={analog.id}
                  onClick={() => {
                    audio.playClick();
                    onNavigate('discovery');
                  }}
                  className="px-2 py-0.5 border border-obsidian-border bg-obsidian-card hover:border-mars text-mineral-white transition-colors"
                >
                  {analog.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Precision Sensor Badge */}
          <div className="flex items-center space-x-2 text-earth-bright text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PDS & USGS GROUND-TRUTH VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

