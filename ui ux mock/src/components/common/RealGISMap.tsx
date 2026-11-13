import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AnalogLocation } from '../../types';
import { 
  Globe, 
  MapPin, 
  Compass, 
  Satellite, 
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { audio } from '../../utils/audio';

interface RealGISMapProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  activeOverlay?: 'standard' | 'thermal' | 'elevation' | 'aridity';
  className?: string;
}

export type GoogleBasemapMode = 'google-satellite' | 'google-hybrid' | 'google-terrain';

export const RealGISMap: React.FC<RealGISMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const tacticalReticleGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Basemap selection (Google Maps: Satellite, Hybrid, Terrain — No Dark)
  const [basemapMode, setBasemapMode] = useState<GoogleBasemapMode>('google-satellite');
  
  // Real-time Coordinate & Telemetry HUD Probe
  const [mouseProbe, setMouseProbe] = useState<{ lat: number; lng: number } | null>(null);

  // Google Maps Tile Providers
  const getGoogleTileLayer = (mode: GoogleBasemapMode): L.TileLayer => {
    switch (mode) {
      case 'google-satellite':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Satellite',
        });
      case 'google-hybrid':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Hybrid (Satellite + Roads/Labels)',
        });
      case 'google-terrain':
      default:
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Terrain (Topography + Relief)',
        });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map: True Global View Centered across Continents
    const map = L.map(mapContainerRef.current, {
      center: [20.0, 0.0],
      zoom: 2.2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // 2. Add Google Maps Basemap Tile Layer
    const tileLayer = getGoogleTileLayer(basemapMode);
    tileLayer.addTo(map);
    currentTileLayerRef.current = tileLayer;

    // 3. Subtle Aerospace Tactical Reticle Layer Group
    const reticleGroup = L.layerGroup();
    tacticalReticleGroupRef.current = reticleGroup;
    reticleGroup.addTo(map);

    // 4. Custom Tactical Candidate Markers
    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isMars = loc.primaryTargetAnalog === 'mars';
      const color = isSelected ? '#EAB308' : isMars ? '#B75B3D' : '#A8AAA6';

      // Aerospace Hairline Tactical Reticle
      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            ${
              isSelected
                ? `<div style="position: absolute; width: 28px; height: 28px; border: 2px solid ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.85;"></div>`
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
          <div style="font-size: 9px; color: ${color}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
            TERRESTRIAL ANALOG [${loc.flagCode} // ${loc.country.toUpperCase()}]
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #FFFFFF; margin-top: 3px; font-family: 'Space Grotesk', sans-serif;">
            ${loc.name}
          </div>
          <div style="margin-top: 5px; padding: 4px 6px; background: #222521; border-left: 3px solid ${color};">
            <div style="color: ${color}; font-weight: bold; font-size: 11px;">
              SIMILARITY: ${loc.overallSimilarity.toFixed(1)}% | CONF: ${loc.confidenceScore.toFixed(0)}%
            </div>
            <div style="font-size: 10px; color: #E8E5DC; margin-top: 2px;">
              CLIMATE: <span style="color: #EAB308; font-weight: bold;">${loc.climateType}</span>
            </div>
          </div>
          <div style="font-size: 10px; color: #38BDF8; margin-top: 6px;">
            COORDS: ${loc.coordinates.display} • ELEV: ${loc.elevationMeters}m MSL
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

    // 5. Live Mouse Coordinates Probe
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setMouseProbe({
        lat: Math.round(lat * 1000) / 1000,
        lng: Math.round(lng * 1000) / 1000,
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations, onSelectLocation]);

  // Handle Basemap Switcher without destroying the map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = getGoogleTileLayer(basemapMode);
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

  return (
    <div className={`relative w-full h-[580px] bg-charcoal-deep border border-obsidian-border overflow-hidden select-none ${className}`}>
      {/* Real Google Maps Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Mission Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between px-4 py-2 bg-obsidian/95 border-b border-obsidian-border backdrop-blur-md font-mono text-xs gap-2">
        <div className="flex items-center space-x-3 text-stone-gray">
          <Globe className="w-4 h-4 text-earth-bright" />
          <span className="text-mineral-white font-semibold uppercase tracking-wider">
            GOOGLE MAPS // GLOBAL EARTH OBSERVATION ENGINE
          </span>
          <span className="text-stone-dark">|</span>
          <span className="text-telemetry-cyan text-[11px] font-semibold uppercase">
            {basemapMode === 'google-satellite'
              ? 'GOOGLE SATELLITE IMAGERY'
              : basemapMode === 'google-hybrid'
              ? 'GOOGLE HYBRID (SATELLITE + VECTOR LABELS)'
              : 'GOOGLE TERRAIN RELIEF'}
          </span>
        </div>

        {/* Google Basemap Style Tabs (Satellite, Hybrid, Terrain — No Dark) */}
        <div className="flex items-center space-x-2">
          <span className="text-stone-dark text-[10px] uppercase">MAP STYLE:</span>
          <div className="flex items-center bg-obsidian-card p-0.5 border border-obsidian-border text-[11px]">
            {(
              [
                ['google-satellite', 'Google Satellite'],
                ['google-hybrid', 'Google Hybrid'],
                ['google-terrain', 'Google Terrain'],
              ] as [GoogleBasemapMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => {
                  audio.playClick();
                  setBasemapMode(mode);
                }}
                className={`px-2.5 py-1 uppercase text-xs transition-colors ${
                  basemapMode === mode
                    ? 'bg-mars text-mineral-white font-bold shadow-sm'
                    : 'text-stone-gray hover:text-mineral-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Left: Live Dynamic Coordinates Telemetry Probe */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none font-mono text-xs bg-obsidian/90 border border-obsidian-border p-3 backdrop-blur-md shadow-2xl space-y-1">
        <div className="flex items-center space-x-2 text-telemetry-emerald font-semibold">
          <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
          <span>GOOGLE MAPS // GEODETIC POSITION PROBE</span>
        </div>
        {mouseProbe ? (
          <div className="text-[11px] space-y-0.5 text-stone-gray">
            <div className="text-mineral-white font-semibold">
              LAT: {mouseProbe.lat.toFixed(4)}° | LNG: {mouseProbe.lng.toFixed(4)}°
            </div>
            <div className="text-[10px] text-stone-dark">DATUM: WGS84 // GOOGLE TILES HIGH-RES</div>
          </div>
        ) : (
          <div className="text-[11px] text-stone-dark">HOVER MOUSE OVER TERRAIN TO PROBE COORDINATES</div>
        )}
      </div>

      {/* Bottom Right: Global Analog Legend Card */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none font-mono text-[10px] bg-obsidian/90 border border-obsidian-border p-2.5 backdrop-blur-md space-y-1 text-stone-gray">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-mars"></span>
          <span className="text-mineral-white font-semibold">MARS ANALOG SITE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-stone-gray"></span>
          <span>MOON ANALOG SITE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-telemetry-amber"></span>
          <span className="text-telemetry-amber">SELECTED BENCHMARK</span>
        </div>
      </div>
    </div>
  );
};
