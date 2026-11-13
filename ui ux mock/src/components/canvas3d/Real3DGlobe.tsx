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
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e0c);

    // Centered Perspective Camera: Globe perfectly framed in viewport!
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting
    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(16, 8, 14);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x282c28, 0.65);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(-16, -6, -10);
    scene.add(rimLight);

    const textureLoader = new THREE.TextureLoader();

    // 3. Load REAL NASA High-Resolution Textures
    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;

    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    // REAL NASA GIBS Global MODIS Land Surface Temperature Thermal Map!
    const thermalMap = textureLoader.load('/textures/nasa_modis_thermal_global_2048.png');
    thermalMap.colorSpace = THREE.SRGBColorSpace;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 4. Earth Sphere: Scaled to fit perfectly inside the viewport without clipping!
    const radius = 4.4;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    
    // Choose between Real Satellite True Color vs Real NASA Thermal LST Map
    const earthMat = new THREE.MeshPhongMaterial({
      map: thermalMode ? thermalMap : earthMap,
      specularMap: thermalMode ? null : earthSpecular,
      specular: thermalMode ? new THREE.Color(0x000000) : new THREE.Color(0x223344),
      shininess: thermalMode ? 5 : 25,
      bumpScale: 0.04,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Realistic Cloud Sphere (Displayed in Satellite mode)
    let cloudsMesh: THREE.Mesh | null = null;
    if (!thermalMode) {
      const cloudsGeo = new THREE.SphereGeometry(radius * 1.018, 64, 64);
      const cloudsMat = new THREE.MeshStandardMaterial({
        map: earthCloudsMap,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
      globeGroup.add(cloudsMesh);
    }

    // Atmospheric Glow Rim Shell
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.035, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: thermalMode ? 0xff5722 : 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 5. Refined Precision Aerospace Tactical Markers (No giant blobs!)
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      // Standard geographic WGS84 to Three.js Cartesian coordinates
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const markerMeshes: THREE.Mesh[] = [];

    locations.forEach((loc) => {
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, radius * 1.008);
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;
      const color = isEgypt ? 0xeab308 : loc.primaryTargetAnalog === 'mars' ? 0xb75b3d : 0xa8aaa6;

      // Small elegant core marker dot (radius: 0.055)
      const dotGeo = new THREE.SphereGeometry(isSelected ? 0.08 : 0.055, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: color });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { location: loc };
      pinGroup.add(dotMesh);
      markerMeshes.push(dotMesh);

      // Fine needle indicator spike
      const normal = pos.clone().normalize();
      const spikeGeo = new THREE.CylinderGeometry(0.008, 0.015, isSelected ? 0.45 : 0.25, 8);
      spikeGeo.rotateX(Math.PI / 2);
      const spikeMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      spikeMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(isSelected ? 0.22 : 0.12)));
      spikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(spikeMesh);

      // Pulsating outer beacon halo ring for priority Egypt sites
      if (isEgypt || isSelected) {
        const ringGeo = new THREE.RingGeometry(0.09, 0.13, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.02)));
        ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        pinGroup.add(ringMesh);
      }
    });

    // 6. Interactive Mouse Orbit Controls
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(8.5, Math.min(22, camera.position.z + e.deltaY * 0.015));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.002;
        if (cloudsMesh) {
          cloudsMesh.rotation.y += 0.0007; // Natural cloud drift!
        }
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
      container.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      earthGeo.dispose();
      earthMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      earthMap.dispose();
      earthSpecular.dispose();
      earthCloudsMap.dispose();
      thermalMap.dispose();
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
            {thermalMode ? 'NASA GIBS MODIS THERMAL LST 3D GLOBE' : 'NASA VISIBLE EARTH 2K SATELLITE GLOBE'}
          </span>
        </div>
        <div className="text-stone-gray text-[10px]">
          DATA: {thermalMode ? 'TERRA/AQUA MODIS RADIOMETER [2048x1024px]' : 'NASA VISIBLE EARTH TRUE COLOR + SPECULAR'}
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md shadow-xl">
          <span className="text-stone-gray font-semibold">-50°C [223 K]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0d0826] via-[#10b981] via-[#ffde59] via-[#ff5722] to-[#b71c1c] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">+55°C [328 K]</span>
          <span className="text-telemetry-amber font-bold pl-2 border-l border-obsidian-border">SAHARA MAX</span>
        </div>
      )}

      {/* Bottom Right: Drag Instructions */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-stone-gray/70">
        DRAG TO ROTATE 3D GLOBE // SCROLL TO ZOOM // CLICK PIN TO SELECT
      </div>
    </div>
  );
};
