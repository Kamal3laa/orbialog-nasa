import React, { useState } from 'react';
import { TESTING_DISCIPLINES, PLANETARY_GAP_LIMITATIONS } from '../../data/suitabilityDisciplines';
import { ANALOG_SITES } from '../../data/analogSites';
import { Activity, ShieldAlert, CheckCircle2, ChevronRight, Layers, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/audio';

interface MissionSuitabilityProps {
  onNavigateToDiscovery: () => void;
}

export const MissionSuitability: React.FC<MissionSuitabilityProps> = ({
  onNavigateToDiscovery,
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(TESTING_DISCIPLINES[0].id);

  const activeDiscipline =
    TESTING_DISCIPLINES.find((d) => d.id === selectedDisciplineId) || TESTING_DISCIPLINES[0];

  return (
    <section id="suitability" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-obsidian">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
              <Activity className="w-4 h-4" />
              <span>MODULE 04 // OPERATIONAL SUITABILITY MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading-sci font-bold text-mineral-white">
              Mission Suitability & The Planetary Gap
            </h2>
            <p className="text-sm font-sans text-stone-gray max-w-2xl">
              Distinguish with rigorous scientific fidelity between what can be verified on terrestrial analogs versus what requires spaceflight and vacuum chambers.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono-sci text-stone-gray">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>EARTH VERIFIABLE</span>
            </span>
            <span>|</span>
            <span className="flex items-center space-x-1.5 text-mars-rust">
              <ShieldAlert className="w-4 h-4" />
              <span>PLANETARY GAP (LIMITATION)</span>
            </span>
          </div>
        </div>

        {/* 6 Key Testing Disciplines Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {TESTING_DISCIPLINES.map((disc) => {
            const isSelected = disc.id === selectedDisciplineId;
            return (
              <button
                key={disc.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedDisciplineId(disc.id);
                }}
                className={`p-3 text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-mars-rust bg-charcoal shadow-technical-active'
                    : 'border-white/10 bg-charcoal/40 hover:border-white/20 hover:bg-charcoal'
                }`}
              >
                <span className="text-[10px] font-mono-sci text-stone-gray block">
                  {disc.code}
                </span>
                <span className="text-xs font-heading-sci font-bold text-mineral-white line-clamp-2 mt-1">
                  {disc.title.split('&')[0]}
                </span>
                <span className={`h-0.5 w-6 mt-3 ${isSelected ? 'bg-mars-rust' : 'bg-transparent'}`}></span>
              </button>
            );
          })}
        </div>

        {/* Active Discipline Detailed Breakdown */}
        <div className="p-6 bg-charcoal border border-white/15 space-y-6 reticle-corner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono-sci text-mars-rust block uppercase">
                DISCIPLINE PROFILE // {activeDiscipline.code}
              </span>
              <h3 className="text-2xl font-heading-sci font-bold text-mineral-white mt-1">
                {activeDiscipline.title}
              </h3>
            </div>
            <p className="text-xs font-mono-sci text-stone-gray max-w-md">
              {activeDiscipline.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: What Earth CAN Replicate (Green/Technical) */}
            <div className="p-5 bg-obsidian border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono-sci text-emerald-400 font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>01. HIGH-FIDELITY EARTH-REPLICABLE TESTING SCOPE</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-gray font-sans">
                {activeDiscipline.earthReplicableScope.map((scope, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-mineral-white/90">{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What Earth CANNOT Replicate (Red/Alert) */}
            <div className="p-5 bg-obsidian border border-mars-rust/40 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust font-bold uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>02. THE PLANETARY GAP (CRITICAL LIMITATIONS)</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-gray font-sans">
                {activeDiscipline.planetaryLimitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-mars-rust font-bold">⚠</span>
                    <span className="text-mineral-white/90">{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instruments & Recommended Analogs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs font-mono-sci">
            <div className="space-y-2">
              <span className="text-stone-gray text-[10px] uppercase block">
                BENCHMARK TEST RIGS & INSTRUMENTATION:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeDiscipline.keyInstruments.map((inst, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-mineral-white"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-stone-gray text-[10px] uppercase block">
                OPTIMAL VALIDATION ANALOG SITES:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeDiscipline.suggestedSites.map((siteId) => {
                  const site = ANALOG_SITES.find((s) => s.id === siteId);
                  return (
                    <button
                      key={siteId}
                      onClick={() => {
                        sound.playClick();
                        onNavigateToDiscovery();
                      }}
                      className="px-2.5 py-1 bg-mars-rust/10 hover:bg-mars-rust/20 border border-mars-rust/40 text-mars-rust flex items-center space-x-1 transition-colors"
                    >
                      <span>{site?.name || siteId}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Global Planetary Gap Physical Boundary Matrix Table */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <h3 className="text-lg font-heading-sci font-bold text-mineral-white">
              Planetary Boundary Discrepancies & Mitigation Strategies
            </h3>
            <span className="text-xs font-mono-sci text-stone-gray hidden sm:inline">
              ISO/AIAA AEROSPACE STANDARD BENCHMARK
            </span>
          </div>

          <div className="overflow-x-auto border border-white/15">
            <table className="w-full text-left font-mono-sci text-xs">
              <thead className="bg-charcoal text-stone-gray border-b border-white/15 text-[11px]">
                <tr>
                  <th className="p-3">PHYSICAL PARAMETER</th>
                  <th className="p-3">EARTH BASELINE</th>
                  <th className="p-3">MOON (LUNA)</th>
                  <th className="p-3">MARS (ARES)</th>
                  <th className="p-3">AEROSPACE MITIGATION PROTOCOL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-obsidian text-stone-gray">
                {PLANETARY_GAP_LIMITATIONS.map((gap, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-semibold text-mineral-white">
                      {gap.parameter}
                    </td>
                    <td className="p-3 text-earth-accent">
                      {gap.earthValue}
                    </td>
                    <td className="p-3 text-lunar-silver">
                      {gap.moonValue}
                    </td>
                    <td className="p-3 text-mars-rust">
                      {gap.marsValue}
                    </td>
                    <td className="p-3 text-stone-gray font-sans text-xs max-w-xs">
                      {gap.mitigationStrategy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

