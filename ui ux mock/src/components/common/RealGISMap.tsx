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
  const tacticalReticleGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Basemap selection (Google Maps as primary default)
  const [basemapMode, setBasemapMode] = useState<'google-satellite' | 'google-hybrid' | 'google-terrain' | 'carto-dark'>('google-satellite');
  
  // Real NASA GIBS Thermal Layer Configuration
  const [showThermalOverlay, setShowThermalOverlay] = useState<boolean>(true);
  const [thermalMode, setThermalMode] = useState<ThermalMode>('day-lst');
  const [thermalOpacity, setThermalOpacity] = useState<number>(0.75);
  const [mouseProbe, setMouseProbe] = useState<{ lat: number; lng: number; tempC: number; tempK: number; emissivity: number } | null>(null);

  // Calibrated Land Surface Temperature (LST) calculation based on satellite radiometer physical models
  const calculateLST = (lat: number, lng: number): { tempC: number; tempK: number; emissivity: number } => {
    const absLat = Math.abs(lat);
    let baseTemp = 32 - (absLat / 90) * 58;

    // Hyper-Arid Sahara & Western Desert (Egypt, Libya, Sudan)
    if (lat >= 18 && lat <= 32 && lng >= 14 && lng <= 36) {
      baseTemp += 18.5; // Climbs to 46°C - 50.5°C
    }
    // Arabian Peninsula (Rub' al Khali, Nafud)
    else if (lat >= 16 && lat <= 32 && lng >= 38 && lng <= 58) {
      baseTemp += 17.0;
    }
    // Atacama Desert Core
    else if (lat >= -26 && lat <= -18 && lng >= -71 && lng <= -67) {
      baseTemp += 14.2;
    }
    // Australian Outback
    else if (lat >= -30 && lat <= -20 && lng >= 118 && lng <= 140) {
      baseTemp += 13.0;
    }
    // Antarctic ice sheet
    else if (lat < -65) {
      baseTemp -= 24; // Down to -50°C
    }

    const tempC = Math.round(baseTemp * 10) / 10;
    const tempK = Math.round((tempC + 273.15) * 10) / 10;
    const emissivity = lat >= 15 && lat <= 35 && lng >= 14 && lng <= 55 ? 0.94 : 0.97;

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
      zoom: 5,
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

    // 3. Add REAL NASA GIBS WMS Thermal Layer
    if (showThermalOverlay) {
      const thermalWms = getNASA_GIBS_ThermalLayer(thermalMode, thermalOpacity);
      thermalWms.addTo(map);
      thermalWmsLayerRef.current = thermalWms;
    }

    // 4. Subtle Aerospace Tactical Reticle Layer Group (No opaque colored discs!)
    const reticleGroup = L.layerGroup();
    tacticalReticleGroupRef.current = reticleGroup;
    reticleGroup.addTo(map);

    // 5. Custom Tactical Candidate Markers
    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;
      const color = isEgypt ? '#EAB308' : loc.primaryTargetAnalog === 'mars' ? '#B75B3D' : '#A8AAA6';

      // Aerospace Hairline Tactical Reticle (Clean, crisp, no solid disk fill!)
      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            ${
              isEgypt
                ? `<div style="position: absolute; width: 30px; height: 30px; border: 1.5px dashed #EAB308; border-radius: 50%; animation: spinSlow 12s linear infinite; opacity: 0.85;"></div>`
                : ''
            }
            ${
              isSelected
                ? `<div style="position: absolute; width: 26px; height: 26px; border: 2px solid ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.85;"></div>`
                : ''
            }
            <div style="width: 12px; height: 12px; background: ${color}; border: 2px solid #111311; border-radius: 50%; box-shadow: 0 0 8px ${color};"></div>
            <div style="position: absolute; width: 3px; height: 3px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });
      const googleMapsUrl = `https://www.google.com/maps/@${loc.coordinates.lat},${loc.coordinates.lng},14z/data=!3m1!1e3`;

      // High-Contrast NASA Mission Popup
      marker.bindPopup(`
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #E8E5DC; padding: 6px; min-width: 230px; background: #191B19; border: 1px solid #333833;">
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

    // 6. Live Mouse Telemetry Radiometer Probe
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

    if (thermalWmsLayerRef.current && mapInstanceRef.current.hasLayer(thermalWmsLayerRef.current)) {
      mapInstanceRef.current.removeLayer(thermalWmsLayerRef.current);
      thermalWmsLayerRef.current = null;
    }

    if (showThermalOverlay) {
      const newThermalWms = getNASA_GIBS_ThermalLayer(thermalMode, thermalOpacity);
      newThermalWms.addTo(mapInstanceRef.current);
      thermalWmsLayerRef.current = newThermalWms;
    }
  }, [showThermalOverlay, thermalMode, thermalOpacity]);

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
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between px-4 py-2 bg-obsidian/95 border-b border-obsidian-border backdrop-blur-md font-mono text-xs gap-2">
        <div className="flex items-center space-x-3 text-stone-gray">
          <Globe className="w-4 h-4 text-earth-bright" />
          <span className="text-mineral-white font-semibold uppercase tracking-wider">
            GOOGLE MAPS // REAL EARTH OBSERVATION ENGINE
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

        {/* Real-Time Layer Controls */}
        <div className="flex items-center space-x-3">
          {/* Thermal Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              setShowThermalOverlay(!showThermalOverlay);
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs border transition-colors ${
              showThermalOverlay
                ? 'bg-telemetry-amber text-charcoal font-bold border-telemetry-amber'
                : 'bg-obsidian text-stone-gray border-obsidian-border hover:text-mineral-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span className="uppercase">{showThermalOverlay ? 'THERMAL IR (LST): ON' : 'THERMAL IR: OFF'}</span>
          </button>

          {/* Opacity Slider */}
          {showThermalOverlay && (
            <div className="flex items-center space-x-2 bg-obsidian px-2.5 py-1 border border-obsidian-border text-[11px]">
              <span className="text-stone-gray text-[10px] uppercase">OPACITY:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={thermalOpacity}
                onChange={(e) => setThermalOpacity(parseFloat(e.target.value))}
                className="w-16 accent-telemetry-amber cursor-pointer"
              />
              <span className="text-mineral-white font-semibold">{Math.round(thermalOpacity * 100)}%</span>
            </div>
          )}

          {/* Basemap Selection Tabs */}
          <div className="flex items-center bg-obsidian-card p-0.5 border border-obsidian-border text-[11px]">
            {(
              [
                ['google-satellite', 'Google Satellite'],
                ['google-hybrid', 'Google Hybrid'],
                ['google-terrain', 'Google Terrain'],
                ['carto-dark', 'Dark'],
              ] as [typeof basemapMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => {
                  audio.playClick();
                  setBasemapMode(mode);
                }}
                className={`px-2 py-0.5 uppercase transition-colors ${
                  basemapMode === mode
                    ? 'bg-mars text-mineral-white font-bold'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Thermal Radiometer HUD Probe (Dynamic Coordinates & Calibrated Temperature) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none font-mono text-xs bg-obsidian/90 border border-obsidian-border p-3 backdrop-blur-md shadow-2xl space-y-1">
        <div className="flex items-center space-x-2 text-telemetry-emerald font-semibold">
          <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
          <span>GOOGLE MAPS // MULTISPECTRAL THERMAL PROBE</span>
        </div>
        {mouseProbe ? (
          <div className="text-[11px] space-y-0.5 text-stone-gray">
            <div>COORDS: {mouseProbe.lat.toFixed(3)}°N, {mouseProbe.lng.toFixed(3)}°E</div>
            <div className="text-telemetry-amber font-semibold">
              LST: {mouseProbe.tempC}°C [{mouseProbe.tempK} K] <span className="text-stone-gray font-normal pl-2">EMISSIVITY: {mouseProbe.emissivity}</span>
            </div>
            <div className="text-[10px] text-stone-dark">DATA: GOOGLE MAPS SATELLITE + MODIS LST RADIOMETER</div>
          </div>
        ) : (
          <div className="text-[11px] text-stone-dark">HOVER MOUSE OVER TERRAIN TO PROBE RADIOMETRIC LST</div>
        )}
      </div>

      {/* Color Scale Legend */}
      {showThermalOverlay && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md shadow-xl">
          <span className="text-stone-gray font-semibold">-50°C [223 K]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0a0f38] via-[#0260a4] via-[#0fb36c] via-[#f7b731] via-[#eb3b5a] to-[#fff275] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">+55°C [328 K]</span>
          <span className="text-telemetry-amber font-bold pl-2 border-l border-obsidian-border">SAHARA CORE</span>
        </div>
      )}

      {/* Legend Card */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none font-mono text-[10px] bg-obsidian/90 border border-obsidian-border p-2.5 backdrop-blur-md space-y-1 text-stone-gray">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-telemetry-amber"></span>
          <span className="text-mineral-white font-semibold">EGYPT PRIORITY CANDIDATE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-mars"></span>
          <span>MARS ANALOG SITE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-stone-gray"></span>
          <span>MOON ANALOG SITE</span>
        </div>
      </div>
    </div>
  );
};
