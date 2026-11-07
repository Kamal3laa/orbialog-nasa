import React, { useState } from 'react';
import { PlanetaryTarget, AnalogSite } from '../../types';
import { Layers, ArrowDownUp, Mountain } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ElevationCrossSectionProps {
  target: PlanetaryTarget;
  analog: AnalogSite;
}

export const ElevationCrossSection: React.FC<ElevationCrossSectionProps> = ({
  target,
  analog,
}) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  // Generate synthetic topographic profile points for target
  const targetElevationBase = target.elevationM;
  const isCanyonOrCrater = target.id.includes('crater') || target.id.includes('valles') || target.id.includes('pit');
  
  // Normalized 2D elevation profile curves
  const targetProfile = isCanyonOrCrater
    ? [
        { distKm: 0.0, elevM: targetElevationBase + 1200, slopeDeg: 12, label: 'Rim Crest' },
        { distKm: 1.5, elevM: targetElevationBase + 750, slopeDeg: 28, label: 'Talus Wall' },
        { distKm: 3.0, elevM: targetElevationBase + 200, slopeDeg: 18, label: 'Debris Apron' },
        { distKm: 4.5, elevM: targetElevationBase, slopeDeg: target.slopeAvgDeg, label: 'Floor Basin / Delta' },
        { distKm: 6.0, elevM: targetElevationBase + 80, slopeDeg: 4, label: 'Central Mound' },
      ]
    : [
        { distKm: 0.0, elevM: targetElevationBase, slopeDeg: 3, label: 'Basalt Plain' },
        { distKm: 2.0, elevM: targetElevationBase + 40, slopeDeg: 5, label: 'Wrinkle Ridge' },
        { distKm: 4.0, elevM: targetElevationBase - 20, slopeDeg: 2, label: 'Mare Floor' },
        { distKm: 6.0, elevM: targetElevationBase + 10, slopeDeg: 3, label: 'Pyroclastic Mantle' },
      ];

  const analogProfile = analog.isEgyptianCandidate
    ? [
        { distKm: 0.0, elevM: analog.elevationM + 45, slopeDeg: 22, label: 'Yardang Crest / Plateau' },
        { distKm: 1.0, elevM: analog.elevationM + 15, slopeDeg: 34, label: 'Undercut Chalk Scarp' },
        { distKm: 2.5, elevM: analog.elevationM, slopeDeg: 6, label: 'Aeolian Dune Corridor' },
        { distKm: 4.0, elevM: analog.elevationM + 30, slopeDeg: 19, label: 'Secondary Ventifact Ridge' },
        { distKm: 6.0, elevM: analog.elevationM + 5, slopeDeg: 3, label: 'Deflation Basin Floor' },
      ]
    : [
        { distKm: 0.0, elevM: analog.elevationM + 180, slopeDeg: 24, label: 'Volcanic Scarp' },
        { distKm: 1.5, elevM: analog.elevationM + 80, slopeDeg: 16, label: 'Basalt Lava Channel' },
        { distKm: 3.5, elevM: analog.elevationM, slopeDeg: 8, label: 'Ash Plain' },
        { distKm: 6.0, elevM: analog.elevationM - 30, slopeDeg: 4, label: 'Lava Tube Cavity Roof' },
      ];

  return (
    <div className="p-6 bg-obsidian border border-white/15 space-y-6 reticle-corner select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
            <Mountain className="w-4 h-4" />
            <span>TOPOGRAPHIC STRATIGRAPHY CROSS-SECTION</span>
          </div>
          <h3 className="text-xl font-heading-sci font-bold text-mineral-white">
            Geomorphic Elevation & Strata Parity Profile
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono-sci text-stone-gray">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-mars-rust"></span>
            <span className="text-mineral-white">{target.name} (Planetary)</span>
          </span>
          <span>|</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-earth-accent"></span>
            <span className="text-mineral-white">{analog.name} (Earth)</span>
          </span>
        </div>
      </div>

      {/* Side-by-Side SVG Cross-Section Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planetary Target Slice */}
        <div className="p-4 bg-charcoal border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-sci">
            <span className="text-mars-rust font-bold">{target.name.toUpperCase()}</span>
            <span className="text-stone-gray">DATUM: {target.elevationM} m (Ref)</span>
          </div>

          <div className="relative h-48 w-full bg-obsidian border border-white/5 overflow-hidden">
            <svg viewBox="0 0 400 160" className="w-full h-full preserve-3d">
              {/* Stratigraphic Strata Bands */}
              <defs>
                <linearGradient id="target-strata" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b75b3d" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#693021" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2e140d" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />

              {/* Surface Elevation Terrain Polyline */}
              <polygon
                points="0,160 0,35 90,85 180,125 280,135 400,110 400,160"
                fill="url(#target-strata)"
              />
              <polyline
                points="0,35 90,85 180,125 280,135 400,110"
                fill="none"
                stroke="#B75B3D"
                strokeWidth="2"
              />

              {/* Landmark Keypoints */}
              {targetProfile.map((pt, i) => {
                const cx = (i / (targetProfile.length - 1)) * 380 + 10;
                const cy = 35 + i * 22;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#E8E5DC" stroke="#B75B3D" strokeWidth="1.5" />
                    <text
                      x={cx + 6}
                      y={cy - 6}
                      fill="#88877F"
                      fontSize="7"
                      fontFamily="IBM Plex Mono"
                    >
                      {pt.label} ({pt.slopeDeg}°)
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Scale */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono-sci text-stone-gray pointer-events-none">
              <span>0.0 KM (TRANSECT START)</span>
              <span>SLOPE: ~{target.slopeAvgDeg}° AVG</span>
              <span>6.0 KM (TRANSECT END)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono-sci text-stone-gray flex justify-between">
            <span>STRATIGRAPHY: {target.geologicalType.split('&')[0]}</span>
            <span className="text-mineral-white">ROCKS: {target.rockAbundancePercent}%</span>
          </div>
        </div>

        {/* Terrestrial Analog Slice */}
        <div className="p-4 bg-charcoal border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-sci">
            <span className="text-earth-accent font-bold">{analog.name.toUpperCase()}</span>
            <span className="text-stone-gray">ELEV: {analog.elevationM} m (MSL)</span>
          </div>

          <div className="relative h-48 w-full bg-obsidian border border-white/5 overflow-hidden">
            <svg viewBox="0 0 400 160" className="w-full h-full preserve-3d">
              <defs>
                <linearGradient id="analog-strata" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64735D" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#3B4437" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1C211A" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(232,229,220,0.06)" strokeDasharray="3,3" />

              <polygon
                points="0,160 0,45 80,110 180,130 270,75 400,120 400,160"
                fill="url(#analog-strata)"
              />
              <polyline
                points="0,45 80,110 180,130 270,75 400,120"
                fill="none"
                stroke="#7E9075"
                strokeWidth="2"
              />

              {analogProfile.map((pt, i) => {
                const cx = (i / (analogProfile.length - 1)) * 380 + 10;
                const cy = i % 2 === 0 ? 55 + i * 15 : 110 - i * 8;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#E8E5DC" stroke="#7E9075" strokeWidth="1.5" />
                    <text
                      x={cx + 6}
                      y={cy - 6}
                      fill="#88877F"
                      fontSize="7"
                      fontFamily="IBM Plex Mono"
                    >
                      {pt.label} ({pt.slopeDeg}°)
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono-sci text-stone-gray pointer-events-none">
              <span>0.0 KM (TRANSECT START)</span>
              <span>SLOPE VARIANCE: {analog.metrics.slopeVariance}%</span>
              <span>6.0 KM (TRANSECT END)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono-sci text-stone-gray flex justify-between">
            <span>REGIME: {analog.tagline.split('&')[0]}</span>
            <span className="text-mineral-white">ROUGHNESS: {analog.metrics.terrainRoughness}%</span>
          </div>
        </div>
      </div>

      {/* Scientific Synthesis Notes */}
      <div className="p-4 bg-charcoal border border-white/10 text-xs font-mono-sci text-stone-gray flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-mineral-white font-bold">CROSS-SECTION SYNTHESIS: </span>
          Elevation gradients between {analog.name} and {target.name} match closely in slope frequency distribution, allowing realistic autonomous obstacle avoidance benchmark testing.
        </div>
        <div className="text-mars-rust font-semibold flex-shrink-0">
          CORRELATION CONFIDENCE: 89.2%
        </div>
      </div>
    </div>
  );
};
