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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, High-Fidelity Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3.0, 22.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Solar & Planetary Lighting
    const sunLight = new THREE.DirectionalLight(0xfffaec, 3.6);
    sunLight.position.set(24, 14, 18);
    scene.add(sunLight);

    const deepSpaceAmbient = new THREE.AmbientLight(0x0a1020, 0.55);
    scene.add(deepSpaceAmbient);

    // Distant stellar reflection / Earthshine fill
    const earthshine = new THREE.DirectionalLight(0x38bdf8, 0.35);
    earthshine.position.set(-20, -10, -12);
    scene.add(earthshine);

    // 3. High-Resolution NASA Planetary Textures
    const textureLoader = new THREE.TextureLoader();

    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;
    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    const moonMap = textureLoader.load('/textures/moon_1024.jpg');
    moonMap.colorSpace = THREE.SRGBColorSpace;

    const marsMap = textureLoader.load('/textures/mars_map_1k.jpg');
    marsMap.colorSpace = THREE.SRGBColorSpace;
    const marsBump = textureLoader.load('/textures/mars_bump_1k.jpg');

    // 4. Procedural Deep-Space Stellar Field (Multi-magnitude cosmic stars)
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 90 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.35 + Math.random() * 0.65;
      const isBlueStar = Math.random() > 0.8;
      starColors[i * 3] = isBlueStar ? 0.75 * brightness : 0.95 * brightness;
      starColors[i * 3 + 1] = isBlueStar ? 0.88 * brightness : 0.95 * brightness;
      starColors[i * 3 + 2] = 1.0 * brightness;
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

    // 5. EARTH GROUP: Photorealistic Blue Marble with Specular Glint & Dynamic Clouds
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-6.6, 0.2, 1.5);
    scene.add(earthGroup);

    const earthRadius = 3.65;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x224466),
      shininess: 30,
      bumpScale: 0.04,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = 'earth';
    earthGroup.add(earthMesh);

    // Dynamic Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.018, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // Subtle Rayleigh Atmospheric Scattering Glow
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.038, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 6. MOON GROUP: Cratered Highlands & Regolith (Artemis Target)
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-1.4, 3.6, 7.2);
    scene.add(moonGroup);

    const moonRadius = 1.25;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonMap,
      roughness: 0.95,
      metalness: 0.02,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.name = 'moon';
    moonGroup.add(moonMesh);

    // 7. MARS GROUP: Viking Surface, MOLA Elevation Relief, & Thin CO2 Haze
    const marsGroup = new THREE.Group();
    marsGroup.position.set(7.2, -0.6, 1.0);
    scene.add(marsGroup);

    const marsRadius = 2.95;
    const marsGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: marsMap,
      bumpMap: marsBump,
      bumpScale: 0.08,
      roughness: 0.85,
      metalness: 0.10,
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.name = 'mars';
    marsGroup.add(marsMesh);

    // Thin Mars Atmospheric Haze
    const marsHazeGeo = new THREE.SphereGeometry(marsRadius * 1.025, 48, 48);
    const marsHazeMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const marsHazeMesh = new THREE.Mesh(marsHazeGeo, marsHazeMat);
    marsGroup.add(marsHazeMesh);

    // 8. Elegant Astronomical Guide Orbits (Ultra-thin, non-intrusive)
    const createOrbitalCurve = (radiusX: number, radiusZ: number, color: number): THREE.Line => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.12,
      });
      return new THREE.Line(geom, mat);
    };

    const earthOrbit = createOrbitalCurve(14.5, 11.2, 0x38bdf8);
    earthOrbit.rotation.x = 0.25;
    scene.add(earthOrbit);

    const marsOrbit = createOrbitalCurve(18.2, 14.5, 0xf97316);
    marsOrbit.rotation.x = -0.18;
    marsOrbit.rotation.z = 0.10;
    scene.add(marsOrbit);

    // 9. Interactive Mouse Picking
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
        setHoveredObject(target === 'earth' ? 'Earth [Terrestrial Laboratory]' : target === 'moon' ? 'Moon [Artemis Frontier]' : 'Mars [Exploration Target]');
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

    // 10. Animation Loop: Smooth physical rotation and gentle orbital drift
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow, majestic planetary rotations
      earthMesh.rotation.y = elapsed * 0.025;
      cloudsMesh.rotation.y = elapsed * 0.032; // Clouds drift independently
      moonMesh.rotation.y = elapsed * 0.012;
      marsMesh.rotation.y = elapsed * 0.020;

      // Subtle celestial floating
      earthGroup.position.y = 0.2 + Math.sin(elapsed * 0.3) * 0.08;
      moonGroup.position.y = 3.6 + Math.cos(elapsed * 0.4) * 0.06;
      marsGroup.position.y = -0.6 + Math.sin(elapsed * 0.25 + 1.0) * 0.10;

      // Camera focal adjustment based on target
      let targetX = 0;
      let targetY = 1.5;
      let targetZ = 22.5;

      if (activePlanetId === 'earth') {
        targetX = -4.2;
        targetY = 0.6;
        targetZ = 16.0;
      } else if (activePlanetId === 'moon') {
        targetX = -0.8;
        targetY = 2.8;
        targetZ = 13.5;
      } else if (activePlanetId === 'mars') {
        targetX = 4.6;
        targetY = -0.2;
        targetZ = 16.0;
      }

      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (targetY - camera.position.y) * 0.03;
      camera.position.z += (targetZ - camera.position.z) * 0.03;
      camera.lookAt(targetX * 0.3, targetY * 0.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      marsGeo.dispose();
      marsMat.dispose();
      marsHazeGeo.dispose();
      marsHazeMat.dispose();
      earthMap.dispose();
      earthSpecular.dispose();
      earthCloudsMap.dispose();
      moonMap.dispose();
      marsMap.dispose();
      marsBump.dispose();
    };
  }, [activePlanetId, onSelectPlanet, interactive]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Target Identification HUD */}
      {hoveredObject && (
        <div className="absolute top-6 left-6 pointer-events-none font-inter text-xs bg-space-card/80 border border-white/[0.12] px-3.5 py-2 rounded-xl backdrop-blur-xl shadow-glass">
          <div className="flex items-center space-x-2 text-starlight-white font-medium">
            <span className="w-2 h-2 rounded-full bg-earth animate-pulse"></span>
            <span>{hoveredObject}</span>
          </div>
          <p className="text-[10px] text-starlight-subtle mt-0.5">Click to focus planetary research profile</p>
        </div>
      )}
    </div>
  );
};
