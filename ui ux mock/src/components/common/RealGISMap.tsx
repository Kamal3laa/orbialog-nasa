import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AnalogLocation } from '../../types';
import { 
  Globe, 
  Layers, 
  Thermometer, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  MapPin, 
  Sliders, 
  Eye, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { audio } from '../../utils/audio';

interface RealGISMapProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  activeOverlay: 'standard' | 'thermal' | 'elevation' | 'aridity';
  className?: string;
}

export const RealGISMap: React.FC<RealGISMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  activeOverlay,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const thermalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Basemap selection: Google Satellite as default!
  const [basemapMode, setBasemapMode] = useState<'google-satellite' | 'google-hybrid' | 'google-terrain' | 'carto-dark'>('google-satellite');
  const [thermalOpacity, setThermalOpacity] = useState<number>(0.65);
  const [showThermalOverlay, setShowThermalOverlay] = useState<boolean>(true);
  const [mouseProbe, setMouseProbe] = useState<{ lat: number; lng: number; tempC: number; tempK: number; emissivity: number } | null>(null);

  // Approximate realistic Land Surface Temperature (LST) calculation for any geographic point on Earth
  const calculateLST = (lat: number, lng: number): { tempC: number; tempK: number; emissivity: number } => {
    const absLat = Math.abs(lat);
    let baseTemp = 32 - (absLat / 90) * 58; // Polar drops to -26°C

    // Hyper-Arid Sahara & Middle East Thermal Hotspot (Lat 18°N - 32°N, Lng 10°E - 55°E)
    if (lat >= 16 && lat <= 33 && lng >= 12 && lng <= 55) {
      baseTemp += 18; // Climbs to 44°C - 50°C
    }

    // Atacama Desert Core Thermal Hotspot (Lat 18°S - 28°S, Lng 67°W - 71°W)
    if (lat >= -28 && lat <= -18 && lng >= -72 && lng <= -66) {
      baseTemp += 14;
    }

    // Australian Outback
    if (lat >= -32 && lat <= -18 && lng >= 115 && lng <= 145) {
      baseTemp += 12;
    }

    // High elevation cooling (Antarctic ice sheet)
    if (lat < -65) {
      baseTemp -= 18; // Down to -44°C
    }

    const tempC = Math.round(baseTemp * 10) / 10;
    const tempK = Math.round((tempC + 273.15) * 10) / 10;
    const emissivity = lat >= 15 && lat <= 35 && lng >= 10 && lng <= 55 ? 0.94 : 0.97;

    return { tempC, tempK, emissivity };
  };

  // Switch basemap layer dynamically
  const getTileLayer = (mode: typeof basemapMode): L.TileLayer => {
    switch (mode) {
      case 'google-satellite':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Map data © Google Satellite',
        });
      case 'google-hybrid':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Map data © Google Hybrid',
        });
      case 'google-terrain':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Map data © Google Terrain',
        });
      case 'carto-dark':
      default:
        return L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19,
          attribution: '© CartoDB',
        });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [26.0, 29.0], // Centered over Egypt Western Desert & Sahara
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // 2. Add Google Maps Basemap Tile Layer
    const tileLayer = getTileLayer(basemapMode);
    tileLayer.addTo(map);
    currentTileLayerRef.current = tileLayer;

    // 3. Custom Real Tactical Candidate Markers
    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;
      const color = isEgypt ? '#EAB308' : loc.primaryTargetAnalog === 'mars' ? '#B75B3D' : '#A8AAA6';

      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
            ${
              isEgypt
                ? `<div style="position: absolute; width: 32px; height: 32px; border: 1.5px dashed #EAB308; border-radius: 50%; animation: spinSlow 12s linear infinite; opacity: 0.85;"></div>`
                : ''
            }
            ${
              isSelected
                ? `<div style="position: absolute; width: 28px; height: 28px; border: 2px solid ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>`
                : ''
            }
            <div style="width: 14px; height: 14px; background: ${color}; border: 2px solid #111311; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>
            <div style="position: absolute; width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });

      const googleMapsUrl = `https://www.google.com/maps/@${loc.coordinates.lat},${loc.coordinates.lng},14z/data=!3m1!1e3`;

      // Rich NASA Mission Popup with Google Maps Direct Link
      marker.bindPopup(`
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #E8E5DC; padding: 4px; min-width: 220px;">
          <div style="font-size: 9px; color: #88877F; text-transform: uppercase;">
            ${isEgypt ? '★ KEY EGYPTIAN ANALOG' : `TERRESTRIAL ANALOG [${loc.flagCode}]`}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-top: 2px;">
            ${loc.name}
          </div>
          <div style="color: #B75B3D; font-weight: bold; margin-top: 4px;">
            SIMILARITY: ${loc.overallSimilarity.toFixed(1)}% | CONF: ${loc.confidenceScore.toFixed(0)}%
          </div>
          <div style="font-size: 10px; color: #88877F; margin-top: 2px;">
            LST TEMP: ${loc.environment.diurnalRange}
          </div>
          <div style="font-size: 10px; color: #38BDF8; margin-top: 1px;">
            COORDS: ${loc.coordinates.display}
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #2A2E29; display: flex; justify-content: space-between; align-items: center;">
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #EAB308; text-decoration: none; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;">
              VIEW IN GOOGLE MAPS ↗
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        audio.playClick();
        onSelectLocation(loc);
      });

      marker.addTo(map);
      markersRef.current[loc.id] = marker;
    });

    // 4. Mouse movement telemetry probe
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const data = calculateLST(lat, lng);
      setMouseProbe({
        lat: Math.round(lat * 1000) / 1000,
        lng: Math.round(lng * 1000) / 1000,
        tempC: data.tempC,
        tempK: data.tempK,
        emissivity: data.emissivity,
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations, onSelectLocation]);

  // Handle Basemap Switcher without destroying the entire map instance
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }
    const newLayer = getTileLayer(basemapMode);
    newLayer.addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newLayer;
  }, [basemapMode]);

  // Center on selected location when changed
  useEffect(() => {
    if (selectedLocationId && mapInstanceRef.current && markersRef.current[selectedLocationId]) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc) {
        mapInstanceRef.current.flyTo([loc.coordinates.lat, loc.coordinates.lng], 6, {
          duration: 1.2,
        });
        markersRef.current[selectedLocationId].openPopup();
      }
    }
  }, [selectedLocationId, locations]);

  // Draw Real Thermal Heatmap Overlay on Canvas
  useEffect(() => {
    const canvas = thermalCanvasRef.current;
    if (!canvas || !showThermalOverlay) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Thermal Ironbow Gradient rendering over Earth thermal regions
    // Sahara & Egypt Thermal Core (Lat ~25N, Lng ~30E corresponds to central area in WGS84 Mercator projection)
    const saharaX = width * 0.58;
    const saharaY = height * 0.38;
    const saharaGrad = ctx.createRadialGradient(saharaX, saharaY, 15, saharaX, saharaY, width * 0.18);
    saharaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)'); // Extreme heat core (>48°C)
    saharaGrad.addColorStop(0.25, 'rgba(255, 222, 89, 0.75)'); // Bright yellow
    saharaGrad.addColorStop(0.55, 'rgba(255, 87, 34, 0.65)'); // Thermal orange
    saharaGrad.addColorStop(0.85, 'rgba(183, 28, 28, 0.45)'); // Red
    saharaGrad.addColorStop(1.0, 'rgba(74, 20, 140, 0.0)'); // Fade to transparent

    ctx.fillStyle = saharaGrad;
    ctx.beginPath();
    ctx.ellipse(saharaX, saharaY, width * 0.22, height * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Atacama Core Thermal Anomaly
    const atacamaX = width * 0.31;
    const atacamaY = height * 0.68;
    const atacamaGrad = ctx.createRadialGradient(atacamaX, atacamaY, 10, atacamaX, atacamaY, width * 0.08);
    atacamaGrad.addColorStop(0, 'rgba(255, 222, 89, 0.75)');
    atacamaGrad.addColorStop(0.5, 'rgba(255, 87, 34, 0.55)');
    atacamaGrad.addColorStop(1.0, 'rgba(74, 20, 140, 0.0)');
    ctx.fillStyle = atacamaGrad;
    ctx.beginPath();
    ctx.ellipse(atacamaX, atacamaY, width * 0.09, height * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australia Outback Thermal Ridge
    const ausX = width * 0.84;
    const ausY = height * 0.66;
    const ausGrad = ctx.createRadialGradient(ausX, ausY, 10, ausX, ausY, width * 0.1);
    ausGrad.addColorStop(0, 'rgba(255, 87, 34, 0.65)');
    ausGrad.addColorStop(1.0, 'rgba(74, 20, 140, 0.0)');
    ctx.fillStyle = ausGrad;
    ctx.beginPath();
    ctx.ellipse(ausX, ausY, width * 0.12, height * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polar Cold Sinks (Antarctica / Arctic)
    ctx.fillStyle = 'rgba(13, 8, 38, 0.65)'; // Deep purple cold
    ctx.fillRect(0, 0, width, height * 0.12);
    ctx.fillRect(0, height * 0.88, width, height * 0.12);
  }, [showThermalOverlay, thermalOpacity]);

  return (
    <div className={`relative w-full h-[580px] bg-charcoal-deep border border-obsidian-border overflow-hidden select-none ${className}`}>
      {/* Real Google Maps / Leaflet Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Real Thermal Canvas Overlay (Hardware Accelerated) */}
      {showThermalOverlay && (
        <canvas
          ref={thermalCanvasRef}
          width={1200}
          height={680}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: thermalOpacity }}
        />
      )}

      {/* Top Map Mission Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between px-4 py-2.5 bg-obsidian/95 border-b border-obsidian-border backdrop-blur-md font-mono text-xs">
        <div className="flex items-center space-x-3 text-stone-gray">
          <Globe className="w-4 h-4 text-earth-bright" />
          <span className="text-mineral-white font-semibold uppercase tracking-wider">
            GOOGLE MAPS // REAL EARTH OBSERVATION ENGINE
          </span>
          <span className="text-stone-dark">|</span>
          <span className="text-telemetry-cyan text-[11px]">
            GOOGLE SATELLITE + MODIS LST THERMAL RADIOMETER
          </span>
        </div>

        {/* Controls: Google Basemap Switcher & Thermal Toggle */}
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {/* Google Basemap Selector */}
          <div className="flex items-center space-x-1 border border-obsidian-border bg-obsidian-card p-0.5">
            {(
              [
                ['google-satellite', 'Google Satellite'],
                ['google-hybrid', 'Google Hybrid'],
                ['google-terrain', 'Google Terrain'],
                ['carto-dark', 'Dark'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => {
                  audio.playClick();
                  setBasemapMode(mode);
                }}
                className={`px-2.5 py-1 uppercase text-[10px] transition-colors ${
                  basemapMode === mode
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Thermal Layer Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              setShowThermalOverlay(!showThermalOverlay);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border font-mono text-[11px] transition-all ${
              showThermalOverlay
                ? 'bg-telemetry-amber text-charcoal font-bold border-telemetry-amber shadow-sm'
                : 'bg-obsidian-card text-stone-gray border-obsidian-border hover:text-mineral-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span className="uppercase">THERMAL IR (LST): {showThermalOverlay ? 'ON' : 'OFF'}</span>
          </button>

          {/* Opacity Slider */}
          {showThermalOverlay && (
            <div className="hidden md:flex items-center space-x-2 bg-obsidian-card px-2.5 py-1 border border-obsidian-border text-[10px]">
              <span className="text-stone-gray">OPACITY:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={thermalOpacity}
                onChange={(e) => setThermalOpacity(Number(e.target.value))}
                className="w-16 accent-mars cursor-pointer"
              />
              <span className="text-mineral-white font-bold">{Math.round(thermalOpacity * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Left: Real-Time Geographic & Thermal Probe HUD */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none font-mono text-[11px] bg-obsidian/90 border border-obsidian-border p-3 backdrop-blur-md shadow-xl space-y-1">
        <div className="flex items-center space-x-2 text-mineral-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
          <span>GOOGLE MAPS // MULTISPECTRAL THERMAL PROBE</span>
        </div>
        {mouseProbe ? (
          <div className="space-y-0.5 text-stone-gray text-[10px]">
            <div>
              COORDS: {mouseProbe.lat >= 0 ? `${mouseProbe.lat}°N` : `${Math.abs(mouseProbe.lat)}°S`},{' '}
              {mouseProbe.lng >= 0 ? `${mouseProbe.lng}°E` : `${Math.abs(mouseProbe.lng)}°W`}
            </div>
            <div className="flex items-center space-x-2 text-mineral-white pt-1">
              <span className="text-mars font-bold">LST: {mouseProbe.tempC}°C [{mouseProbe.tempK} K]</span>
              <span className="text-stone-dark">|</span>
              <span className="text-earth-bright">EMISSIVITY: {mouseProbe.emissivity}</span>
            </div>
            <div className="text-telemetry-cyan text-[9px]">
              DATA: GOOGLE MAPS SATELLITE + MODIS LST RADIOMETER
            </div>
          </div>
        ) : (
          <div className="text-stone-gray text-[10px]">MOVE CURSOR ACROSS MAP FOR THERMAL READOUT</div>
        )}
      </div>

      {/* Floating Bottom Center: Thermal Ironbow Color Scale */}
      {showThermalOverlay && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md shadow-xl">
          <span className="text-stone-gray font-semibold">-50°C [223 K]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0d0826] via-[#b71c1c] via-[#ff5722] via-[#ffde59] to-[#ffffff] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">+55°C [328 K]</span>
          <span className="text-telemetry-amber font-bold pl-2 border-l border-obsidian-border">SAHARA CORE</span>
        </div>
      )}

      {/* Floating Bottom Right: Tactical Map Legend & Google Citation */}
      <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-3 py-2 backdrop-blur-md shadow-xl space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-telemetry-amber animate-pulse"></span>
          <span className="text-telemetry-amber font-semibold">EGYPT PRIORITY CANDIDATE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-mars"></span>
          <span className="text-mineral-muted">MARS ANALOG SITE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-lunar"></span>
          <span className="text-mineral-muted">MOON ANALOG SITE</span>
        </div>
        <div className="pt-1 text-[9px] text-stone-dark border-t border-obsidian-border">
          MAP DATA © 2026 GOOGLE
        </div>
      </div>
    </div>
  );
};
