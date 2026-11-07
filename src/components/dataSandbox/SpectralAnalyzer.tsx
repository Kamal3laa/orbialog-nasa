import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, Sparkles, Filter, Info } from 'lucide-react';
import { sound } from '../../utils/audio';

interface MineralSpec {
  id: string;
  name: string;
  chemicalFormula: string;
  planetaryContext: string;
  terrestrialOccurrence: string;
  absorptionBands: { wavelengthUm: number; label: string }[];
  baseReflectance: number;
}

const MINERAL_SPECS: MineralSpec[] = [
  {
    id: 'smectite-clay',
    name: 'Fe/Mg Smectite (Nontronite/Saponite)',
    chemicalFormula: '(Ca,Na)0.3(Fe,Mg)2(Si,Al)4O10(OH)2·nH2O',
    planetaryContext: 'Jezero Crater paleolake delta and Gale Crater lower sedimentary strata.',
    terrestrialOccurrence: 'Altered volcanic ash tuffs, Atacama clay soils, and hydrothermal deposits.',
    absorptionBands: [
      { wavelengthUm: 1.41, label: 'O-H overtone' },
      { wavelengthUm: 1.92, label: 'H2O combination' },
      { wavelengthUm: 2.31, label: 'Fe-OH / Mg-OH stretch' },
    ],
    baseReflectance: 0.42,
  },
  {
    id: 'calcium-sulfate',
    name: 'Gypsum & Bassanite (Sulfates)',
    chemicalFormula: 'CaSO4 · 2H2O',
    planetaryContext: 'Gale Crater cross-cutting veins and Meridiani Planum evaporite sands.',
    terrestrialOccurrence: 'Qattara Depression sabkha crusts and White Desert evaporite fringes.',
    absorptionBands: [
      { wavelengthUm: 1.45, label: 'H2O 2v3 overtone' },
      { wavelengthUm: 1.75, label: 'S-O / H2O combination' },
      { wavelengthUm: 1.94, label: 'v1 + v3 H2O doublet' },
      { wavelengthUm: 2.22, label: 'Sulfate overtone' },
    ],
    baseReflectance: 0.65,
  },
  {
    id: 'ilmenite-basalt',
    name: 'Titanium-Rich Ilmenite & Olivine',
    chemicalFormula: 'FeTiO3 / (Mg,Fe)2SiO4',
    planetaryContext: 'Mare Tranquillitatis high-Ti basalts (Apollo 11) and Marius Hills lava flows.',
    terrestrialOccurrence: 'Mauna Loa tholeiitic basalts and Lanzarote volcanic geopark hornitos.',
    absorptionBands: [
      { wavelengthUm: 1.05, label: 'Fe2+ Crystal Field 1.05µm' },
      { wavelengthUm: 2.10, label: 'Pyroxene Fe2+ Band II' },
    ],
    baseReflectance: 0.18,
  },
  {
    id: 'water-ice-hydroxyl',
    name: 'Cryogenic Water-Ice & Trapped Frost',
    chemicalFormula: 'H2O (Amorphous / Hexagonal Ice)',
    planetaryContext: 'Lunar South Pole permanently shadowed cold traps (Shackleton) & Mars polar caps.',
    terrestrialOccurrence: 'McMurdo Dry Valleys subterranean wedge ice and Devon Island permafrost.',
    absorptionBands: [
      { wavelengthUm: 1.50, label: 'H2O Ice fundamental dip' },
      { wavelengthUm: 2.02, label: 'Ice absorption band 2.0µm' },
      { wavelengthUm: 3.10, label: 'Deep OH lattice absorption' },
    ],
    baseReflectance: 0.72,
  },
];

