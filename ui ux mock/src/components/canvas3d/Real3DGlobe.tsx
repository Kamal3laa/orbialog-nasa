import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnalogLocation } from '../../types';

interface Real3DGlobeProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  className?: string;
}

export const Real3DGlobe: React.FC<Real3DGlobeProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLoc, setHoveredLoc] = useState<AnalogLocation | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Realistic Solar Illumination & Ambient Space Light
    const sunLightDirection = new THREE.Vector3(14, 8, 12).normalize();
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = -0.6;
    globeGroup.rotation.x = 0.22;
    scene.add(globeGroup);

    // 3. Ultra High-Res NASA Earth Textures
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;

    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds_1024.png');

    // 4. Physical Earth Atmosphere Shader (Rayleigh Limb Glow + Day/Night Solar Terminator)
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uEarthMap;
      uniform sampler2D uSpecularMap;
      uniform vec3 uSunDirection;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 sunDir = normalize(uSunDirection);

        vec4 trueColor = texture2D(uEarthMap, vUv);
        float oceanMask = texture2D(uSpecularMap, vUv).r;

        // Day/Night Solar Terminator
        float NdotL = max(dot(normal, sunDir), 0.0);
        float diffuse = smoothstep(-0.15, 0.85, dot(normal, sunDir)) * 0.88 + 0.12;

        // Ocean Specular Glint
        vec3 halfVector = normalize(sunDir + viewDir);
        float specHighlight = pow(max(dot(normal, halfVector), 0.0), 36.0) * oceanMask * 0.5;

        // Surface Radiance
        vec3 surfaceColor = trueColor.rgb * diffuse + vec3(1.0, 0.98, 0.92) * specHighlight;

        // Authentic Atmospheric Rayleigh Scattering (Apollo Earth Limb Glow)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
        vec3 atmosphereLimb = vec3(0.22, 0.65, 1.0) * fresnel * 0.85;
        
        gl_FragColor = vec4(surfaceColor + atmosphereLimb, 1.0);
      }
    `;

    const radius = 4.45;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uEarthMap: { value: earthMap },
        uSpecularMap: { value: earthSpecular },
        uSunDirection: { value: sunLightDirection },
      },
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Realistic Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(radius * 1.016, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 5. Scientific Global Analog Coordinates Pins
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
      const isMars = loc.primaryTargetAnalog === 'mars';
      
      // Neutral global scientific palette
      const colorHex = isSelected ? 0x38bdf8 : isMars ? 0xf97316 : 0xe2e8f0;

      // Small elegant core marker dot
      const dotGeo = new THREE.SphereGeometry(isSelected ? 0.08 : 0.05, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { location: loc };
      pinGroup.add(dotMesh);
      markerMeshes.push(dotMesh);

      // Fine needle indicator spike
      const normal = pos.clone().normalize();
      const spikeGeo = new THREE.CylinderGeometry(0.005, 0.01, isSelected ? 0.38 : 0.2, 8);
      spikeGeo.rotateX(Math.PI / 2);
      const spikeMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 });
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      spikeMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(isSelected ? 0.19 : 0.1)));
      spikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(spikeMesh);

      // Selected ring beacon
      if (isSelected) {
        const ringGeo = new THREE.RingGeometry(0.08, 0.12, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
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

    // 7. Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        globeGroup.rotation.y += 0.0015;
        cloudsMesh.rotation.y += 0.0006;
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
      renderer.dispose();
    };
  }, [locations, selectedLocationId, onSelectLocation]);

  return (
    <div className={`relative w-full h-[580px] bg-space-void rounded-2xl border border-white/[0.08] select-none overflow-hidden shadow-2xl ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 font-inter text-xs bg-space-surface/80 border border-white/[0.10] px-4 py-2.5 rounded-xl backdrop-blur-xl shadow-glass flex items-center space-x-3">
        <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
        <span className="text-starlight-white font-medium">NASA 2K Orbital Earth Observation Globe</span>
      </div>

      {/* Hover Callout Dossier Card */}
      {hoveredLoc && (
        <div className="absolute bottom-14 left-6 font-inter text-xs bg-space-surface/90 border border-white/[0.15] p-4 rounded-xl backdrop-blur-2xl shadow-2xl space-y-2 max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-earth font-mono text-[10px] uppercase">[{hoveredLoc.flagCode}] {hoveredLoc.country}</span>
            <span className="text-[11px] font-semibold text-mars font-grotesk">{hoveredLoc.overallSimilarity.toFixed(1)}% Match</span>
          </div>
          <div className="text-starlight-white font-bold text-sm font-grotesk">{hoveredLoc.name}</div>
          <div className="text-starlight-subtle text-[11px] leading-relaxed">{hoveredLoc.geology.rockType}</div>
        </div>
      )}

      {/* Bottom Instructions */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-inter text-[11px] text-starlight-dim/70 bg-space-surface/60 px-3 py-1.5 rounded-lg backdrop-blur-md">
        Drag to rotate • Scroll to zoom • Click pin to inspect
      </div>
    </div>
  );
};