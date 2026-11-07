import React, { useState } from 'react';
import { TargetPlanet, PlanetaryTarget } from '../../types';
import { PLANETARY_BODIES } from '../../data/planetaryBodies';
import { Globe2, Compass, Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PlanetaryExplorerProps {
  currentPlanet: TargetPlanet;
  onSelectPlanet: (planet: TargetPlanet) => void;
  onSelectTargetForComparison: (target: PlanetaryTarget) => void;
  onNavigate: (sectionId: string) => void;
}

export const PlanetaryExplorer: React.FC<PlanetaryExplorerProps> = ({
  currentPlanet,
  onSelectPlanet,
  onSelectTargetForComparison,
  onNavigate,
}) => {
  const planetData = PLANETARY_BODIES[currentPlanet];
  const [selectedTarget, setSelectedTarget] = useState<PlanetaryTarget | null>(
    planetData.primaryTargets[0] || null
  );

  const handlePlanetChange = (planet: TargetPlanet) => {
    sound.playClick();
    onSelectPlanet(planet);
    const newBody = PLANETARY_BODIES[planet];
    setSelectedTarget(newBody.primaryTargets[0] || null);
  };

  return (
    <section id="explorer" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-charcoal">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
              <Globe2 className="w-4 h-4" />
              <span>MODULE 01 // PLANETARY RECONNAISSANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading-sci font-bold text-mineral-white">
              Planetary Explorer & Target Sites
            </h2>
            <p className="text-sm font-sans text-stone-gray max-w-2xl">
              Inspect the physical regimes, gravity wells, radiation profiles, and primary surface landing sites for Luna and Ares, alongside Earth’s baseline parameters.
            </p>
          </div>

          {/* Planet Switcher Tabs */}
          <div className="flex items-center space-x-2 bg-obsidian p-1.5 border border-white/15">
            {(['Earth', 'Moon', 'Mars'] as TargetPlanet[]).map((planet) => {
              const isActive = currentPlanet === planet;
              return (
                <button
                  key={planet}
                  onClick={() => handlePlanetChange(planet)}
                  className={`px-4 py-2 text-xs font-mono-sci uppercase transition-all ${
                    isActive
                      ? 'bg-mars-rust text-white font-semibold shadow-technical'
                      : 'text-stone-gray hover:text-mineral-white hover:bg-white/5'
                  }`}
                >
                  {planet}
                </button>
              );
            })}
          </div>
        </div>

        {/* Planet Top-Level Specifications Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono-sci text-xs">
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">DESIGNATION</span>
            <span className="text-sm font-bold text-mineral-white">{planetData.designation}</span>
          </div>
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">SURFACE GRAVITY</span>
            <span className="text-sm font-bold text-mars-rust">
              {planetData.gravityMs2.toFixed(2)} m/s²
            </span>
            <span className="text-[10px] text-stone-gray block">
              {(planetData.gravityMs2 / 9.807).toFixed(2)} g
            </span>
          </div>
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">ATMOSPHERE PRESSURE</span>
            <span className="text-sm font-bold text-mineral-white">
              {planetData.surfacePressureKPa > 0.001
                ? `${planetData.surfacePressureKPa} kPa`
                : '< 10⁻¹² Pa (Vacuum)'}
            </span>
          </div>
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">THERMAL RANGE</span>
            <span className="text-sm font-bold text-mineral-white">
              {planetData.tempRangeC[0]}°C to {planetData.tempRangeC[1]}°C
            </span>
          </div>
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">SOLAR IRRADIANCE</span>
            <span className="text-sm font-bold text-mineral-white">
              {planetData.solarIrradianceWm2} W/m²
            </span>
          </div>
          <div className="p-3 bg-obsidian border border-white/10">
            <span className="text-stone-gray text-[10px] block">ANNUAL RADIATION</span>
            <span className="text-sm font-bold text-mars-rust">
              ~{planetData.radiationDoseMSvYr} mSv/yr
            </span>
          </div>
        </div>

        {/* Deep Target Exploration Grid */}
        {planetData.primaryTargets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Target Sites List (Left Column 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-sci text-stone-gray pb-1">
                <span>STRATEGIC CANDIDATE SITES ({planetData.primaryTargets.length})</span>
                <span>SELECT TO INSPECT</span>
              </div>

              {planetData.primaryTargets.map((target) => {
                const isSelected = selectedTarget?.id === target.id;
                return (
                  <div
                    key={target.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTarget(target);
                    }}
                    className={`p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-mars-rust bg-obsidian shadow-technical-active'
                        : 'border-white/10 bg-obsidian/60 hover:border-white/25 hover:bg-obsidian'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-mars-rust' : 'bg-stone-gray'
                            }`}
                          ></span>
                          <h3 className="font-heading-sci font-bold text-mineral-white text-base">
                            {target.name}
                          </h3>
                        </div>
                        <p className="text-xs font-mono-sci text-stone-gray mt-1">
                          COORDS: {target.coordinates}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono-sci text-stone-gray px-2 py-0.5 border border-white/10 bg-white/5">
                        {target.elevationM} m
                      </span>
                    </div>

                    <p className="text-xs font-sans text-stone-gray mt-2 line-clamp-2">
                      {target.geologicalType}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {target.keyMinerals.map((mineral, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono-sci px-1.5 py-0.5 bg-white/5 text-stone-gray border border-white/5"
                        >
                          {mineral}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Target Deep Dossier (Right Column 7 cols) */}
            {selectedTarget && (
              <div className="lg:col-span-7 p-6 bg-obsidian border border-white/15 space-y-6 reticle-corner">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono-sci text-mars-rust block uppercase">
                      TARGET RECONNAISSANCE DOSSIER // {selectedTarget.planetId.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-heading-sci font-bold text-mineral-white mt-1">
                      {selectedTarget.name}
                    </h3>
                    <p className="text-xs font-mono-sci text-stone-gray mt-1">
                      GEODETIC COORDS: {selectedTarget.coordinates} | ELEVATION: {selectedTarget.elevationM} m
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playChirp();
                      onSelectTargetForComparison(selectedTarget);
                      onNavigate('comparison');
                    }}
                    className="px-4 py-2 bg-mars-rust hover:bg-mars-light text-white text-xs font-mono-sci font-semibold uppercase flex items-center space-x-2 transition-colors flex-shrink-0"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>LOAD INTO COMPARISON</span>
                  </button>
                </div>

                {/* Target Scientific Context */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono-sci text-stone-gray uppercase tracking-wider">
                    MISSION RELEVANCE & OBJECTIVES
                  </h4>
                  <p className="text-sm font-sans text-mineral-white/90 leading-relaxed">
                    {selectedTarget.missionRelevance}
                  </p>
                </div>

                {/* Target Surface Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-sci text-xs">
                  <div className="p-3 bg-charcoal border border-white/10">
                    <span className="text-stone-gray text-[10px] block">AVG SLOPE</span>
                    <span className="text-base font-bold text-mineral-white">
                      {selectedTarget.slopeAvgDeg}°
                    </span>
                  </div>
                  <div className="p-3 bg-charcoal border border-white/10">
                    <span className="text-stone-gray text-[10px] block">ROCK ABUNDANCE</span>
                    <span className="text-base font-bold text-mineral-white">
                      {selectedTarget.rockAbundancePercent}%
                    </span>
                  </div>
                  <div className="p-3 bg-charcoal border border-white/10">
                    <span className="text-stone-gray text-[10px] block">TEMP ENVELOPE</span>
                    <span className="text-base font-bold text-mineral-white">
                      {selectedTarget.temperatureRange[0]}°C to {selectedTarget.temperatureRange[1]}°C
                    </span>
                  </div>
                  <div className="p-3 bg-charcoal border border-white/10">
                    <span className="text-stone-gray text-[10px] block">SOLAR REGIME</span>
                    <span className="text-xs font-bold text-earth-accent">
                      {selectedTarget.solarIllumination.substring(0, 18)}...
                    </span>
                  </div>
                </div>

                {/* Key Surface Features & Analog Needs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3.5 bg-charcoal border border-white/10 space-y-2">
                    <span className="text-[11px] font-mono-sci text-stone-gray uppercase block font-semibold">
                      SURFACE MORPHOLOGY FEATURES
                    </span>
                    <ul className="space-y-1.5 text-stone-gray">
                      {selectedTarget.surfaceFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-mars-rust font-bold">›</span>
                          <span className="text-mineral-white/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-charcoal border border-white/10 space-y-2">
                    <span className="text-[11px] font-mono-sci text-stone-gray uppercase block font-semibold">
                      CRITICAL ANALOG TESTING NEEDS
                    </span>
                    <ul className="space-y-1.5 text-stone-gray">
                      {selectedTarget.analogRequirements.map((req, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-earth-accent font-bold">›</span>
                          <span className="text-mineral-white/90">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Terrestrial Matches Tag */}
                <div className="p-3.5 bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-sci">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-earth-accent" />
                    <span className="text-stone-gray">MATCHED EARTH ANALOGS:</span>
                    <span className="text-mineral-white font-semibold">
                      {selectedTarget.matchedTerrestrialAnalogs.length} SITES IDENTIFIED
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNavigate('discovery');
                    }}
                    className="text-mars-rust hover:text-white flex items-center space-x-1"
                  >
                    <span>VIEW ON WORLD MAP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Earth Baseline Summary */
          <div className="p-8 bg-obsidian border border-white/15 space-y-4">
            <div className="flex items-center space-x-3 text-earth-accent font-mono-sci text-xs">
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold">EARTH BASELINE SCIENTIFIC LABORATORY</span>
            </div>
            <p className="text-base font-sans text-mineral-white/90 max-w-3xl leading-relaxed">
              Earth acts as our primary physical baseline and control environment. By maintaining a 1.0 g gravitational field, 101.3 kPa pressure, and magnetosphere shielding, terrestrial testing isolates mechanical, autonomous navigation, and geological sampling protocols before space missions undergo severe spaceflight qualification.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('discovery');
                }}
                className="px-5 py-2.5 bg-earth-green hover:bg-earth-accent text-white font-mono-sci text-xs font-semibold uppercase flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>OPEN TERRESTRIAL ANALOG MAP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