export const SpectralAnalyzer: React.FC = () => {
  const [selectedMineralId, setSelectedMineralId] = useState<string>(MINERAL_SPECS[0].id);

  const currentMineral =
    MINERAL_SPECS.find((m) => m.id === selectedMineralId) || MINERAL_SPECS[0];

  // Synthesize realistic reflectance spectrum curves from 0.4 µm to 3.5 µm
  const spectralData = useMemo(() => {
    const points = [];
    for (let wl = 0.4; wl <= 3.5; wl += 0.05) {
      const roundedWl = parseFloat(wl.toFixed(2));
      let orbitalReflectance = currentMineral.baseReflectance + Math.sin(roundedWl * 1.5) * 0.05;
      let terrestrialReflectance = orbitalReflectance * 1.02 + 0.01;

      // Apply absorption band dips
      currentMineral.absorptionBands.forEach((band) => {
        const dist = Math.abs(roundedWl - band.wavelengthUm);
        if (dist < 0.15) {
          const dipDepth = (1 - dist / 0.15) * 0.18;
          orbitalReflectance -= dipDepth;
          terrestrialReflectance -= dipDepth * 0.95; // Slight atmospheric terrestrial difference
        }
      });

      points.push({
        wavelength: roundedWl,
        orbital: parseFloat(Math.max(0.05, orbitalReflectance).toFixed(3)),
        terrestrial: parseFloat(Math.max(0.06, terrestrialReflectance).toFixed(3)),
      });
    }
    return points;
  }, [currentMineral]);

  return (
    <div className="p-6 bg-obsidian border border-white/15 space-y-6 reticle-corner select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
            <Activity className="w-4 h-4" />
            <span>SPECTRAL ABSORPTION BENCHMARK // 0.4µm - 3.5µm</span>
          </div>
          <h3 className="text-xl font-heading-sci font-bold text-mineral-white">
            Reflectance Spectroscopy Fingerprint Comparator
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-mono-sci text-stone-gray">
          <span className="flex items-center space-x-1.5 text-mars-rust">
            <span className="w-3 h-0.5 bg-mars-rust"></span>
            <span>CRISM/LOLA ORBITAL</span>
          </span>
          <span className="flex items-center space-x-1.5 text-earth-accent">
            <span className="w-3 h-0.5 bg-earth-accent"></span>
            <span>TERRESTRIAL FIELD ASD</span>
          </span>
        </div>
      </div>

      {/* Mineral Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {MINERAL_SPECS.map((min) => {
          const isSelected = min.id === selectedMineralId;
          return (
            <button
              key={min.id}
              onClick={() => {
                sound.playClick();
                setSelectedMineralId(min.id);
              }}
              className={`p-3 text-left border transition-all ${
                isSelected
                  ? 'border-mars-rust bg-charcoal shadow-technical-active'
                  : 'border-white/10 bg-charcoal/40 hover:border-white/20'
              }`}
            >
              <span className="text-[10px] font-mono-sci text-stone-gray block">
                {min.chemicalFormula}
              </span>
              <span className="text-xs font-heading-sci font-bold text-mineral-white line-clamp-1 mt-1">
                {min.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Spectral Graph Viewport */}
      <div className="p-4 bg-charcoal border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-sci text-stone-gray">
          <span>REFLECTANCE INDEX (0.0 to 1.0) vs WAVELENGTH (MICROMETERS)</span>
          <span className="text-mars-rust font-semibold">
            {currentMineral.absorptionBands.length} DIAGNOSTIC DIPS
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spectralData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="wavelength"
                stroke="#88877F"
                tick={{ fill: '#88877F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                unit="µm"
              />
              <YAxis
                domain={[0, 1.0]}
                stroke="#88877F"
                tick={{ fill: '#88877F', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#191B19',
                  borderColor: 'rgba(232,229,220,0.2)',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '11px',
                }}
                formatter={(val: any) => [val, 'Reflectance']}
                labelFormatter={(lbl) => `${lbl} µm Wavelength`}
              />
              {currentMineral.absorptionBands.map((band, idx) => (
                <ReferenceLine
                  key={idx}
                  x={band.wavelengthUm}
                  stroke="rgba(183, 91, 61, 0.5)"
                  strokeDasharray="2 2"
                  label={{
                    value: band.label,
                    fill: '#B75B3D',
                    fontSize: 8,
                    fontFamily: 'IBM Plex Mono',
                    position: 'insideTopRight',
                  }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="orbital"
                name="Orbital Sensor (CRISM)"
                stroke="#B75B3D"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="terrestrial"
                name="Terrestrial Field Spectrometer"
                stroke="#7E9075"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mineral Geological Context Readout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs font-mono-sci">
          <div className="p-3 bg-obsidian border border-white/5 space-y-1">
            <span className="text-[10px] text-mars-rust uppercase block">PLANETARY RELEVANCE</span>
            <p className="text-stone-gray font-sans text-xs">{currentMineral.planetaryContext}</p>
          </div>
          <div className="p-3 bg-obsidian border border-white/5 space-y-1">
            <span className="text-[10px] text-earth-accent uppercase block">TERRESTRIAL CORRELATION</span>
            <p className="text-stone-gray font-sans text-xs">{currentMineral.terrestrialOccurrence}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
