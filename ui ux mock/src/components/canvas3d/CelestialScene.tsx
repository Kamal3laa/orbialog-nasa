import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CelestialSceneProps {
  activePlanetId?: 'moon' | 'mars' | 'earth';
  onSelectPlanet?: (planet: 'moon' | 'mars' | 'earth') => void;
  className?: string;
  interactive?: boolean;
}

export const CelestialScene: React.FC<CelestialSceneProps> = ({
  activePlanetId = 'mars',
  onSelectPlanet,
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111311, 0.003);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Directional Sun + Ambient Deep Space Fill)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(15, 8, 12);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x232523, 0.6);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(-15, -5, -10);
    scene.add(rimLight);

    // 3. Procedural Starfield & Celestial Grid
    const starCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.5 + Math.random() * 0.5;
      starColors[i * 3] = 0.85 * brightness;
      starColors[i * 3 + 1] = 0.88 * brightness;
      starColors[i * 3 + 2] = 0.95 * brightness;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 4. Procedural Canvas Texture Generators (High Fidelity, Zero Network Dependencies)
    const createEarthTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Deep Ocean base
      ctx.fillStyle = '#0a1622';
      ctx.fillRect(0, 0, 1024, 512);

      // Continent shapes (Atmospheric green & arid browns)
      ctx.fillStyle = '#2d432b';
      // Africa & Europe
      ctx.beginPath();
      ctx.ellipse(540, 260, 90, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9b804e'; // Sahara arid belt
      ctx.beginPath();
      ctx.ellipse(530, 210, 70, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Americas
      ctx.fillStyle = '#2d432b';
      ctx.beginPath();
      ctx.ellipse(260, 200, 75, 100, 0.2, 0, Math.PI * 2);
      ctx.ellipse(320, 340, 60, 90, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Asia & Australia
      ctx.beginPath();
      ctx.ellipse(780, 190, 120, 80, 0, 0, Math.PI * 2);
      ctx.ellipse(820, 360, 50, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Polar ice caps
      ctx.fillStyle = '#e8f1f5';
      ctx.fillRect(0, 0, 1024, 30);
      ctx.fillRect(0, 480, 1024, 32);

      // Subtle atmospheric cloud swirls
      ctx.fillStyle = 'rgba(240, 245, 255, 0.22)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, 100 + Math.random() * 300, 30 + Math.random() * 60, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      return texture;
    };

    const createMoonTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Lunar highland base
      ctx.fillStyle = '#8f928e';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark basaltic maria (Mare Tranquillitatis, Serenitatis, Imbrium)
      ctx.fillStyle = '#444643';
      ctx.beginPath();
      ctx.ellipse(420, 220, 90, 70, 0.3, 0, Math.PI * 2);
      ctx.ellipse(560, 200, 70, 60, -0.2, 0, Math.PI * 2);
      ctx.ellipse(500, 300, 80, 65, 0, 0, Math.PI * 2);
      ctx.ellipse(300, 240, 60, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Craters & Ray Systems (Tycho, Copernicus)
      ctx.fillStyle = 'rgba(220, 225, 220, 0.35)';
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 12;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      return texture;
    };

    const createMarsTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Mars rust ochre surface
      ctx.fillStyle = '#ad5334';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark volcanic basalt regions (Syrtis Major, Acidalia Planitia)
      ctx.fillStyle = '#5c2d1d';
      ctx.beginPath();
      ctx.ellipse(450, 240, 110, 80, 0.4, 0, Math.PI * 2);
      ctx.ellipse(650, 270, 95, 75, -0.3, 0, Math.PI * 2);
      ctx.ellipse(250, 230, 80, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      // Valles Marineris canyon scar
      ctx.strokeStyle = '#38160c';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(320, 260);
      ctx.quadraticCurveTo(460, 275, 580, 265);
      ctx.stroke();

      // North & South CO2/Water Ice polar caps
      ctx.fillStyle = '#f2ede4';
      ctx.beginPath();
      ctx.ellipse(512, 18, 140, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(512, 496, 120, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      return texture;
    };

    // 5. Build Celestial Objects
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-6.5, 0.5, 2);
    scene.add(earthGroup);

    const earthGeo = new THREE.SphereGeometry(3.6, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.65,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = 'earth';
    earthGroup.add(earthMesh);

    // Earth atmospheric glow shell
    const atmosphereGeo = new THREE.SphereGeometry(3.72, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x4895ef,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Moon
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-1.2, 3.2, 7.5);
    scene.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: createMoonTexture(),
      roughness: 0.88,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.name = 'moon';
    moonGroup.add(moonMesh);

    // Mars
    const marsGroup = new THREE.Group();
    marsGroup.position.set(6.8, -0.6, 1);
    scene.add(marsGroup);

    const marsGeo = new THREE.SphereGeometry(2.9, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: createMarsTexture(),
      roughness: 0.78,
      metalness: 0.15,
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.name = 'mars';
    marsGroup.add(marsMesh);

    // Mars atmospheric thin haze
    const marsHazeGeo = new THREE.SphereGeometry(3.01, 48, 48);
    const marsHazeMat = new THREE.MeshBasicMaterial({
      color: 0xb75b3d,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const marsHazeMesh = new THREE.Mesh(marsHazeGeo, marsHazeMat);
    marsGroup.add(marsHazeMesh);

    // 6. Orbital Elliptical Guide Rings
    const createOrbitRing = (radiusX: number, radiusZ: number, color: number): THREE.Line => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineDashedMaterial({
        color: color,
        dashSize: 0.4,
        gapSize: 0.2,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geom, mat);
      line.computeLineDistances();
      return line;
    };

    const earthOrbit = createOrbitRing(12, 10, 0x64735d);
    earthOrbit.rotation.x = 0.25;
    scene.add(earthOrbit);

    const marsOrbit = createOrbitRing(16, 13, 0xb75b3d);
    marsOrbit.rotation.x = -0.15;
    marsOrbit.rotation.z = 0.1;
    scene.add(marsOrbit);

    // 7. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([earthMesh, moonMesh, marsMesh]);

      if (intersects.length > 0) {
        const target = intersects[0].object.name;
        container.style.cursor = 'pointer';
        setHoveredObject(target);
      } else {
        container.style.cursor = 'default';
        setHoveredObject(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([earthMesh, moonMesh, marsMesh]);

      if (intersects.length > 0) {
        const selected = intersects[0].object.name as 'moon' | 'mars' | 'earth';
        if (onSelectPlanet) {
          onSelectPlanet(selected);
        }
      }
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
    }

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow axial rotations
      earthMesh.rotation.y = elapsedTime * 0.05;
      moonMesh.rotation.y = elapsedTime * 0.02;
      marsMesh.rotation.y = elapsedTime * 0.04;

      // Subtle celestial floating oscillation
      earthGroup.position.y = 0.5 + Math.sin(elapsedTime * 0.4) * 0.15;
      moonGroup.position.y = 3.2 + Math.cos(elapsedTime * 0.5) * 0.12;
      marsGroup.position.y = -0.6 + Math.sin(elapsedTime * 0.35 + 1.2) * 0.18;

      // Camera target interpolation based on active selection
      let targetX = 0;
      let targetY = 2;
      let targetZ = 22;

      if (activePlanetId === 'earth') {
        targetX = -4;
        targetY = 1.2;
        targetZ = 16;
      } else if (activePlanetId === 'moon') {
        targetX = -0.8;
        targetY = 3.2;
        targetZ = 13;
      } else if (activePlanetId === 'mars') {
        targetX = 4.2;
        targetY = 0.2;
        targetZ = 16;
      }

      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (targetY - camera.position.y) * 0.03;
      camera.position.z += (targetZ - camera.position.z) * 0.03;
      camera.lookAt(targetX * 0.4, targetY * 0.3, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      marsGeo.dispose();
      marsMat.dispose();
    };
  }, [activePlanetId, onSelectPlanet, interactive]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Scientific Overlay Reticle and Target HUD */}
      {hoveredObject && (
        <div className="absolute top-6 left-6 pointer-events-none font-mono text-xs bg-obsidian/80 border border-stone-gray/30 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-warm-white">
            <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-pulse"></span>
            <span className="uppercase font-semibold tracking-wider">LOCKED TARGET: {hoveredObject}</span>
          </div>
          <p className="text-stone-gray text-[10px] mt-1">CLICK TO INITIALIZE ORBITAL PROFILE</p>
        </div>
      )}

      {/* Aerospace Coordinate Graticule Overlay */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-stone-gray/60 space-y-0.5 text-right">
        <div>ORBiALOG 3D KINEMATICS ENGINE v2.6</div>
        <div>EPHEMERIS: J2000.0 BARYCENTRIC VECTOR</div>
        <div>FOV: 45.0° | SOLAR IRRADIANCE: 1361 W/m²</div>
      </div>
    </div>
  );
};

