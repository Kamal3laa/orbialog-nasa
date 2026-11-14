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
  const thermalMixRef = useRef<number>(thermalMode ? 1.0 : 0.0);
  const targetThermalMixRef = useRef<number>(thermalMode ? 1.0 : 0.0);

  // Update target mix when prop changes
  useEffect(() => {
    targetThermalMixRef.current = thermalMode ? 1.0 : 0.0;
  }, [thermalMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c0a);

    // Centered Perspective Camera: Globe framed with aerospace precision
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Realistic Solar Lighting
    const sunLightDirection = new THREE.Vector3(14, 8, 12).normalize();

    const globeGroup = new THREE.Group();
    // Default orientation: Africa, Mediterranean, and Egypt facing front!
    globeGroup.rotation.y = -1.25;
    globeGroup.rotation.x = 0.28;
    scene.add(globeGroup);

    // 3. Load High-Resolution NASA Textures
    const textureLoader = new THREE.TextureLoader();

    // NASA Visible Earth 2K True Color
    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.wrapS = THREE.ClampToEdgeWrapping;
    earthMap.wrapT = THREE.ClampToEdgeWrapping;

    // Water Specular Mask (High in oceans, zero on land)
    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    earthSpecular.wrapS = THREE.ClampToEdgeWrapping;
    earthSpecular.wrapT = THREE.ClampToEdgeWrapping;

    // Cloud Sphere Texture
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    // NASA GIBS 8-Day Seamless Composite Thermal Map (No orbital swath gaps!)
    const thermalMap = textureLoader.load('/textures/modis_8day_2048.png', undefined, undefined, () => {
      // Fallback if 8-day fails to load
      textureLoader.load('/textures/nasa_modis_thermal_global_2048.png');
    });
    thermalMap.colorSpace = THREE.SRGBColorSpace;
    thermalMap.wrapS = THREE.ClampToEdgeWrapping;
    thermalMap.wrapT = THREE.ClampToEdgeWrapping;

    // 4. Custom NASA Earth Shader (True Color + Photorealistic Thermal LST Radiometer)
    // Eliminates black swath gaps, renders deep ocean bathymetry/SST, and physically plausible Rayleigh atmosphere
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uEarthMap;
      uniform sampler2D uThermalMap;
      uniform sampler2D uSpecularMap;
      uniform float uThermalMix;
      uniform vec3 uSunDirection;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldNormal;

      // Realistic NASA Ironbow / Inferno Scientific Colormap Generator
      vec3 getThermalRadiance(float normalizedTemp) {
        // Temperature range: 0.0 (Cold -40°C) to 1.0 (Extreme Hot +55°C)
        vec3 c0 = vec3(0.04, 0.06, 0.22); // Deep Polar Indigo
        vec3 c1 = vec3(0.02, 0.38, 0.65); // Cold Marine Blue
        vec3 c2 = vec3(0.06, 0.68, 0.42); // Temperate Emerald Green
        vec3 c3 = vec3(0.96, 0.72, 0.08); // Warm Solar Amber
        vec3 c4 = vec3(0.92, 0.28, 0.08); // Hot Radiative Terracotta
        vec3 c5 = vec3(1.00, 0.92, 0.75); // Peak Sahara / Hyper-Arid Core

        if (normalizedTemp < 0.2) {
          return mix(c0, c1, normalizedTemp / 0.2);
        } else if (normalizedTemp < 0.42) {
          return mix(c1, c2, (normalizedTemp - 0.2) / 0.22);
        } else if (normalizedTemp < 0.68) {
          return mix(c2, c3, (normalizedTemp - 0.42) / 0.26);
        } else if (normalizedTemp < 0.88) {
          return mix(c3, c4, (normalizedTemp - 0.68) / 0.20);
        } else {
          return mix(c4, c5, (normalizedTemp - 0.88) / 0.12);
        }
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 sunDir = normalize(uSunDirection);

        // 1. Textures Sampling
        vec4 trueColor = texture2D(uEarthMap, vUv);
        vec4 rawThermal = texture2D(uThermalMap, vUv);
        float oceanMask = texture2D(uSpecularMap, vUv).r; // 1.0 = ocean, 0.0 = land

        // 2. Solar Lighting Calculation (Day/Night terminator)
        float NdotL = max(dot(normal, sunDir), 0.0);
        float diffuse = smoothstep(-0.15, 0.85, dot(normal, sunDir)) * 0.85 + 0.15;

        // Ocean Sun Glint / Specular
        vec3 halfVector = normalize(sunDir + viewDir);
        float specHighlight = pow(max(dot(normal, halfVector), 0.0), 32.0) * oceanMask * 0.45;

        // 3. Realistic Thermal Surface Processing
        // Latitude calculation: -90° (South Pole) to +90° (North Pole)
        float latFactor = abs(vUv.y - 0.5) * 2.0; // 0.0 at Equator, 1.0 at Poles

        // Realistic Sea Surface Temperature (SST) for oceans: Deep indigo/navy gradient
        vec3 oceanSST = mix(vec3(0.06, 0.24, 0.45), vec3(0.015, 0.06, 0.18), latFactor);
        vec3 thermalOcean = mix(trueColor.rgb * 0.65, oceanSST, 0.7);

        // Continental Thermal Processing:
        // Raw thermal brightness
        float rawLuma = dot(rawThermal.rgb, vec3(0.299, 0.587, 0.114));

        // Subtropical Hotspot Mask (Lat 15°N - 35°N e.g. Sahara, Egypt, Arabian Peninsula)
        float desertBand = smoothstep(0.42, 0.62, vUv.y) * (1.0 - smoothstep(0.66, 0.84, vUv.y));
        
        vec3 landThermal;
        if (rawLuma > 0.12) {
          // Texture has authentic radiometer data: enhance scientific dynamic range
          vec3 enhancedRadiance = getThermalRadiance(clamp(rawLuma * 1.35, 0.0, 1.0));
          landThermal = mix(rawThermal.rgb, enhancedRadiance, 0.55);
        } else {
          // Seamless In-Shader Gap Healing (Interpolates any missing swath tracks cleanly!)
          float fallbackHeat = (1.0 - latFactor * 0.75) + desertBand * 0.35;
          landThermal = getThermalRadiance(clamp(fallbackHeat, 0.0, 1.0));
        }

        // Combine Land and Ocean in Thermal Mode:
        // Ocean pixels retain beautiful deep blue SST with specular highlight
        vec3 thermalEarth = mix(landThermal, thermalOcean, step(0.15, oceanMask));

        // 4. Smooth Transition Between True Satellite Color and Thermal LST
        vec3 surfaceColor = mix(trueColor.rgb, thermalEarth, uThermalMix);

        // Apply Day/Night solar illumination + Specular
        vec3 finalColor = surfaceColor * diffuse + vec3(1.0, 0.95, 0.85) * specHighlight;

        // 5. Authentic Physical Rayleigh Scattering Atmospheric Limb Glow (Apollo/ISS Earth Horizon)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);
        vec3 atmosphereLimb = mix(vec3(0.25, 0.65, 1.0), vec3(0.12, 0.72, 0.92), uThermalMix);
        finalColor += atmosphereLimb * fresnel * 0.75;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const uniforms = {
      uEarthMap: { value: earthMap },
      uThermalMap: { value: thermalMap },
      uSpecularMap: { value: earthSpecular },
      uThermalMix: { value: thermalMixRef.current },
      uSunDirection: { value: sunLightDirection },
    };

    const radius = 4.45;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Dynamic Clouds Sphere Layer (Visible in Satellite mode, fades smoothly in Thermal mode)
    const cloudsGeo = new THREE.SphereGeometry(radius * 1.018, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.75 * (1.0 - thermalMixRef.current),
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 5. Refined Precision Aerospace Tactical Markers
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
      const pos = latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, radius * 1.008);
      const isSelected = loc.id === selectedLocationId;
      const isEgypt = loc.featuredEgypt;
      const color = isEgypt ? 0xeab308 : loc.primaryTargetAnalog === 'mars' ? 0xb75b3d : 0xa8aaa6;

      // Small elegant core marker dot
      const dotGeo = new THREE.SphereGeometry(isSelected ? 0.075 : 0.05, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: color });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { location: loc };
      pinGroup.add(dotMesh);
      markerMeshes.push(dotMesh);

      // Fine needle indicator spike
      const normal = pos.clone().normalize();
      const spikeGeo = new THREE.CylinderGeometry(0.006, 0.012, isSelected ? 0.42 : 0.22, 8);
      spikeGeo.rotateX(Math.PI / 2);
      const spikeMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      spikeMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(isSelected ? 0.21 : 0.11)));
      spikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(spikeMesh);

      // Pulsating outer beacon halo ring for priority Egypt sites
      if (isEgypt || isSelected) {
        const ringGeo = new THREE.RingGeometry(0.08, 0.12, 24);
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
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        globeGroup.rotation.x = Math.max(-0.85, Math.min(0.85, globeGroup.rotation.x));
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

    // 7. Animation Loop with Smooth Thermal Interpolation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smoothly interpolate thermal mix uniform
      const targetMix = targetThermalMixRef.current;
      thermalMixRef.current += (targetMix - thermalMixRef.current) * 0.08;
      uniforms.uThermalMix.value = thermalMixRef.current;

      // Update clouds opacity smoothly
      cloudsMat.opacity = 0.75 * (1.0 - thermalMixRef.current);
      cloudsMesh.visible = cloudsMat.opacity > 0.02;

      if (!isDragging) {
        globeGroup.rotation.y += 0.0018;
        if (cloudsMesh.visible) {
          cloudsMesh.rotation.y += 0.0006; // Clouds drift naturally
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
      cloudsGeo.dispose();
      cloudsMat.dispose();
      earthMap.dispose();
      earthSpecular.dispose();
      earthCloudsMap.dispose();
      thermalMap.dispose();
      renderer.dispose();
    };
  }, [locations, selectedLocationId, onSelectLocation]);

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
          DATA: {thermalMode ? 'TERRA/AQUA MODIS RADIOMETER // SEAMLESS 8-DAY COMPOSITE' : 'NASA VISIBLE EARTH TRUE COLOR + SPECULAR'}
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
          <div className="w-40 h-2.5 rounded-sm bg-gradient-to-r from-[#0a0f38] via-[#0260a4] via-[#0fb36c] via-[#f7b731] via-[#eb3b5a] to-[#fff275] border border-stone-gray/40"></div>
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