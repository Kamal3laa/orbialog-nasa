import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Real3DTopographyProps {
  locationName: string;
  isPlanetaryTarget?: boolean;
  terrainType?: string;
  elevationDatum?: string;
  thermalRange?: { min: number; max: number; unit: string };
  className?: string;
}

export const Real3DTopography: React.FC<Real3DTopographyProps> = ({
  locationName,
  isPlanetaryTarget = false,
  terrainType = 'Yardangs & Chalk Deflation',
  elevationDatum = '+172m MSL',
  thermalRange = { min: 4, max: 48, unit: '°C' },
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'satellite' | 'thermal' | 'hypsometry' | 'wireframe'>('thermal');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [cursorTelemetry, setCursorTelemetry] = useState<{ elevation: number; temp: number; slope: number } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111311);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(18, 25, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    fillLight.position.set(-18, 10, -14);
    scene.add(fillLight);

    // 3. Generate Realistic 3D Topographic Mesh
    const gridRes = 96;
    const planeSize = 22;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, gridRes, gridRes);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const isMars = locationName.toLowerCase().includes('mars') || locationName.toLowerCase().includes('jezero') || locationName.toLowerCase().includes('gale');
    const isMoon = locationName.toLowerCase().includes('luna') || locationName.toLowerCase().includes('shackleton') || locationName.toLowerCase().includes('tranquillitatis');
    const isQattara = locationName.toLowerCase().includes('qattara');
    const isSinai = locationName.toLowerCase().includes('sinai');

    // Mathematical procedural elevation model simulating real geomorphic landforms
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      let y = 0;

      if (isMoon || isMars) {
        // Impact Crater morphology with elevated rim, terraced walls, and central uplift / delta
        const craterRadius = 7.5;
        if (distFromCenter < craterRadius) {
          // Inside crater floor and central mound
          const floorDepth = -3.2;
          const centralMound = Math.exp(-Math.pow(distFromCenter / 1.8, 2)) * 2.2;
          y = floorDepth + centralMound + Math.sin(x * 1.5) * Math.cos(z * 1.5) * 0.25;
        } else if (distFromCenter >= craterRadius && distFromCenter < craterRadius + 2.5) {
          // Elevated rim crest
          const rimT = (distFromCenter - craterRadius) / 2.5;
          y = (1 - rimT) * 1.8 + Math.sin(x * 2) * 0.3;
        } else {
          // Exterior ejecta blanket hummocks
          y = Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.6 / (distFromCenter * 0.15);
        }
      } else if (isQattara) {
        // Sub-sea-level vast depression basin with sheer northern scarp
        const scarp = z > 2 ? (z - 2) * 0.8 : -2.5 + Math.sin(x * 0.6) * 0.3;
        y = scarp + Math.sin(x * 1.2) * 0.2;
      } else if (isSinai) {
        // Rugged fractured crystalline granite peaks & wadi gorges
        y = Math.sin(x * 0.7) * Math.cos(z * 0.7) * 3.2 + Math.cos(x * 1.5 + z) * 1.2 + Math.abs(x * 0.3);
      } else {
        // White Desert yardangs: streamlined aerodynamic linear ridges oriented along wind axis
        const windCorridor = Math.cos(x * 1.4) * 1.5;
        const yardangSpine = Math.exp(-Math.pow((z % 4) / 1.1, 2)) * 1.8;
        y = (windCorridor * 0.6 + yardangSpine) * (1 - distFromCenter / 15);
      }

      pos.setY(i, y);
    }

    geometry.computeVertexNormals();

    // 4. Create Texture Canvases for Satellite, Thermal, and Hypsometry modes
    const createTextures = () => {
      const texSize = 512;

      // 4a. Satellite True Color Texture
      const satCanvas = document.createElement('canvas');
      satCanvas.width = texSize;
      satCanvas.height = texSize;
      const satCtx = satCanvas.getContext('2d')!;
      
      if (isMars) {
        satCtx.fillStyle = '#9b4d32'; // Mars rust base
        satCtx.fillRect(0, 0, texSize, texSize);
        satCtx.fillStyle = '#5c2d1d';
        satCtx.beginPath();
        satCtx.arc(texSize / 2, texSize / 2, texSize * 0.32, 0, Math.PI * 2);
        satCtx.fill();
      } else if (isMoon) {
        satCtx.fillStyle = '#7a7c79'; // Lunar highland base
        satCtx.fillRect(0, 0, texSize, texSize);
        satCtx.fillStyle = '#424441';
        satCtx.beginPath();
        satCtx.arc(texSize / 2, texSize / 2, texSize * 0.3, 0, Math.PI * 2);
        satCtx.fill();
      } else {
        // Earth desert / rock
        satCtx.fillStyle = isSinai ? '#8a6d59' : '#e2dbcc';
        satCtx.fillRect(0, 0, texSize, texSize);
        // Yardangs / contours
        satCtx.fillStyle = '#c5baaa';
        for (let i = 0; i < 30; i++) {
          satCtx.fillRect(Math.random() * texSize, 0, 15 + Math.random() * 25, texSize);
        }
      }
      const satTex = new THREE.CanvasTexture(satCanvas);

      // 4b. Thermal Infrared (Ironbow / FLIR Heatmap) Texture
      const thermCanvas = document.createElement('canvas');
      thermCanvas.width = texSize;
      thermCanvas.height = texSize;
      const thermCtx = thermCanvas.getContext('2d')!;

      // Ironbow gradient: Dark purple (cold) -> Crimson -> Rust Orange -> Bright Yellow -> White (extreme heat)
      const grad = thermCtx.createRadialGradient(
        texSize * 0.5,
        texSize * 0.5,
        20,
        texSize * 0.5,
        texSize * 0.5,
        texSize * 0.6
      );
      grad.addColorStop(0, '#ffffff'); // Peak core heat
      grad.addColorStop(0.18, '#ffde59'); // Bright yellow
      grad.addColorStop(0.42, '#ff5722'); // Thermal orange
      grad.addColorStop(0.68, '#b71c1c'); // Deep red
      grad.addColorStop(0.88, '#4a148c'); // Deep thermal purple
      grad.addColorStop(1.0, '#0d0826'); // Cryogenic ambient background

      thermCtx.fillStyle = grad;
      thermCtx.fillRect(0, 0, texSize, texSize);

      // Isothermal contour lines on thermal texture
      thermCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      thermCtx.lineWidth = 1.5;
      for (let r = 50; r < texSize * 0.55; r += 45) {
        thermCtx.beginPath();
        thermCtx.arc(texSize * 0.5, texSize * 0.5, r, 0, Math.PI * 2);
        thermCtx.stroke();
      }
      const thermTex = new THREE.CanvasTexture(thermCanvas);

      // 4c. Elevation Hypsometry Texture
      const hypCanvas = document.createElement('canvas');
      hypCanvas.width = texSize;
      hypCanvas.height = texSize;
      const hypCtx = hypCanvas.getContext('2d')!;
      const hypGrad = hypCtx.createLinearGradient(0, 0, 0, texSize);
      hypGrad.addColorStop(0, '#10b981'); // Lowlands green
      hypGrad.addColorStop(0.35, '#eab308'); // Mid plateau yellow
      hypGrad.addColorStop(0.7, '#b75b3d'); // High mountain rust
      hypGrad.addColorStop(1.0, '#f8fafc'); // Peak snow/frost white
      hypCtx.fillStyle = hypGrad;
      hypCtx.fillRect(0, 0, texSize, texSize);
      const hypTex = new THREE.CanvasTexture(hypCanvas);

      return { satTex, thermTex, hypTex };
    };

    const { satTex, thermTex, hypTex } = createTextures();

    // 5. Build Material
    const material = new THREE.MeshStandardMaterial({
      map: viewMode === 'satellite' ? satTex : viewMode === 'thermal' ? thermTex : hypTex,
      wireframe: viewMode === 'wireframe',
      roughness: 0.72,
      metalness: 0.1,
      flatShading: false,
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    scene.add(terrainMesh);

    // 6. Grid Reference Base Floor
    const gridHelper = new THREE.GridHelper(planeSize * 1.15, 24, 0x2a2e29, 0x191b19);
    gridHelper.position.y = -3.8;
    scene.add(gridHelper);

    // 7. Interactive Mouse Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationSpeedX = 0;
    let rotationSpeedY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        terrainMesh.rotation.y += deltaX * 0.008;
        terrainMesh.rotation.x += deltaY * 0.008;
        terrainMesh.rotation.x = Math.max(-0.6, Math.min(0.6, terrainMesh.rotation.x));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Telemetry cursor probe calculation
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const dist = Math.sqrt(nx * nx + ny * ny);

      const computedElevation = Math.round(180 + (1 - dist) * 240);
      const computedTemp = Math.round(
        thermalRange.min + (1 - Math.min(dist, 1)) * (thermalRange.max - thermalRange.min)
      );
      const computedSlope = Math.round(Math.min(dist * 28 + 4, 38));

      setCursorTelemetry({
        elevation: computedElevation,
        temp: computedTemp,
        slope: computedSlope,
      });
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(12, Math.min(42, camera.position.z + e.deltaY * 0.02));
      camera.position.y = Math.max(8, Math.min(28, camera.position.y + e.deltaY * 0.012));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        terrainMesh.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize
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
      container.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      satTex.dispose();
      thermTex.dispose();
      hypTex.dispose();
      renderer.dispose();
    };
  }, [locationName, viewMode, autoRotate, thermalRange]);

  return (
    <div className={`relative w-full h-[400px] md:h-[460px] bg-charcoal-deep border border-obsidian-border select-none overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left HUD: 3D Telemetry Readout */}
      <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] bg-obsidian/90 border border-obsidian-border p-3 backdrop-blur-md space-y-1">
        <div className="flex items-center space-x-2 text-mineral-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-mars animate-pulse"></span>
          <span className="uppercase">{locationName} // 3D TOPOGRAPHIC MESH</span>
        </div>
        <div className="text-stone-gray text-[10px]">
          TERRAIN: {terrainType.toUpperCase()} | DATUM: {elevationDatum}
        </div>
        {cursorTelemetry && (
          <div className="pt-2 border-t border-obsidian-border flex items-center space-x-3 text-[10px]">
            <span className="text-telemetry-cyan font-bold">Z: {cursorTelemetry.elevation}m</span>
            <span className="text-stone-dark">|</span>
            <span className="text-mars font-bold">LST: {cursorTelemetry.temp}{thermalRange.unit}</span>
            <span className="text-stone-dark">|</span>
            <span className="text-earth-bright">SLOPE: {cursorTelemetry.slope}°</span>
          </div>
        )}
      </div>

      {/* Top Right Controls: Shader View Modes */}
      <div className="absolute top-4 right-4 flex items-center space-x-1 font-mono text-[11px] bg-obsidian/90 border border-obsidian-border p-1 backdrop-blur-md">
        {(
          [
            ['thermal', 'Thermal IR (LST)'],
            ['satellite', 'Photogrammetry'],
            ['hypsometry', 'Hypsometry'],
            ['wireframe', 'Wireframe'],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-2.5 py-1 uppercase transition-colors ${
              viewMode === mode
                ? 'bg-mars text-mineral-white font-bold shadow-sm'
                : 'text-stone-gray hover:text-mineral-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bottom Center: Thermal Ironbow Color Scale (When Thermal Mode is active) */}
      {viewMode === 'thermal' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 font-mono text-[10px] bg-obsidian/90 border border-obsidian-border px-4 py-2 backdrop-blur-md">
          <span className="text-stone-gray font-semibold">COLD [{thermalRange.min}{thermalRange.unit}]</span>
          <div className="w-36 h-2.5 rounded-sm bg-gradient-to-r from-[#0d0826] via-[#b71c1c] via-[#ff5722] via-[#ffde59] to-[#ffffff] border border-stone-gray/40"></div>
          <span className="text-mineral-white font-semibold">MAX LST [{thermalRange.max}{thermalRange.unit}]</span>
          <span className="text-telemetry-cyan pl-2 border-l border-obsidian-border">MODIS / ASTER TIR</span>
        </div>
      )}

      {/* Bottom Right: Orbit Controls Guide */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-stone-gray/70">
        DRAG TO ROTATE // SCROLL TO ZOOM
      </div>
    </div>
  );
};

