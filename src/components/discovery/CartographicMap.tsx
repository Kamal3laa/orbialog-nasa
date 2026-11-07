import React, { useState, useRef } from 'react';
import { AnalogSite } from '../../types';
import { formatCoordinates } from '../../utils/calculations';
import { Plus, Minus, RotateCcw, Crosshair } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CartographicMapProps {
  sites: AnalogSite[];
  selectedSite: AnalogSite | null;
  onSelectSite: (site: AnalogSite) => void;
  hoveredSite: AnalogSite | null;
  onHoverSite: (site: AnalogSite | null) => void;
}

// Convert Lat/Lng to SVG coordinates on Equirectangular projection (width=1000, height=500)
function projectCoordinates(lat: number, lng: number): { x: number; y: number } {
  // lng: -180 to 180 -> 0 to 1000
  // lat: 90 to -90 -> 0 to 500
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

export const CartographicMap: React.FC<CartographicMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  hoveredSite,
  onHoverSite,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({ lat: 26.8, lng: 30.8 });
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - pan.x) / zoom;
      const relY = (e.clientY - rect.top - pan.y) / zoom;

      // Reverse project to lat/lng
      const lng = (relX / 1000) * 360 - 180;
      const lat = 90 - (relY / 500) * 180;
      if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
        setCursorCoords({ lat, lng });
      }
    }

    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoomIn = () => {
    sound.playClick();
    setZoom((z) => Math.min(3.5, z + 0.5));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setZoom((z) => Math.max(1, z - 0.5));
  };

  const handleReset = () => {
    sound.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on Egypt candidate sites
  const handleFocusEgypt = () => {
    sound.playChirp();
    setZoom(2.8);
    // Center roughly on Egypt (28°N, 30°E -> x=583, y=172)
    setPan({ x: -620, y: -90 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[450px] lg:h-[580px] bg-charcoal border border-white/15 overflow-hidden select-none cursor-crosshair"
    >
      {/* Top Left GIS Status Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2 bg-obsidian/90 backdrop-blur-md px-3 py-1.5 border border-white/10 font-mono-sci text-[11px] text-stone-gray pointer-events-none">
        <Crosshair className="w-3.5 h-3.5 text-mars-rust animate-spin" />
        <span className="text-mineral-white font-medium">GIS CARTOGRAPHIC PROJECTOR</span>
        <span>|</span>
        <span>WGS-84 / EQUIRECTANGULAR</span>
      </div>

      {/* Top Right Real-Time Cursor Geodetic Tracking */}
      <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center space-x-3 bg-obsidian/90 backdrop-blur-md px-3 py-1.5 border border-white/10 font-mono-sci text-[11px] text-stone-gray pointer-events-none">
        <span>POINTER LAT/LNG:</span>
        <span className="text-mars-rust font-semibold">
          {formatCoordinates(cursorCoords.lat, cursorCoords.lng)}
        </span>
      </div>

      {/* Map Interactive Controls (Right Toolbar) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1.5 bg-obsidian/90 backdrop-blur-md p-1.5 border border-white/15">
        <button
          onClick={handleZoomIn}
          className="p-2 text-stone-gray hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-stone-gray hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 text-stone-gray hover:text-white hover:bg-white/10 transition-colors"
          title="Reset Global View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-px bg-white/15 my-1"></div>
        <button
          onClick={handleFocusEgypt}
          className="px-2 py-1 text-[10px] font-mono-sci text-mars-rust hover:bg-mars-rust/20 border border-mars-rust/50 transition-colors text-center"
          title="Zoom directly to Egyptian candidate analog sites"
        >
          FOCUS EGYPT
        </button>
      </div>

      {/* SVG Canvas Map Engine */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <defs>
          <pattern id="carto-subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(232, 229, 220, 0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Ocean Background & Subgrid */}
        <rect width="1000" height="500" fill="#141714" />
        <rect width="1000" height="500" fill="url(#carto-subgrid)" />

        {/* Scientific Graticule: Latitude lines every 30 deg */}
        {[0, 30, 60, -30, -60].map((lat) => {
          const y = ((90 - lat) / 180) * 500;
          return (
            <g key={`lat-${lat}`}>
              <line
                x1="0"
                y1={y}
                x2="1000"
                y2={y}
                stroke={lat === 0 ? 'rgba(183, 91, 61, 0.4)' : 'rgba(232, 229, 220, 0.08)'}
                strokeWidth={lat === 0 ? '1' : '0.5'}
                strokeDasharray={lat === 0 ? 'none' : '4,4'}
              />
              <text
                x="8"
                y={y - 3}
                fill="rgba(136, 135, 127, 0.6)"
                fontSize="7"
                fontFamily="IBM Plex Mono"
              >
                {lat === 0 ? 'EQUATOR 0°' : `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`}
              </text>
            </g>
          );
        })}

        {/* Scientific Graticule: Longitude meridians every 60 deg */}
        {[-120, -60, 0, 60, 120].map((lng) => {
          const x = ((lng + 180) / 360) * 1000;
          return (
            <g key={`lng-${lng}`}>
              <line
                x1={x}
                y1="0"
                x2={x}
                y2="500"
                stroke={lng === 0 ? 'rgba(100, 115, 93, 0.5)' : 'rgba(232, 229, 220, 0.08)'}
                strokeWidth={lng === 0 ? '1' : '0.5'}
                strokeDasharray={lng === 0 ? 'none' : '4,4'}
              />
              <text
                x={x + 3}
                y="12"
                fill="rgba(136, 135, 127, 0.6)"
                fontSize="7"
                fontFamily="IBM Plex Mono"
              >
                {lng === 0 ? 'PRIME MERIDIAN 0°' : `${Math.abs(lng)}°${lng > 0 ? 'E' : 'W'}`}
              </text>
            </g>
          );
        })}

        {/* Simplified Vector Continental Outlines */}
        {/* Eurasia & Africa */}
        <path
          d="M 450,110 L 480,90 L 530,95 L 600,105 L 680,120 L 760,110 L 820,130 L 850,180 L 810,210 L 760,250 L 710,240 L 660,210 L 610,215 L 560,185 L 510,180 L 480,165 Z"
          fill="#1C201C"
          stroke="#2A302A"
          strokeWidth="1"
        />
        {/* Africa & Middle East */}
        <path
          d="M 480,185 L 530,180 L 570,195 L 590,245 L 575,320 L 540,380 L 500,385 L 475,320 L 460,240 L 470,200 Z"
          fill="#1F231F"
          stroke="#2D352D"
          strokeWidth="1"
        />
        {/* North America */}
        <path
          d="M 120,80 L 220,70 L 310,95 L 290,160 L 250,190 L 230,240 L 190,225 L 140,170 L 110,120 Z"
          fill="#1C201C"
          stroke="#2A302A"
          strokeWidth="1"
        />
        {/* South America */}
        <path
          d="M 235,250 L 280,265 L 320,310 L 305,370 L 270,440 L 245,410 L 235,320 Z"
          fill="#1C201C"
          stroke="#2A302A"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M 780,310 L 860,300 L 890,345 L 850,390 L 770,370 Z"
          fill="#1C201C"
          stroke="#2A302A"
          strokeWidth="1"
        />
        {/* Antarctica */}
        <path
          d="M 80,470 L 920,470 L 900,495 L 100,495 Z"
          fill="#252A28"
          stroke="#39423E"
          strokeWidth="1"
        />

        {/* Location Markers */}
        {sites.map((site) => {
          const { x, y } = projectCoordinates(site.coordinates.lat, site.coordinates.lng);
          const isSelected = selectedSite?.id === site.id;
          const isHovered = hoveredSite?.id === site.id;
          const isEgypt = site.isEgyptianCandidate;

          return (
            <g
              key={site.id}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onSelectSite(site);
              }}
              onMouseEnter={() => onHoverSite(site)}
              onMouseLeave={() => onHoverSite(null)}
              className="cursor-pointer group"
            >
              {/* Outer Pulse Beacon */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 14 : isHovered ? 10 : isEgypt ? 8 : 6}
                fill="none"
                stroke={isEgypt ? '#B75B3D' : '#64735D'}
                strokeWidth={isEgypt ? 1.5 : 1}
                opacity={isSelected ? 0.9 : 0.6}
                className="animate-beacon"
              />

              {/* Marker Center Dot */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 4.5 : isEgypt ? 3.5 : 2.5}
                fill={isEgypt ? '#B75B3D' : isSelected ? '#E8E5DC' : '#A8AAA6'}
                stroke="#111311"
                strokeWidth="1"
              />

              {/* Egyptian Candidate Star Glyph */}
              {isEgypt && (
                <text
                  x={x + 6}
                  y={y - 5}
                  fill="#B75B3D"
                  fontSize="8"
                  fontFamily="IBM Plex Mono"
                  fontWeight="bold"
                >
                  ★ CANDIDATE
                </text>
              )}

              {/* Quick Label for selected/hovered */}
              {(isSelected || isHovered) && (
                <g>
                  <rect
                    x={x + 10}
                    y={y - 18}
                    width={site.name.length * 6.5 + 24}
                    height="18"
                    fill="#191B19"
                    stroke={isEgypt ? '#B75B3D' : '#E8E5DC'}
                    strokeWidth="0.8"
                  />
                  <text
                    x={x + 14}
                    y={y - 5}
                    fill="#E8E5DC"
                    fontSize="8"
                    fontFamily="Space Grotesk"
                    fontWeight="bold"
                  >
                    {site.name} ({site.fidelityScore}%)
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 bg-obsidian/90 backdrop-blur-md px-3 py-1.5 border border-white/10 font-mono-sci text-[10px] text-stone-gray pointer-events-none">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-mars-rust"></span>
          <span className="text-mineral-white">EGYPT CANDIDATE (STUDY IN PROGRESS)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-stone-gray"></span>
          <span>VALIDATED GLOBAL ANALOG</span>
        </div>
      </div>
    </div>
  );
};

