import React from 'react';
import { TargetPlanet } from '../../types';
import { PlanetaryCanvas } from './PlanetaryCanvas';
import { ArrowUpRight, Compass, Database, ShieldCheck, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface HeroSectionProps {
  currentPlanet: TargetPlanet;
  onSelectPlanet: (planet: TargetPlanet) => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentPlanet,
  onSelectPlanet,
  onNavigate,
}) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-cad-grid">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">
        {/* Left Column: Authentic Aerospace Editorial & Mission Scope */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mission Designation Tag */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-sci">
            <span className="px-2.5 py-1 bg-mars-rust/15 border border-mars-rust text-mars-rust font-semibold">
              NASA SPACE APPS 2026
            </span>
            <span className="px-2 py-1 bg-obsidian border border-white/15 text-stone-gray">
              SYS-REF: ORB-TERRA-2026-V1
            </span>
            <span className="flex items-center space-x-1.5 px-2 py-1 bg-white/5 border border-white/10 text-stone-gray">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>ANALOG PROTOCOL: ACTIVE</span>
            </span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading-sci font-bold tracking-tight text-mineral-white leading-[1.05]">
              ORB<span className="text-mars-rust">i</span>ALOG
            </h1>
            <p className="text-lg sm:text-xl font-heading-sci text-mars-rust tracking-wider uppercase font-semibold">
              Earth is our laboratory.
            </p>
            <div className="h-0.5 w-16 bg-mars-rust"></div>
          </div>

          {/* Scientific Introduction */}
          <p className="text-base sm:text-lg text-mineral-white/90 leading-relaxed font-sans max-w-xl">
            Discover terrestrial environments that can prepare humanity for its next frontier. 
            ORBiALOG investigates how Earth’s most extreme geological formations—from Egypt’s hyper-arid White Desert to Antarctic cold valleys—serve as scientific analogs for permanent Moon bases and Mars landing sites.
          </p>

          {/* Key Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2 font-mono-sci text-xs">
            <div className="p-3 bg-obsidian border border-white/10">
              <span className="text-stone-gray block text-[10px]">MONITORED ANALOGS</span>
              <span className="text-xl font-bold text-mineral-white">09</span>
              <span className="text-[10px] text-earth-accent block">Global Sites</span>
            </div>
            <div className="p-3 bg-obsidian border border-white/10">
              <span className="text-stone-gray block text-[10px]">EGYPT CANDIDATES</span>
              <span className="text-xl font-bold text-mars-rust">03</span>
              <span className="text-[10px] text-stone-gray block">Yardangs & Sabkhas</span>
            </div>
            <div className="p-3 bg-obsidian border border-white/10">
              <span className="text-stone-gray block text-[10px]">PLANETARY CORRELATION</span>
              <span className="text-xl font-bold text-mineral-white">88%</span>
              <span className="text-[10px] text-stone-gray block">Avg Fidelity Index</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              onClick={() => {
                sound.playChirp();
                onNavigate('discovery');
              }}
              className="px-6 py-3.5 bg-mars-rust hover:bg-mars-light text-white text-xs font-mono-sci font-semibold tracking-wider uppercase transition-all shadow-technical flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE ANALOGS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('data-sandbox');
              }}
              className="px-6 py-3.5 bg-obsidian hover:bg-white/10 text-mineral-white text-xs font-mono-sci font-semibold tracking-wider uppercase transition-all border border-white/15 flex items-center justify-center space-x-2"
            >
              <Database className="w-4 h-4 text-stone-gray" />
              <span>VIEW MISSION DATA</span>
            </button>
          </div>

          {/* Editorial Note & Disclaimer */}
          <div className="flex items-start space-x-2.5 text-[11px] font-mono-sci text-stone-gray pt-2 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-earth-accent flex-shrink-0 mt-0.5" />
            <span>
              All terrestrial analog data conforms to standard planetary science methodology. Non-replicated planetary conditions (microgravity, hard vacuum, cosmic radiation) are explicitly documented in comparison analyses.
            </span>
          </div>
        </div>

        {/* Right Column: Full-fidelity 3D Planetary Scene */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <PlanetaryCanvas
            currentPlanet={currentPlanet}
            onSelectPlanet={(planet) => {
              sound.playClick();
              onSelectPlanet(planet);
            }}
          />

          {/* Quick Context Card beneath 3D viewport */}
          <div className="mt-3 p-3 bg-obsidian border border-white/10 flex items-center justify-between text-xs font-mono-sci">
            <div className="flex items-center space-x-2">
              <span className="text-stone-gray">CURRENT TARGET:</span>
              <span className="text-mineral-white font-bold">{currentPlanet.toUpperCase()}</span>
              <span className="text-stone-gray hidden sm:inline">|</span>
              <span className="text-mars-rust hidden sm:inline">
                {currentPlanet === 'Earth'
                  ? 'Terrestrial Base & Analog Host'
                  : currentPlanet === 'Moon'
                  ? 'Artemis Exploration Horizon'
                  : 'Ares Deep Space Horizon'}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('explorer');
              }}
              className="text-mineral-white hover:text-mars-rust flex items-center space-x-1 transition-colors"
            >
              <span>INSPECT BODY</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

