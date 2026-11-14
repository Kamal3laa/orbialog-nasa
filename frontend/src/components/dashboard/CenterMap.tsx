import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Globe,
  MapPin,
  Satellite,
  Compass,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Activity,
  AlertTriangle,
  Route,
  Trash2,
  Snowflake,
  ShieldAlert,
} from 'lucide-react';
import { getGibsTileUrl } from '@/utils/gibsTileUrls';
import { fetchEsaSentinel2Scenes, fetchCsaRadarsat } from '@/utils/spaceAgencyApi';
import { withResilience, toastService } from '@/utils/resilientFetch';
import type { AnalogLocation } from '@/types';

export type EnvironmentMode = 'surface' | 'subsurface' | 'cryo';

export interface TraversePathData {
  waypoints: [{ lat: number; lng: number }, { lat: number; lng: number }];
  distanceKm: number;
}

export interface CenterMapProps {
  locations?: AnalogLocation[];
  selectedLocationId?: string | null;
  onSelectLocation?: (loc: AnalogLocation) => void;
  envMode?: EnvironmentMode;
  setEnvMode?: (mode: EnvironmentMode) => void;
  onPathDrawn?: (path: TraversePathData) => void;
  activeOverlay?: 'standard' | 'thermal' | 'elevation' | 'aridity';
  className?: string;
  onBboxChange?: (bbox: number[]) => void;
}

export type BasemapProvider = 'nasa-gibs-bluemarble' | 'nasa-gibs-modis' | 'google-satellite';

