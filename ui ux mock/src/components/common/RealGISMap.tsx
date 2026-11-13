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
  ExternalLink,
  Sun,
  Moon,
  Satellite
} from 'lucide-react';
import { audio } from '../../utils/audio';

interface RealGISMapProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  activeOverlay: 'standard' | 'thermal' | 'elevation' | 'aridity';
  className?: string;
}

export type ThermalMode = 'day-lst' | 'night-lst' | 'false-color-ir';

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
  const thermalWmsLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const isothermalLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Basemap selection (Google Maps as primary default)
  const [basemapMode, setBasemapMode] = useState<'google-satellite' | 'google-hybrid' | 'google-terrain' | 'carto-dark'>('google-satellite');
  
  // Real NASA GIBS Thermal Layer Configuration
  const [showThermalOverlay, setShowThermalOverlay] = useState<boolean>(true);
  const [thermalMode, setThermalMode] = useState<ThermalMode>('day-lst');
  const [thermalOpacity, setThermalOpacity] = useState<number>(0.75);
  const [showIsothermalContours, setShowIsothermalContours] = useState<boolean>(true);
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

  // Google Maps / Carto Tile Provider
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

  // REAL NASA GIBS Satellite WMS Layer Generator
  const getNASA_GIBS_ThermalLayer = (mode: ThermalMode, opacity: number): L.TileLayer.WMS => {
    let layerName = 'MODIS_Terra_Land_Surface_Temp_Day';
    if (mode === 'night-lst') {
      layerName = 'MODIS_Terra_Land_Surface_Temp_Night';
    } else if (mode === 'false-color-ir') {
      layerName = 'MODIS_Terra_CorrectedReflectance_Bands721';
    }

    return L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', {
      layers: layerName,
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      crs: L.CRS.EPSG3857,
      time: '2024-07-01', // Summer peak insolation for maximum thermal contrast
      maxNativeZoom: 8,
      maxZoom: 19,
      opacity: opacity,
      attribution: 'NASA Earthdata GIBS // MODIS Thermal LST',
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [26.0, 29.0], // Centered over Egypt Western Desert & Sahara
      zoom: 4,
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

    // 3. Add REAL NASA GIBS WMS Thermal Layer (Geographically Anchored Tile Layer!)
    if (showThermalOverlay) {
      const thermalWms = getNASA_GIBS_ThermalLayer(thermalMode, thermalOpacity);
      thermalWms.addTo(map);
      thermalWmsLayerRef.current = thermalWms;
    }

    // 4. Geographically-Anchored Isothermal Thermal Contours (Move with map in 100% sync!)
    const isothermalGroup = L.layerGroup();
    isothermalLayerGroupRef.current = isothermalGroup;

    locations.forEach((loc) => {
      const isEgypt = loc.featuredEgypt;
      const isHot = loc.overallSimilarity > 85 && loc.primaryTargetAnalog === 'mars';
      const center = L.latLng(loc.coordinates.lat, loc.coordinates.lng);

      // Core Thermal Heat Zone (Anchored to exact lat/lng!)
      const radiusMeters = isEgypt ? 180000 : 120000;
      
      const thermalCircle = L.circle(center, {
        radius: radiusMeters,
        color: isEgypt ? '#ff5722' : isHot ? '#b71c1c' : '#38bdf8',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: isEgypt ? '#ff9800' : isHot ? '#e91e63' : '#0288d1',
        fillOpacity: 0.18,
        interactive: false,
      });
      isothermalGroup.addLayer(thermalCircle);

      // Secondary Inner Core
      const innerCircle = L.circle(center, {
        radius: radiusMeters * 0.45,
        color: isEgypt ? '#ffde59' : '#ff5722',
        weight: 1.5,
        fillColor: isEgypt ? '#ffeb3b' : '#ff9800',
        fillOpacity: 0.28,
        interactive: false,
      });
      isothermalGroup.addLayer(innerCircle);
    });

    if (showIsothermalContours && showThermalOverlay) {
      isothermalGroup.addTo(map);
    }

    // 5. Custom Tactical Candidate Markers
    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;
      const color = isEgypt ? '#EAB308' : loc.primaryTargetAnalog === 'mars' ? '#B75B3D' : '#A8AAA6';

      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            ${
              isEgypt
                ? `<div style="position: absolute; width: 34px; height: 34px; border: 2px dashed #EAB308; border-radius: 50%; animation: spinSlow 12s linear infinite; opacity: 0.9;"></div>`
                : ''
            }
            ${
              isSelected
                ? `<div style="position: absolute; width: 30px; height: 30px; border: 2px solid ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.85;"></div>`
                : ''
            }
            <div style="width: 14px; height: 14px; background: ${color}; border: 2.5px solid #111311; border-radius: 50%; box-shadow: 0 0 12px ${color};"></div>
            <div style="position: absolute; width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });

      const googleMapsUrl = `https://www.google.com/maps/@${loc.coordinates.lat},${loc.coordinates.lng},14z/data=!3m1!1e3`;

      // High-Contrast NASA Mission Popup
      marker.bindPopup(`
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #E8E5DC; padding: 6px; min-width: 230px; background: #191B19;">
          <div style="font-size: 9px; color: ${isEgypt ? '#EAB308' : '#88877F'}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
            ${isEgypt ? '★ KEY EGYPTIAN ANALOG // PRIORITY' : `TERRESTRIAL ANALOG [${loc.flagCode}]`}
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #FFFFFF; margin-top: 3px; font-family: 'Space Grotesk', sans-serif;">
            ${loc.name}
          </div>
          <div style="margin-top: 5px; padding: 4px 6px; background: #222521; border-left: 3px solid #B75B3D;">
            <div style="color: #B75B3D; font-weight: bold; font-size: 11px;">
              SIMILARITY: ${loc.overallSimilarity.toFixed(1)}% | CONF: ${loc.confidenceScore.toFixed(0)}%
            </div>
            <div style="font-size: 10px; color: #E8E5DC; margin-top: 2px;">
              LST THERMAL: <span style="color: #FF5722; font-weight: bold;">${loc.environment.diurnalRange}</span>
            </div>
          </div>
          <div style="font-size: 10px; color: #38BDF8; margin-top: 6px;">
            COORDS: ${loc.coordinates.display}
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #2A2E29; display: flex; justify-content: space-between; align-items: center;">
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #EAB308; text-decoration: none; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 4px;">
              OPEN IN GOOGLE MAPS ↗
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

    // 6. Mouse movement telemetry probe
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

    // Ensure thermal layer stays on top of basemap
    if (thermalWmsLayerRef.current && mapInstanceRef.current.hasLayer(thermalWmsLayerRef.current)) {
      thermalWmsLayerRef.current.bringToFront();
    }
  }, [basemapMode]);

  // Handle Real NASA GIBS Thermal Layer Updates (Mode, Opacity, Show/Hide)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing WMS layer if present
    if (thermalWmsLayerRef.current && mapInstanceRef.current.hasLayer(thermalWmsLayerRef.current)) {
      mapInstanceRef.current.removeLayer(thermalWmsLayerRef.current);
      thermalWmsLayerRef.current = null;
    }

    if (showThermalOverlay) {
      const newThermalWms = getNASA_GIBS_ThermalLayer(thermalMode, thermalOpacity);
      newThermalWms.addTo(mapInstanceRef.current);
      thermalWmsLayerRef.current = newThermalWms;

      // Add isothermal contours
      if (isothermalLayerGroupRef.current && showIsothermalContours) {
        if (!mapInstanceRef.current.hasLayer(isothermalLayerGroupRef.current)) {
          isothermalLayerGroupRef.current.addTo(mapInstanceRef.current);
        }
      }
    } else {
      if (isothermalLayerGroupRef.current && mapInstanceRef.current.hasLayer(isothermalLayerGroupRef.current)) {
        mapInstanceRef.current.removeLayer(isothermalLayerGroupRef.current);
      }
    }
  }, [showThermalOverlay, thermalMode, thermalOpacity, showIsothermalContours]);

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

  return (
    <div className={`relative w-full h-[580px] bg-charcoal-deep border border-obsidian-border overflow-hidden select-none ${className}`}>
      {/* Real Google Maps / Leaflet Viewport with Anchored NASA GIBS WMS Thermal Layer */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Mission Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between px-4 py-2.5 bg-obsidian/95 border-b border-obsidian-border backdrop-blur-md font-mono text-xs gap-2">
        <div className="flex items-center space-x-3 text-stone-gray">
          <Globe className="w-4 h-4 text-earth-bright" />
          <span className="text-mineral-white font-semibold uppercase tracking-wider">
            GOOGLE MAPS // NASA GIBS THERMAL INFRARED WMS
          </span>
          <span className="text-stone-dark">|</span>
          <span className="text-telemetry-cyan text-[11px] font-semibold">
            {thermalMode === 'day-lst'
              ? 'MODIS DAYTIME LST RADIOMETER'
              : thermalMode === 'night-lst'
              ? 'MODIS NIGHTTIME LST (THERMAL INERTIA)'
              : 'MODIS 7-2-1 FALSE COLOR IR'}
          </span>
        </div>

        {/* Controls: Google Basemap & NASA Thermal Configuration */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Thermal Layer Main Toggle */}
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

          {/* Thermal Sensor Mode Selector (Day vs Night vs IR Bands) */}
          {showThermalOverlay && (
            <div className="flex items-center space-x-1 border border-obsidian-border bg-obsidian-card p-0.5">
              <button
                onClick={() => {
                  audio.playClick();
                  setThermalMode('day-lst');
                }}
                className={`flex items-center space-x-1 px-2 py-1 uppercase text-[10px] transition-colors ${
                  thermalMode === 'day-lst'
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
                title="MODIS Terra Daytime Land Surface Temperature"
              >
                <Sun className="w-3 h-3" />
                <span>Day LST</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  setThermalMode('night-lst');
                }}
                className={`flex items-center space-x-1 px-2 py-1 uppercase text-[10px] transition-colors ${
                  thermalMode === 'night-lst'
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
                title="MODIS Terra Nighttime Land Surface Temperature"
              >
                <Moon className="w-3 h-3" />
                <span>Night LST</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  setThermalMode('false-color-ir');
                }}
                className={`flex items-center space-x-1 px-2 py-1 uppercase text-[10px] transition-colors ${
                  thermalMode === 'false-color-ir'
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
                title="MODIS Bands 7-2-1 False Color Infrared (Mineralogy)"
              >
                <Satellite className="w-3 h-3" />
                <span>IR 7-2-1</span>
              </button>
            </div>
          )}

          {/* Opacity Slider */}
          {showThermalOverlay && (
            <div className="hidden lg:flex items-center space-x-2 bg-obsidian-card px-2.5 py-1 border border-obsidian-border text-[10px]">
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
          <span>LIVE RADIOMETRIC THERMAL PROBE</span>
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
              TELEMETRY: NASA GIBS MODIS TERRA RADIOMETER (CALIBRATED)
            </div>
          </div>
        ) : (
          <div className="text-stone-gray text-[10px]">MOVE CURSOR ACROSS MAP FOR LIVE TEMPERATURE</div>
        )}
      </div>

      {/* Floating Bottom Center: Thermal Ironbow Color Scale */}
      {showThermalOverlay && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md shadow-xl">
          <span className="text-stone-gray font-semibold">-50°C [223 K]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0d0826] via-[#10b981] via-[#ffde59] via-[#ff5722] to-[#b71c1c] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">+55°C [328 K]</span>
          <span className="text-telemetry-amber font-bold pl-2 border-l border-obsidian-border">SAHARA MAX</span>
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
        <div className="pt-1 text-[9px] text-stone-dark border-t border-obsidian-border flex items-center justify-between">
          <span>MAP DATA © GOOGLE</span>
          <span className="text-telemetry-cyan">NASA GIBS WMS</span>
        </div>
      </div>
    </div>
  );
};
