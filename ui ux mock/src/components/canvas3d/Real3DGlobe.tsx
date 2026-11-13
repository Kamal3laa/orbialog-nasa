import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnalogLocation } from '../../types';

interface Real3DGlobeProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  thermalMode?: boolean;
  className?: string;
}

export const Real3DGlobe: React.FC<Real3DGlobeProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  thermalMode = false,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLoc, setHoveredLoc] = useState<AnalogLocation | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d100e);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(16, 12, 14);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x2d332d, 0.7);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-14, -8, -10);
    scene.add(rimLight);

    // 3. Create High-Fidelity Textures (Satellite vs Thermal LST Infrared)
    const createGlobeTexture = (isThermal: boolean): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      if (!isThermal) {
        // True Color Satellite Earth Base
        ctx.fillStyle = '#081420'; // Deep Ocean
        ctx.fillRect(0, 0, 2048, 1024);

        // Continents
        ctx.fillStyle = '#1e331c';
        // Eurasia & Africa
        ctx.beginPath();
        ctx.ellipse(1120, 520, 240, 280, 0, 0, Math.PI * 2);
        ctx.fill();
        // Sahara & Middle East arid belt (Egypt)
        ctx.fillStyle = '#a3844a';
        ctx.beginPath();
        ctx.ellipse(1100, 410, 190, 95, 0, 0, Math.PI * 2);
        ctx.fill();
        // Americas
        ctx.fillStyle = '#1e331c';
        ctx.beginPath();
        ctx.ellipse(540, 390, 170, 220, 0.2, 0, Math.PI * 2);
        ctx.ellipse(660, 710, 130, 200, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Australia
        ctx.fillStyle = '#946337';
        ctx.beginPath();
        ctx.ellipse(1680, 740, 110, 90, 0, 0, Math.PI * 2);
        ctx.fill();
        // Polar ice caps
        ctx.fillStyle = '#f0f5fa';
        ctx.fillRect(0, 0, 2048, 60);
        ctx.fillRect(0, 960, 2048, 64);
      } else {
        // Thermal Land Surface Temperature (Ironbow / MODIS False-Color)
        // Background Cold Oceans & Polar Zones: Dark Purple / Navy (#0d0826 to #1a0f4c)
        ctx.fillStyle = '#0f0a2e';
        ctx.fillRect(0, 0, 2048, 1024);

        // Moderate Temperate Landmasses: Red / Crimson (#b71c1c)
        ctx.fillStyle = '#8f1414';
        ctx.beginPath();
        ctx.ellipse(1120, 520, 260, 290, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sahara & Arabian Thermal Heat Belt (Intense Orange/Yellow Thermal Anomaly: 45°C - 52°C LST)
        const saharaGrad = ctx.createRadialGradient(1100, 410, 30, 1100, 410, 240);
        saharaGrad.addColorStop(0, '#ffffff'); // Extreme heat core (>50°C)
        saharaGrad.addColorStop(0.35, '#ffde59'); // Bright yellow
        saharaGrad.addColorStop(0.7, '#ff5722'); // Thermal orange
        saharaGrad.addColorStop(1.0, '#b71c1c'); // Red margin
        ctx.fillStyle = saharaGrad;
        ctx.beginPath();
        ctx.ellipse(1100, 410, 220, 110, 0, 0, Math.PI * 2);
        ctx.fill();

        // Atacama Desert Thermal Anomaly
        const atacamaGrad = ctx.createRadialGradient(640, 720, 10, 640, 720, 90);
        atacamaGrad.addColorStop(0, '#ffde59');
        atacamaGrad.addColorStop(0.6, '#ff5722');
        atacamaGrad.addColorStop(1.0, '#8f1414');
        ctx.fillStyle = atacamaGrad;
        ctx.beginPath();
        ctx.ellipse(640, 720, 75, 110, 0, 0, Math.PI * 2);
        ctx.fill();

        // Australian Outback Thermal Belt
        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        ctx.ellipse(1680, 740, 110, 85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Extreme Cold Polar Thermal Sinks (< -30°C): Pitch Navy / Black
        ctx.fillStyle = '#060414';
        ctx.fillRect(0, 0, 2048, 80);
        ctx.fillRect(0, 940, 2048, 84);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 4. Earth Sphere
    const radius = 6.0;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: createGlobeTexture(thermalMode),
      roughness: 0.68,
      metalness: 0.08,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Atmosphere Glow Shell
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.03, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: thermalMode ? 0xff5722 : 0x4895ef,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 5. Place 3D Location Markers & Beacon Pins
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const markerMeshes: THREE.Mesh[] = [];

    locations.forEach((loc) => {
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, radius * 1.015);
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;

      // Marker Dot
      const dotGeo = new THREE.SphereGeometry(isSelected ? 0.22 : 0.14, 16, 16);
      const dotColor = isEgypt ? 0xeab308 : loc.primaryTargetAnalog === 'mars' ? 0xb75b3d : 0xa8aaa6;
      const dotMat = new THREE.MeshBasicMaterial({ color: dotColor });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { location: loc };
      pinGroup.add(dotMesh);
      markerMeshes.push(dotMesh);

      // Radial Beacon Spike pointing outward
      const normal = pos.clone().normalize();
      const spikeGeo = new THREE.CylinderGeometry(0.02, 0.04, isSelected ? 0.9 : 0.5, 8);
      spikeGeo.rotateX(Math.PI / 2);
      const spikeMat = new THREE.MeshBasicMaterial({ color: dotColor, transparent: true, opacity: 0.85 });
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      spikeMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(isSelected ? 0.45 : 0.25)));
      spikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(spikeMesh);
    });

    // 6. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;
        globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredLoc(intersects[0].object.userData.location as AnalogLocation);
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredLoc(null);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        const loc = intersects[0].object.userData.location as AnalogLocation;
        onSelectLocation(loc);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      earthGeo.dispose();
      earthMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      renderer.dispose();
    };
  }, [locations, selectedLocationId, thermalMode, onSelectLocation]);

  return (
    <div className={`relative w-full h-[580px] bg-charcoal-deep border border-obsidian-border select-none overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Status */}
      <div className="absolute top-4 left-4 font-mono text-xs bg-obsidian/90 border border-obsidian-border p-3 backdrop-blur-md space-y-1">
        <div className="flex items-center space-x-2 text-mineral-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
          <span className="uppercase">
            {thermalMode ? 'MODIS LST THERMAL INFRARED 3D GLOBE' : 'TERRESTRIAL 3D SATELLITE GLOBE'}
          </span>
        </div>
        <div className="text-stone-gray text-[10px]">
          SENSOR: {thermalMode ? 'TERRA/AQUA MODIS L3 LAND SURFACE TEMP' : 'NASA BLUE MARBLE / WGS84 GRS80'}
        </div>
      </div>

      {/* Hover Callout HUD */}
      {hoveredLoc && (
        <div className="absolute bottom-16 left-6 font-mono text-xs bg-obsidian border border-mars p-3 backdrop-blur-md shadow-2xl space-y-1">
          <div className="text-mineral-white font-bold uppercase">{hoveredLoc.name}</div>
          <div className="text-stone-gray text-[11px]">{hoveredLoc.coordinates.display}</div>
          <div className="text-mars text-[11px] font-semibold">
            SIMILARITY: {hoveredLoc.overallSimilarity.toFixed(1)}% | TEMP: {hoveredLoc.environment.diurnalRange}
          </div>
        </div>
      )}

      {/* Bottom Center: Thermal Ironbow Scale */}
      {thermalMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md">
          <span className="text-stone-gray font-semibold">-50°C [223 K]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0d0826] via-[#8f1414] via-[#ff5722] via-[#ffde59] to-[#ffffff] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">+55°C [328 K]</span>
          <span className="text-telemetry-amber font-bold pl-2 border-l border-obsidian-border">SAHARA PEAK</span>
        </div>
      )}

      {/* Bottom Right: Drag Instructions */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-stone-gray/70">
        DRAG TO ROTATE 3D GLOBE // CLICK MARKER TO LOCK
      </div>
    </div>
  );
};

