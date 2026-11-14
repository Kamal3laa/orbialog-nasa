import React, { useState } from 'react';
import { AnalogLocation } from '../../types';
import { MapPin, ZoomIn, ZoomOut, Compass, Layers, Globe } from 'lucide-react';

interface InteractiveEarthMapProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  activeOverlay: 'elevation' | 'aridity' | 'geology' | 'standard';
  className?: string;
}

export const InteractiveEarthMap: React.FC<InteractiveEarthMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  activeOverlay,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState<AnalogLocation | null>(null);

  // Map dimensions for standard equirectangular projection
  const mapWidth = 960;
  const mapHeight = 500;

  // Coordinate projection math (Equirectangular WGS84 to SVG coordinates)
  const projectCoords = (lat: number, lng: number) => {
    // lng: -180 to 180 -> 0 to mapWidth
    const x = ((lng + 180) / 360) * mapWidth;
    // lat: 90 to -90 -> 0 to mapHeight
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 1), 3.5));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full h-[580px] bg-charcoal-deep border border-obsidian-border overflow-hidden select-none ${className}`}>
      {/* Top Map Telemetry Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-obsidian/90 border-b border-obsidian-border backdrop-blur-md font-mono text-xs">
        <div className="flex items-center space-x-3 text-stone-gray">
          <Globe className="w-4 h-4 text-earth-bright" />
          <span className="text-mineral-white font-semibold tracking-wider uppercase">TERRESTRIAL CARTOGRAPHIC PROJECTION [WGS84]</span>
          <span className="text-stone-dark">|</span>
          <span className="text-[11px] text-telemetry-cyan">CANDIDATES CATALOGED: {locations.length}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-stone-gray text-[11px]">
            <Layers className="w-3.5 h-3.5 text-mars" />
            <span className="uppercase text-mineral-muted">OVERLAY: {activeOverlay.toUpperCase()}</span>
          </div>

          <div className="flex items-center space-x-1 border border-obsidian-border bg-obsidian-card p-0.5">
            <button
              onClick={() => handleZoom(0.3)}
              className="p-1 hover:bg-obsidian-surface text-stone-gray hover:text-mineral-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.3)}
              className="p-1 hover:bg-obsidian-surface text-stone-gray hover:text-mineral-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 hover:bg-obsidian-surface text-stone-gray hover:text-mineral-white transition-colors text-[10px]"
              title="Reset View"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG GIS Map Container */}
      <div className="w-full h-full pt-10 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <defs>
            {/* Aridity Gradient */}
            <radialGradient id="aridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B75B3D" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B75B3D" stopOpacity="0" />
            </radialGradient>

            {/* Candidate Marker Pulse Glow */}
            <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deep Space / Ocean Background */}
          <rect width={mapWidth} height={mapHeight} fill="#0d100e" />

          {/* Lat / Long Graticules Grid */}
          <g stroke="#1e231e" strokeWidth="0.75" strokeDasharray="3 3">
            {/* Equator and Parallels */}
            <line x1="0" y1={mapHeight * 0.25} x2={mapWidth} y2={mapHeight * 0.25} />
            <line x1="0" y1={mapHeight * 0.5} x2={mapWidth} y2={mapHeight * 0.5} stroke="#323832" strokeWidth="1" />
            <line x1="0" y1={mapHeight * 0.75} x2={mapWidth} y2={mapHeight * 0.75} />

            {/* Meridians */}
            <line x1={mapWidth * 0.25} y1="0" x2={mapWidth * 0.25} y2={mapHeight} />
            <line x1={mapWidth * 0.5} y1="0" x2={mapWidth * 0.5} y2={mapHeight} stroke="#323832" strokeWidth="1" />
            <line x1={mapWidth * 0.75} y1="0" x2={mapWidth * 0.75} y2={mapHeight} />
          </g>

          {/* World Continents Stylized Accurate Polygons */}
          <g fill="#181d18" stroke="#2c332b" strokeWidth="0.8">
            {/* North America */}
            <path d="M120,70 L280,65 L310,120 L270,180 L230,210 L190,260 L170,290 L150,260 L100,180 L80,120 Z" />
            {/* Greenland */}
            <path d="M340,40 L410,45 L390,95 L330,85 Z" />
            {/* South America */}
            <path d="M250,290 L340,310 L370,370 L340,450 L300,470 L270,390 L240,320 Z" />
            {/* Europe */}
            <path d="M470,90 L560,95 L580,140 L520,175 L460,170 L450,130 Z" />
            {/* Africa (Contains Egypt candidates) */}
            <path d="M460,180 L590,185 L620,270 L570,380 L520,400 L470,320 L440,240 Z" />
            {/* Asia */}
            <path d="M570,90 L850,90 L890,220 L780,290 L710,270 L650,220 L580,170 Z" />
            {/* Australia */}
            <path d="M760,330 L870,335 L860,420 L770,410 Z" />
            {/* Antarctica */}
            <path d="M50,475 L910,475 L880,495 L80,495 Z" />
          </g>

          {/* Active Overlay Renderings */}
          {activeOverlay === 'aridity' && (
            <g>
              {/* Sahara & Arabian Hyper-Arid Belt Heatmap */}
              <ellipse cx="530" cy="205" rx="110" ry="40" fill="url(#aridGlow)" />
              {/* Atacama Core */}
              <ellipse cx="280" cy="370" rx="35" ry="50" fill="url(#aridGlow)" />
              {/* Australian Outback */}
              <ellipse cx="800" cy="365" rx="55" ry="35" fill="url(#aridGlow)" />
            </g>
          )}

          {activeOverlay === 'elevation' && (
            <g stroke="#64735d" strokeWidth="0.5" fill="none" opacity="0.4">
              {/* Topographic Contours Representation */}
              <path d="M520,200 Q550,195 580,210 Q600,230 570,250" />
              <path d="M260,320 Q280,360 290,420" />
              <path d="M70,80 Q150,90 220,140" />
            </g>
          )}

          {/* Coordinate Graticule Text Annotations */}
          <text x="10" y={mapHeight * 0.5 - 4} fill="#5C5B55" fontSize="8" fontFamily="IBM Plex Mono">0° EQUATOR</text>
          <text x={mapWidth * 0.5 + 4} y="14" fill="#5C5B55" fontSize="8" fontFamily="IBM Plex Mono">0° PRIME MERIDIAN</text>
          <text x="10" y={mapHeight * 0.25 - 4} fill="#5C5B55" fontSize="8" fontFamily="IBM Plex Mono">+45°N</text>
          <text x="10" y={mapHeight * 0.75 - 4} fill="#5C5B55" fontSize="8" fontFamily="IBM Plex Mono">-45°S</text>

          {/* Analog Candidate Markers */}
          {locations.map((loc) => {
            const { x, y } = projectCoords(loc.coordinates.lat, loc.coordinates.lng);
            const isSelected = loc.id === selectedLocationId;
            const isHovered = hoveredLocation?.id === loc.id;
            const isEgypt = loc.featuredEgypt;

            // Marker colors based on planet target match
            const markerColor = loc.primaryTargetAnalog === 'mars' ? '#B75B3D' : '#A8AAA6';

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Egypt Candidate Highlight Halo */}
                {isEgypt && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 18 : 12}
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="animate-spin-slow opacity-80"
                  />
                )}

                {/* Pulsing Selection Outer Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 14 : 10}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Base Marker Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : isEgypt ? 5 : 4}
                  fill={markerColor}
                  stroke="#111311"
                  strokeWidth="1.5"
                  filter="url(#glowEffect)"
                />

                {/* Inner Core Dot */}
                <circle cx={x} cy={y} r={isSelected ? 2.5 : 1.5} fill="#E8E5DC" />

                {/* Location Callout Tag (on hover or selection) */}
                {(isSelected || isHovered) && (
                  <g transform={`translate(${x + 10}, ${y - 12})`}>
                    <rect
                      x="0"
                      y="-12"
                      width={loc.name.length * 6.5 + 46}
                      height="22"
                      fill="#191B19"
                      stroke={isSelected ? '#E8E5DC' : '#88877F'}
                      strokeWidth="1"
                      className="shadow-xl"
                    />
                    <text
                      x="6"
                      y="2"
                      fill="#E8E5DC"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      fontWeight="bold"
                    >
                      {loc.name.toUpperCase()} [{loc.overallSimilarity.toFixed(1)}%]
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Tactical Coordinate Readout & Quick Info at Bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-[11px] text-stone-gray bg-obsidian/80 px-4 py-2 border border-obsidian-border backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-warm-white">
            <MapPin className="w-3.5 h-3.5 text-mars" />
            <span>ACTIVE FOCUS: {hoveredLocation ? hoveredLocation.name : 'HOVER OVER ANY MARKER TO INSPECT TELEMETRY'}</span>
          </div>
          {hoveredLocation && (
            <span className="text-stone-gray">COORDINATES: {hoveredLocation.coordinates.display}</span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-mars"></span>
            <span className="text-mineral-muted">MARS ANALOGS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-lunar"></span>
            <span className="text-mineral-muted">MOON ANALOGS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-telemetry-amber"></span>
            <span className="text-telemetry-amber font-semibold">EGYPT REGIONAL PRIORITY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

