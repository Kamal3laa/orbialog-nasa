import React from 'react';

export interface RadarDataPoint {
  axis: string;
  targetValue: number; // 0 - 100
  analogValue: number; // 0 - 100
  description?: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  targetLabel?: string;
  analogLabel?: string;
  targetColor?: string;
  analogColor?: string;
  size?: number;
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  targetLabel = 'Planetary Target',
  analogLabel = 'Terrestrial Analog',
  targetColor = '#B75B3D', // Mars Rust default
  analogColor = '#64735D', // Muted Earth Green default
  size = 380,
  className = '',
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const numAxes = data.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Grid concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to convert polar to cartesian
  const getCoordinates = (value: number, index: number, maxRadius = radius) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build target polygon points
  const targetPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(d.targetValue, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Build analog polygon points
  const analogPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(d.analogValue, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Graticule Rings */}
        {rings.map((ratio, idx) => {
          const ringPoints = data
            .map((_, i) => {
              const { x, y } = getCoordinates(ratio * 100, i);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <g key={`ring-${idx}`}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#2A2E29"
                strokeWidth={idx === rings.length - 1 ? 1.5 : 1}
                strokeDasharray={idx < rings.length - 1 ? '3 3' : 'none'}
              />
              <text
                x={center + 4}
                y={center - ratio * radius - 3}
                fill="#88877F"
                fontSize="9"
                fontFamily="IBM Plex Mono, monospace"
                className="opacity-70"
              >
                {Math.round(ratio * 100)}%
              </text>
            </g>
          );
        })}

        {/* Radial Axis Spokes */}
        {data.map((item, i) => {
          const { x, y } = getCoordinates(100, i);
          const labelCoord = getCoordinates(116, i);
          const textAnchor =
            Math.abs(labelCoord.x - center) < 10
              ? 'middle'
              : labelCoord.x > center
              ? 'start'
              : 'end';

          return (
            <g key={`axis-${i}`}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#2A2E29"
                strokeWidth="1"
              />
              {/* Technical Tick mark */}
              <circle cx={x} cy={y} r="2" fill="#88877F" />
              {/* Axis Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y + 3}
                fill="#E8E5DC"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                textAnchor={textAnchor}
                className="font-medium tracking-tight"
              >
                {item.axis}
              </text>
            </g>
          );
        })}

        {/* Planetary Target Polygon */}
        <polygon
          points={targetPoints}
          fill={targetColor}
          fillOpacity="0.22"
          stroke={targetColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Target Points Dot Markers */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.targetValue, i);
          return (
            <circle
              key={`target-pt-${i}`}
              cx={x}
              cy={y}
              r="3.5"
              fill={targetColor}
              stroke="#111311"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Terrestrial Analog Polygon */}
        <polygon
          points={analogPoints}
          fill={analogColor}
          fillOpacity="0.28"
          stroke={analogColor}
          strokeWidth="2"
          strokeDasharray="4 2"
          strokeLinejoin="round"
        />

        {/* Analog Points Dot Markers */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.analogValue, i);
          return (
            <rect
              key={`analog-pt-${i}`}
              x={x - 3}
              y={y - 3}
              width="6"
              height="6"
              fill={analogColor}
              stroke="#111311"
              strokeWidth="1"
            />
          );
        })}

        {/* Center Reticle Point */}
        <circle cx={center} cy={center} r="2.5" fill="#88877F" />
      </svg>

      {/* Chart Legend & Telemetry Readout */}
      <div className="flex items-center space-x-6 mt-4 font-mono text-xs border border-obsidian-border bg-obsidian-card/80 px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: targetColor }}></span>
          <span className="text-mineral-white uppercase">{targetLabel}</span>
        </div>
        <div className="h-3 w-px bg-obsidian-border"></div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3" style={{ backgroundColor: analogColor }}></span>
          <span className="text-mineral-muted uppercase">{analogLabel}</span>
        </div>
      </div>
    </div>
  );
};