export const CenterMap: React.FC<CenterMapProps> = ({
  locations = [],
  selectedLocationId = null,
  onSelectLocation,
  envMode = 'surface',
  setEnvMode,
  onPathDrawn,
  className = '',
  onBboxChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const sentinelOverlayRef = useRef<L.ImageOverlay | L.LayerGroup | null>(null);
  const goldenCaseStudyLayerRef = useRef<L.GeoJSON | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Traverse Path Drawing Refs
  const pathLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const clickPointsRef = useRef<L.LatLng[]>([]);

  // Basemap & Overlay State
  const [basemap, setBasemap] = useState<BasemapProvider>('nasa-gibs-bluemarble');
  const [enableSentinelCog, setEnableSentinelCog] = useState<boolean>(false);
  const [sentinelLoading, setSentinelLoading] = useState<boolean>(false);
  const [activeGoldenStudy, setActiveGoldenStudy] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cursorCoordinates, setCursorCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Traverse Path Drawing State
  const [isDrawingPath, setIsDrawingPath] = useState<boolean>(false);
  const [drawnPathInfo, setDrawnPathInfo] = useState<{ distanceKm: number } | null>(null);

  // Subscribe to Resilience Toast Notifications
  useEffect(() => {
    let timer: any;
    const unsubscribe = toastService.subscribe((msg, durationMs = 4000) => {
      setToastMessage(msg);
      clearTimeout(timer);
      timer = setTimeout(() => setToastMessage(null), durationMs);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [27.38, 28.16], // Egypt White Desert default
      zoom: 3,
      minZoom: 2,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Set Default Base Map: NASA GIBS BlueMarble
    const gibsUrl = getGibsTileUrl('BlueMarble_ShadedRelief_Bathymetry', { useSubdomains: true });
    const initialBase = L.tileLayer(gibsUrl, {
      subdomains: ['a', 'b', 'c'],
      minZoom: 1,
      maxZoom: 8,
      attribution: 'Imagery © NASA EOSDIS GIBS / Blue Marble',
    }).addTo(map);
    baseTileLayerRef.current = initialBase;

    // Markers and Path Layer Groups
    markersGroupRef.current = L.layerGroup().addTo(map);
    pathLayerGroupRef.current = L.layerGroup().addTo(map);

    // Map probe on mousemove
    map.on('mousemove', (e) => {
      setCursorCoordinates({
        lat: parseFloat(e.latlng.lat.toFixed(4)),
        lng: parseFloat(e.latlng.lng.toFixed(4)),
      });
    });

    // Notify bounding box on moveend
    map.on('moveend', () => {
      const bounds = map.getBounds();
      const bbox = [
        parseFloat(bounds.getWest().toFixed(4)),
        parseFloat(bounds.getSouth().toFixed(4)),
        parseFloat(bounds.getEast().toFixed(4)),
        parseFloat(bounds.getNorth().toFixed(4)),
      ];
      onBboxChange?.(bbox);
    });

    // Prevent grey tile collapse bug by invalidating size
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Trigger invalidateSize whenever layout mounts or changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    }
  }, [envMode]);

  // 2. Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let newLayer: L.TileLayer;
    if (basemap === 'nasa-gibs-bluemarble') {
      const url = getGibsTileUrl('BlueMarble_ShadedRelief_Bathymetry', { useSubdomains: true });
      newLayer = L.tileLayer(url, {
        subdomains: ['a', 'b', 'c'],
        minZoom: 1,
        maxZoom: 8,
        attribution: 'Imagery © NASA GIBS / Blue Marble',
      });
    } else if (basemap === 'nasa-gibs-modis') {
      const url = getGibsTileUrl('MODIS_Terra_CorrectedReflectance_TrueColor', { useSubdomains: true });
      newLayer = L.tileLayer(url, {
        subdomains: ['a', 'b', 'c'],
        minZoom: 1,
        maxZoom: 9,
        attribution: 'Imagery © NASA Worldview / MODIS Terra',
      });
    } else {
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: 'Imagery © Google Satellite',
      });
    }

    newLayer.addTo(map);
    baseTileLayerRef.current = newLayer;
  }, [basemap]);

  // 3. Environment Modes Logic (Surface vs Subsurface/SAR vs Cryo)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (envMode === 'subsurface') {
      // Subsurface / SAR Mode: auto-trigger CSA RADARSAT lava tube study
      loadGoldenCaseStudy('Hawaii');
    } else if (envMode === 'surface') {
      // Clean optical mode
      setBasemap('nasa-gibs-bluemarble');
    }
  }, [envMode]);

  // 4. Render Analog Location Markers
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isMars = loc.primaryTargetAnalog === 'mars';
      const color = isSelected ? '#38bdf8' : isMars ? '#f97316' : '#94a3b8';

      const customIcon = L.divIcon({
        className: 'analog-tactical-pin',
        html: `
          <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border: 1.5px solid ${color}; border-radius: 50%; opacity: 0.8; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 8px ${color};"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });
      marker.on('click', () => onSelectLocation?.(loc));
      marker.bindTooltip(`
        <div style="background-color: #020617; color: #f8fafc; border: 1px solid #334155; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 11px;">
          <div style="font-weight: bold; color: ${color};">${loc.name}</div>
          <div style="color: #94a3b8;">${loc.region}, ${loc.country} | Match: ${loc.overallSimilarity}%</div>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.addTo(markersGroup);
    });
  }, [locations, selectedLocationId, onSelectLocation]);

  // 5. ESA Sentinel-2 COG Overlay with 3000ms Resilience
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!enableSentinelCog) {
      if (sentinelOverlayRef.current) {
        map.removeLayer(sentinelOverlayRef.current);
        sentinelOverlayRef.current = null;
      }
      return;
    }

    async function loadSentinelOverlay() {
      setSentinelLoading(true);
      const center = map.getCenter();

      try {
        const liveStacPromise = fetchEsaSentinel2Scenes({
          lat: center.lat,
          lng: center.lng,
          limit: 1,
        });

        const fallbackClosure = () => ({
          success: true,
          query: { bbox: [center.lng - 0.25, center.lat - 0.25, center.lng + 0.25, center.lat + 0.25], datetime: 'recent', maxCloudCover: 20, limit: 1 },
          totalFound: 1,
          provider: 'element84-earthsearch-fallback' as const,
          scenes: [
            {
              id: 'S2_SAMPLE_OVERLAY_COG',
              tileId: 'T35RPL',
              datetime: new Date().toISOString(),
              cloudCover: 1.5,
              bbox: [center.lng - 0.25, center.lat - 0.25, center.lng + 0.25, center.lat + 0.25],
              geometry: null,
              copernicusAssets: {},
              publicCogUrls: {
                thumbnail: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/35/R/PL/2026/11/S2B_35RPL_20261111_0_L2A/preview.jpg',
                tci: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/35/R/PL/2026/11/S2B_35RPL_20261111_0_L2A/TCI.tif',
              },
              ndviReady: true,
            },
          ],
          timestamp: new Date().toISOString(),
        });

        const { data } = await withResilience(
          liveStacPromise,
          fallbackClosure,
          3000,
          '⚡ Live API slow. Using Cached Demo Data for stability.'
        );

        if (data.scenes && data.scenes.length > 0) {
          const scene = data.scenes[0];
          const bbox = scene.bbox && scene.bbox.length === 4
            ? [[scene.bbox[1], scene.bbox[0]], [scene.bbox[3], scene.bbox[2]]]
            : [
                [center.lat - 0.2, center.lng - 0.2],
                [center.lat + 0.2, center.lng + 0.2],
              ];

          const imageUrl =
            scene.publicCogUrls?.thumbnail ||
            scene.copernicusAssets?.thumbnail ||
            'https://datahub.creodias.eu/odata/v1/Assets(preview)/$value';

          if (sentinelOverlayRef.current) {
            map.removeLayer(sentinelOverlayRef.current);
          }

          const overlay = L.imageOverlay(imageUrl, bbox as L.LatLngBoundsExpression, {
            opacity: 0.85,
            interactive: true,
          }).addTo(map);

          sentinelOverlayRef.current = overlay;
          map.fitBounds(bbox as L.LatLngBoundsExpression, { padding: [40, 40], maxZoom: 9 });
        }
      } catch {
        toastService.show('⚡ Live API slow. Using Cached Demo Data for stability.');
      } finally {
        setSentinelLoading(false);
      }
    }

    loadSentinelOverlay();
  }, [enableSentinelCog]);

  // 6. Golden Case Studies: Load from /api/csa-sar with GeoJSON Fallback
  const loadGoldenCaseStudy = async (siteName: string) => {
    setActiveGoldenStudy(siteName);
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      const liveCsaPromise = fetchCsaRadarsat({ query: siteName, rows: 2 });

      const fallbackLoader = async () => {
        const res = await fetch('/data/radarsat_sar.geojson');
        return {
          success: true,
          source: 'local-geojson-fallback' as const,
          portalUrl: 'https://donnees-data.asc-csa.gc.ca/',
          data: await res.json(),
          timestamp: new Date().toISOString(),
        };
      };

      const { data } = await withResilience(
        liveCsaPromise,
        fallbackLoader,
        3000,
        '⚡ Live API slow. Using Cached Demo Data for stability.'
      );

      const geojsonFeatures =
        data.data?.type === 'FeatureCollection' ? data.data : await (await fetch('/data/radarsat_sar.geojson')).json();

      let targetFeature = geojsonFeatures.features.find((f: any) =>
        f.properties?.analogContext?.toLowerCase().includes(siteName.toLowerCase()) ||
        f.id?.toLowerCase().includes(siteName.toLowerCase())
      );

      if (!targetFeature) {
        targetFeature = geojsonFeatures.features[0];
      }

      if (goldenCaseStudyLayerRef.current) {
        map.removeLayer(goldenCaseStudyLayerRef.current);
      }

      const geojsonLayer = L.geoJSON(targetFeature, {
        style: {
          color: '#38bdf8',
          weight: 3,
          dashArray: '6, 6',
          fillColor: '#0284c7',
          fillOpacity: 0.4,
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.analogContext || siteName;
          const confidence = feature.properties?.confidenceScore || 94;
          const popupContent = `
            <div style="background-color: #020617; color: #f8fafc; border: 1px solid #0284c7; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 11px;">
              <div style="color: #38bdf8; font-weight: bold; margin-bottom: 2px;">
                Analog: ${name}
              </div>
              <div style="color: #4ade80; font-weight: 600;">
                Similarity: ${confidence}% | Mode: Subsurface/Lava Tubes
              </div>
              <div style="color: #94a3b8; font-size: 10px; margin-top: 4px;">
                Sensor: CSA RADARSAT C-Band Quad-Pol
              </div>
            </div>
          `;
          layer.bindPopup(popupContent, { className: 'tactical-sar-popup' }).openPopup();
        },
      }).addTo(map);

      goldenCaseStudyLayerRef.current = geojsonLayer;
      map.fitBounds(geojsonLayer.getBounds(), { padding: [50, 50], maxZoom: 8 });
    } catch {
      toastService.show('⚡ Live API slow. Using Cached Demo Data for stability.');
    }
  };

  // 7. Interactive A-to-B Traverse Path Drawing Logic
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isDrawingPath) {
      map.getContainer().style.cursor = '';
      return;
    }

    map.getContainer().style.cursor = 'crosshair';
    clickPointsRef.current = [];

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const pathGroup = pathLayerGroupRef.current;
      if (!pathGroup) return;

      const clickPoints = clickPointsRef.current;
      clickPoints.push(e.latlng);

      if (clickPoints.length === 1) {
        // Point A Marker
        const markerA = L.circleMarker(e.latlng, {
          radius: 7,
          color: '#f59e0b',
          fillColor: '#f59e0b',
          fillOpacity: 0.9,
          weight: 2,
        }).bindTooltip(
          '<div style="background:#020617;color:#f59e0b;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:10px;">POINT A (START)</div>',
          { permanent: true, direction: 'top', offset: [0, -10] }
        );
        markerA.addTo(pathGroup);
      } else if (clickPoints.length === 2) {
        // Point B Marker
        const latLngA = clickPoints[0];
        const latLngB = clickPoints[1];

        const markerB = L.circleMarker(latLngB, {
          radius: 7,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.9,
          weight: 2,
        }).bindTooltip(
          '<div style="background:#020617;color:#10b981;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:10px;">POINT B (TARGET)</div>',
          { permanent: true, direction: 'top', offset: [0, -10] }
        );
        markerB.addTo(pathGroup);

        // Draw Polyline between Point A and Point B
        const polyline = L.polyline([latLngA, latLngB], {
          color: '#f59e0b',
          weight: 3,
          dashArray: '5, 5',
          opacity: 0.9,
        }).addTo(pathGroup);

        // Calculate Distance using Leaflet built-in
        const distKm = parseFloat((latLngA.distanceTo(latLngB) / 1000).toFixed(2));
        setDrawnPathInfo({ distanceKm: distKm });

        polyline.bindPopup(`
          <div style="background-color: #020617; color: #f8fafc; border: 1px solid #f59e0b; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 11px;">
            <div style="color: #f59e0b; font-weight: bold;">TRAVERSE PATH A → B</div>
            <div style="color: #cbd5e1;">Distance: <span style="color: #38bdf8;">${distKm} km</span></div>
            <div style="color: #94a3b8; font-size: 10px;">Est. Battery Drain: ~${(distKm * 1.5).toFixed(1)}%</div>
          </div>
        `).openPopup();

        // Dispatch to parent / RightSidebar
        onPathDrawn?.({
          waypoints: [
            { lat: latLngA.lat, lng: latLngA.lng },
            { lat: latLngB.lat, lng: latLngB.lng },
          ],
          distanceKm: distKm,
        });

        // Reset drawing mode
        setIsDrawingPath(false);
        map.getContainer().style.cursor = '';
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingPath, onPathDrawn]);

  // Clear Path Handler
  const handleClearPath = () => {
    if (pathLayerGroupRef.current) {
      pathLayerGroupRef.current.clearLayers();
    }
    clickPointsRef.current = [];
    setDrawnPathInfo(null);
    setIsDrawingPath(false);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[500px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 ${className}`}
    >
      {/* Floating Tactical Alert Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-slate-900/95 text-amber-300 text-xs font-mono font-semibold border border-amber-500/60 rounded-lg shadow-2xl flex items-center space-x-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP-CENTER HUD: 3 ENVIRONMENT MODES SWITCHER (SURFACE / SUBSURFACE / CRYO) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[900] flex items-center space-x-1 bg-slate-950/95 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-2xl">
        <button
          onClick={() => setEnvMode?.('surface')}
          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center space-x-1.5 transition-all ${
            envMode === 'surface'
              ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>Surface</span>
        </button>

        <button
          onClick={() => setEnvMode?.('subsurface')}
          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center space-x-1.5 transition-all ${
            envMode === 'subsurface'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Subsurface/SAR</span>
        </button>

        <button
          onClick={() => setEnvMode?.('cryo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center space-x-1.5 transition-all ${
            envMode === 'cryo'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cryo / Polar</span>
        </button>
      </div>

      {/* TOP-LEFT & TOP-RIGHT HUD: Basemap Switcher & ESA Sentinel-2 COG Toggle */}
      <div className="absolute top-3 left-3 z-[890] flex items-center space-x-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-xl">
        <button
          onClick={() => setBasemap('nasa-gibs-bluemarble')}
          className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center space-x-1.5 transition-all ${
            basemap === 'nasa-gibs-bluemarble'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>BlueMarble</span>
        </button>
        <button
          onClick={() => setBasemap('nasa-gibs-modis')}
          className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center space-x-1.5 transition-all ${
            basemap === 'nasa-gibs-modis'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Satellite className="w-3.5 h-3.5 text-amber-400" />
          <span>MODIS</span>
        </button>
      </div>

      <div className="absolute top-3 right-3 z-[890] flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 shadow-xl">
        <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-200 select-none">
          <input
            type="checkbox"
            checked={enableSentinelCog}
            onChange={(e) => setEnableSentinelCog(e.target.checked)}
            className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
          />
          <span className="flex items-center space-x-1 text-slate-300">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>ESA Sentinel-2 COG</span>
          </span>
        </label>
        {sentinelLoading && <span className="font-mono text-[10px] text-sky-400 animate-pulse">Streaming...</span>}
      </div>

      {/* BOTTOM-LEFT: Quick Golden Case Studies Bar */}
      <div className="absolute bottom-3 left-3 z-[900] flex flex-wrap items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-2xl">
        <span className="font-mono text-[10px] uppercase text-amber-400 font-bold px-1.5 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Lava Tubes / SAR:</span>
        </span>
        <button
          onClick={() => loadGoldenCaseStudy('White Desert')}
          className={`px-2 py-1 text-[11px] font-mono rounded border transition-all ${
            activeGoldenStudy === 'White Desert'
              ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          White Desert
        </button>
        <button
          onClick={() => loadGoldenCaseStudy('Clearwater')}
          className={`px-2 py-1 text-[11px] font-mono rounded border transition-all ${
            activeGoldenStudy === 'Clearwater'
              ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          Clearwater Crater
        </button>
        <button
          onClick={() => loadGoldenCaseStudy('Hawaii')}
          className={`px-2 py-1 text-[11px] font-mono rounded border transition-all ${
            activeGoldenStudy === 'Hawaii'
              ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          Mauna Loa Tubes
        </button>
      </div>

      {/* BOTTOM-RIGHT: A-to-B Traverse Path Drawing Controls & Coordinate HUD */}
      <div className="absolute bottom-3 right-3 z-[900] flex items-center space-x-2 bg-slate-950/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-2xl font-mono text-xs">
        {!isDrawingPath ? (
          <button
            onClick={() => setIsDrawingPath(true)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded font-semibold flex items-center space-x-1.5 transition-all shadow-lg active:scale-95"
          >
            <Route className="w-3.5 h-3.5 text-amber-400" />
            <span>Draw Traverse Path A → B</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 px-2 py-1 bg-amber-950/60 border border-amber-500/60 rounded text-amber-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Click Point A then Point B on Map...</span>
            <button
              onClick={() => setIsDrawingPath(false)}
              className="text-[10px] text-slate-400 hover:text-white underline ml-1"
            >
              Cancel
            </button>
          </div>
        )}

        {drawnPathInfo && (
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-2">
            <span className="text-slate-400 text-[11px]">
              Dist: <span className="text-sky-300 font-bold">{drawnPathInfo.distanceKm} km</span>
            </span>
            <button
              onClick={handleClearPath}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors"
              title="Clear drawn path"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {cursorCoordinates && (
          <div className="hidden sm:block border-l border-slate-800 pl-2 text-[10px] text-slate-400 select-none">
            {cursorCoordinates.lat}°, {cursorCoordinates.lng}°
          </div>
        )}
      </div>

      {/* Map Viewport Container (with Cryo Blue Tone CSS Filter if in Cryo Mode) */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[500px] z-0 transition-all duration-700"
        style={
          envMode === 'cryo'
            ? { filter: 'hue-rotate(185deg) saturate(1.4) contrast(1.08)' }
            : {}
        }
      />
    </div>
  );
};

export { CenterMap as RealGISMap };
