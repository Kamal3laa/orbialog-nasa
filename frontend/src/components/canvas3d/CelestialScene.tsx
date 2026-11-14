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
  const [webglAvailable, setWebglAvailable] = useState(true);
  const webglFailedRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || webglFailedRef.current) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c0a, 0.0025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 23);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      webglFailedRef.current = true;
      setWebglAvailable(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Realistic Cinematic Solar & Deep Space Lighting
    // Directional Sun lighting with realistic solar Kelvin color
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    sunLight.position.set(22, 12, 16);
    scene.add(sunLight);

    // Subtle galactic ambient fill
    const ambientLight = new THREE.AmbientLight(0x181a18, 0.5);
    scene.add(ambientLight);

    // Rim lighting representing distant stellar reflection / Earthshine
    const rimLight = new THREE.DirectionalLight(0x56a4ff, 0.4);
    rimLight.position.set(-20, -8, -12);
    scene.add(rimLight);

    // 3. High-Fidelity Photorealistic Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Earth Textures (NASA Visible Earth 2K Color, Specular, and Clouds)
    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;
    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    // Moon Texture (NASA LRO LOLA Cratered Surface Map)
    const moonMap = textureLoader.load('/textures/moon_1024.jpg');
    moonMap.colorSpace = THREE.SRGBColorSpace;

    // Mars Textures (Viking Orbiter Global Color & MOLA Bump Map)
    const marsMap = textureLoader.load('/textures/mars_map_1k.jpg');
    marsMap.colorSpace = THREE.SRGBColorSpace;
    const marsBump = textureLoader.load('/textures/mars_bump_1k.jpg');

    // 4. Procedural Deep-Space Starfield (Variable Magnitude Stars)
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 70 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.4 + Math.random() * 0.6;
      starColors[i * 3] = 0.9 * brightness;
      starColors[i * 3 + 1] = 0.92 * brightness;
      starColors[i * 3 + 2] = 1.0 * brightness;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 5. EARTH GROUP: Photorealistic Surface + Clouds + Atmospheric Rayleigh Glow
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-6.8, 0.4, 2);
    scene.add(earthGroup);

    // Earth Sphere with Specular Ocean Reflection
    const earthRadius = 3.6;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x223344),
      shininess: 25,
      bumpScale: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = 'earth';
    earthGroup.add(earthMesh);

    // Dynamic Earth Cloud Sphere Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.018, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // Atmospheric Rayleigh/Mie Scattering Outer Glow
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.045, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x3a88e9,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 6. MOON GROUP: Photorealistic Cratered Surface & Regolith Bump
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-1.2, 3.4, 7.5);
    scene.add(moonGroup);

    const moonRadius = 1.25;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonMap,
      roughness: 0.94,
      metalness: 0.02,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.name = 'moon';
    moonGroup.add(moonMesh);

    // 7. MARS GROUP: Photorealistic Viking Surface, MOLA Elevation Bump, & Atmospheric Haze
    const marsGroup = new THREE.Group();
    marsGroup.position.set(7.0, -0.5, 1.2);
    scene.add(marsGroup);

    const marsRadius = 2.95;
    const marsGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: marsMap,
      bumpMap: marsBump,
      bumpScale: 0.08,
      roughness: 0.82,
      metalness: 0.12,
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.name = 'mars';
    marsGroup.add(marsMesh);

    // Mars Thin CO2 Atmospheric Haze Shell
    const marsHazeGeo = new THREE.SphereGeometry(marsRadius * 1.025, 48, 48);
    const marsHazeMat = new THREE.MeshBasicMaterial({
      color: 0xc86432,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const marsHazeMesh = new THREE.Mesh(marsHazeGeo, marsHazeMat);
    marsGroup.add(marsHazeMesh);

    // 8. Orbital Elliptical Guide Rings
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
        dashSize: 0.5,
        gapSize: 0.3,
        transparent: true,
        opacity: 0.28,
      });
      const line = new THREE.Line(geom, mat);
      line.computeLineDistances();
      return line;
    };

    const earthOrbit = createOrbitRing(13, 10.5, 0x64735d);
    earthOrbit.rotation.x = 0.22;
    scene.add(earthOrbit);

    const marsOrbit = createOrbitRing(17, 13.5, 0xb75b3d);
    marsOrbit.rotation.x = -0.16;
    marsOrbit.rotation.z = 0.12;
    scene.add(marsOrbit);

    // 9. Raycasting for Interaction
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

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow realistic axial rotations
      earthMesh.rotation.y = elapsedTime * 0.035;
      cloudsMesh.rotation.y = elapsedTime * 0.045; // Clouds drift relative to surface!
      moonMesh.rotation.y = elapsedTime * 0.015;
      marsMesh.rotation.y = elapsedTime * 0.028;

      // Subtle celestial floating oscillation
      earthGroup.position.y = 0.4 + Math.sin(elapsedTime * 0.35) * 0.12;
      moonGroup.position.y = 3.4 + Math.cos(elapsedTime * 0.45) * 0.1;
      marsGroup.position.y = -0.5 + Math.sin(elapsedTime * 0.3 + 1.2) * 0.15;

      // Camera target interpolation based on active selection
      let targetX = 0;
      let targetY = 1.8;
      let targetZ = 22;

      if (activePlanetId === 'earth') {
        targetX = -4.5;
        targetY = 1.0;
        targetZ = 15;
      } else if (activePlanetId === 'moon') {
        targetX = -0.8;
        targetY = 3.2;
        targetZ = 12.5;
      } else if (activePlanetId === 'mars') {
        targetX = 4.5;
        targetY = 0.1;
        targetZ = 15;
      }

      camera.position.x += (targetX - camera.position.x) * 0.035;
      camera.position.y += (targetY - camera.position.y) * 0.035;
      camera.position.z += (targetZ - camera.position.z) * 0.035;
      camera.lookAt(targetX * 0.35, targetY * 0.25, 0);

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
      cancelAnimationFrame(animationFrameId);
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

      {!webglAvailable && (
        <div
          aria-label="Interactive orbital scene"
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(32, 49, 61, 0.42), transparent 58%), radial-gradient(ellipse at center, #10191f 0%, #080b0d 72%)',
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[78vw] w-[78vw] max-h-[90vh] max-w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-gray/20" />
          <div className="absolute left-1/2 top-1/2 h-[110vw] w-[110vw] max-h-[125vh] max-w-[125vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-gray/10" />
          {([
            { id: 'earth', label: 'Earth', position: 'left-[14%] top-[24%]', size: 'h-20 w-20 md:h-32 md:w-32', color: 'from-sky-300 via-blue-700 to-blue-950', glow: 'shadow-[0_0_38px_rgba(74,164,255,0.28)]' },
            { id: 'moon', label: 'Moon', position: 'left-[47%] top-[14%]', size: 'h-10 w-10 md:h-16 md:w-16', color: 'from-stone-200 via-stone-500 to-stone-900', glow: 'shadow-[0_0_24px_rgba(220,220,210,0.2)]' },
            { id: 'mars', label: 'Mars', position: 'right-[14%] bottom-[21%]', size: 'h-16 w-16 md:h-28 md:w-28', color: 'from-orange-300 via-red-700 to-red-950', glow: 'shadow-[0_0_38px_rgba(219,103,62,0.3)]' },
          ] as const).map(({ id, label, position, size, color, glow }) => (
            <button
              key={id}
              type="button"
              aria-label={`Select ${label}`}
              title={`Select ${label}`}
              onClick={() => onSelectPlanet?.(id)}
              className={`pointer-events-auto absolute ${position} ${size} rounded-full bg-gradient-to-br ${color} ${glow} transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-telemetry-cyan`}
            />
          ))}
        </div>
      )}

      {/* Scientific Overlay Reticle and Target HUD */}
      {hoveredObject && (
        <div className="absolute top-6 left-6 pointer-events-none font-mono text-xs bg-obsidian/90 border border-stone-gray/40 px-3 py-2 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-2 text-warm-white">
            <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-pulse"></span>
            <span className="uppercase font-semibold tracking-wider">LOCKED TARGET: {hoveredObject}</span>
          </div>
          <p className="text-stone-gray text-[10px] mt-1">CLICK CELESTIAL BODY TO INITIALIZE OPERATIONAL PROFILE</p>
        </div>
      )}

      {/* Aerospace Coordinate Graticule Overlay */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-stone-gray/60 space-y-0.5 text-right">
        <div>PHOTOREALISTIC NASA ORBITAL ENGINE v2.6</div>
        <div>VISIBLE EARTH 2K // LRO LOLA // MRO VIKING</div>
        <div>EPHEMERIS: J2026.4 BARYCENTRIC VECTOR</div>
      </div>
    </div>
  );
};
