import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TargetPlanet } from '../../types';

interface PlanetaryCanvasProps {
  currentPlanet: TargetPlanet;
  onSelectPlanet: (planet: TargetPlanet) => void;
}

// Procedural high-resolution texture generator for Earth, Moon, and Mars
function createPlanetTexture(type: 'Earth' | 'Moon' | 'Mars'): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  if (type === 'Earth') {
    // Deep ocean base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0a1d37');
    oceanGrad.addColorStop(0.5, '#07162c');
    oceanGrad.addColorStop(1, '#0a1d37');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // Continental landmasses
    ctx.fillStyle = '#394b3c'; // Earth muted green
    // Eurasia / Africa
    ctx.beginPath();
    ctx.ellipse(width * 0.58, height * 0.42, width * 0.16, height * 0.22, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.fillStyle = '#64543b'; // Deserts / Saharan belt
    ctx.beginPath();
    ctx.ellipse(width * 0.54, height * 0.54, width * 0.09, height * 0.18, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Americas
    ctx.fillStyle = '#3f4c39';
    ctx.beginPath();
    ctx.ellipse(width * 0.26, height * 0.35, width * 0.08, height * 0.16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.30, height * 0.65, width * 0.07, height * 0.18, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#e5edf5';
    ctx.fillRect(0, 0, width, height * 0.08);
    ctx.fillRect(0, height * 0.92, width, height * 0.08);

    // Weather bands & continental noise
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 8 + 2;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(78, 100, 75, 0.4)' : 'rgba(164, 145, 115, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'Moon') {
    // Anorthositic Lunar Highlands (silvery-gray)
    ctx.fillStyle = '#7a7a78';
    ctx.fillRect(0, 0, width, height);

    // Basaltic Lunar Maria (Darker plains: Oceanus Procellarum, Mare Tranquillitatis)
    ctx.fillStyle = '#434341';
    ctx.beginPath();
    ctx.ellipse(width * 0.38, height * 0.45, width * 0.12, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.55, height * 0.42, width * 0.09, height * 0.11, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.48, height * 0.62, width * 0.07, height * 0.09, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Impact craters with high-albedo ejecta rays
    for (let i = 0; i < 220; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const radius = Math.random() * 14 + 1.5;

      // Crater floor
      ctx.fillStyle = '#363635';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Bright crater rim
      ctx.strokeStyle = '#c4c4c0';
      ctx.lineWidth = Math.max(1, radius * 0.2);
      ctx.stroke();

      // Ejecta rays on prominent craters
      if (radius > 10) {
        ctx.strokeStyle = 'rgba(215, 215, 210, 0.25)';
        ctx.lineWidth = 1;
        for (let ray = 0; ray < 8; ray++) {
          const angle = (ray * Math.PI) / 4 + Math.random() * 0.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * radius * 3.5, cy + Math.sin(angle) * radius * 3.5);
          ctx.stroke();
        }
      }
    }
  } else if (type === 'Mars') {
    // Oxidized iron-oxide Martian regolith (Mars rust base)
    const marsGrad = ctx.createLinearGradient(0, 0, 0, height);
    marsGrad.addColorStop(0, '#b75b3d');
    marsGrad.addColorStop(0.5, '#99482d');
    marsGrad.addColorStop(1, '#b75b3d');
    ctx.fillStyle = marsGrad;
    ctx.fillRect(0, 0, width, height);

    // Darker basaltic albedo features (Syrtis Major, Sinus Sabaeus)
    ctx.fillStyle = '#572b1d';
    ctx.beginPath();
    ctx.ellipse(width * 0.55, height * 0.48, width * 0.14, height * 0.18, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.32, height * 0.52, width * 0.08, height * 0.12, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Valles Marineris canyon rift system
    ctx.strokeStyle = '#3d1c12';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.56);
    ctx.lineTo(width * 0.45, height * 0.58);
    ctx.stroke();

    // North & South Polar Ice Caps (CO2 dry ice & water ice)
    ctx.fillStyle = '#edf2f7';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.05, width * 0.14, height * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.95, width * 0.1, height * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wind streaks and crater dunes
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 6 + 1.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(71, 33, 21, 0.35)' : 'rgba(217, 126, 95, 0.25)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural cloud layer for Earth
function createCloudTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * width;
    const y = height * 0.15 + Math.random() * (height * 0.7);
    const radiusX = Math.random() * 60 + 20;
    const radiusY = Math.random() * 20 + 8;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radiusX);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.6, 'rgba(240, 245, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

const PlanetMesh: React.FC<{
  type: TargetPlanet;
  isSelected: boolean;
}> = ({ type, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createPlanetTexture(type), [type]);
  const cloudTexture = useMemo(() => (type === 'Earth' ? createCloudTexture() : null), [type]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.11; // Clouds move slightly faster
    }
  });

  const getAtmosphereColor = () => {
    switch (type) {
      case 'Earth':
        return '#3b82f6';
      case 'Mars':
        return '#cf7153';
      case 'Moon':
      default:
        return '#88877f';
    }
  };

  return (
    <group>
      {/* Primary Planetary Sphere */}
      <mesh ref={meshRef} receiveShadow castShadow>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={type === 'Moon' ? 0.95 : type === 'Mars' ? 0.85 : 0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Earth Cloud Layer */}
      {type === 'Earth' && cloudTexture && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.23, 64, 64]} />
          <meshStandardMaterial
            map={cloudTexture}
            transparent={true}
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Atmospheric Rim Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.27, 48, 48]} />
        <meshBasicMaterial
          color={getAtmosphereColor()}
          transparent={true}
          opacity={type === 'Moon' ? 0.08 : 0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Coordinate Reticle Ring for Selected Planet */}
      {isSelected && (
        <group rotation={[Math.PI / 4, 0, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.RingGeometry(2.5, 2.52, 64)]} />
            <lineBasicMaterial color="#B75B3D" opacity={0.6} transparent />
          </lineSegments>
        </group>
      )}
    </group>
  );
};

export const PlanetaryCanvas: React.FC<PlanetaryCanvasProps> = ({
  currentPlanet,
  onSelectPlanet,
}) => {
  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[620px] select-none bg-obsidian border border-white/10">
      {/* Canvas Layer */}
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        {/* Directional Sun Light casting realistic terminator shadow */}
        <directionalLight position={[7, 3, 5]} intensity={2.6} castShadow />
        <directionalLight position={[-8, -4, -3]} intensity={0.08} />

        {/* Realistic Deep Space Field */}
        <Stars radius={120} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        <PlanetMesh type={currentPlanet} isSelected={true} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Canvas>

      {/* Aerospace UI Overlays inside the 3D Stage */}
      {/* Top Left Telemetry Readout */}
      <div className="absolute top-4 left-4 pointer-events-none font-mono-sci text-[11px] text-stone-gray space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-mars-rust rounded-full animate-ping"></span>
          <span className="text-mineral-white font-semibold">VIEWPORT: HIGH-RES 3D ORBITAL</span>
        </div>
        <div>RENDER: <span className="text-mineral-white">PBR / NORMAL TERMINATOR</span></div>
        <div>INTERACTION: <span className="text-mineral-white">DRAG TO ROTATE CELESTIAL BODY</span></div>
      </div>

      {/* Top Right Coordinate Crosshairs */}
      <div className="absolute top-4 right-4 pointer-events-none font-mono-sci text-[10px] text-stone-gray text-right hidden sm:block">
        <div>EPHEMERIS: <span className="text-mineral-white">IAU-2026.11</span></div>
        <div>SOLAR SUB-POINT: <span className="text-mineral-white">+14.2° N</span></div>
        <div>SUN ANGLE: <span className="text-mineral-white">43.8° INCIDENCE</span></div>
      </div>

      {/* Bottom Planet Switcher Buttons */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center items-center px-4">
        <div className="bg-charcoal/90 backdrop-blur-md p-1.5 border border-white/15 flex space-x-2">
          {(['Earth', 'Moon', 'Mars'] as TargetPlanet[]).map((planet) => {
            const active = currentPlanet === planet;
            return (
              <button
                key={planet}
                onClick={() => onSelectPlanet(planet)}
                className={`px-3 py-1.5 text-xs font-mono-sci transition-all flex items-center space-x-2 ${
                  active
                    ? 'bg-mars-rust text-white font-semibold shadow-technical'
                    : 'bg-white/5 text-stone-gray hover:text-mineral-white hover:bg-white/10'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    planet === 'Earth'
                      ? 'bg-emerald-400'
                      : planet === 'Moon'
                      ? 'bg-gray-300'
                      : 'bg-orange-500'
                  }`}
                ></span>
                <span>{planet.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reticle corner datum marks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-mars-rust pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-mars-rust pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-mars-rust pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-mars-rust pointer-events-none"></div>
    </div>
  );
};

