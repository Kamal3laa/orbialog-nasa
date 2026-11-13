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
  targetColor = '#F97316', // Mars Ember
  analogColor = '#38BDF8', // Earth Cyan
  size = 380,
  className = '',
}) => {
  const center = size / 2;
  const radius = size * 0.36;
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
        <defs>
          <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={targetColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={targetColor} stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="analogGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={analogColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={analogColor} stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Concentric Polygonal Grid Rings */}
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
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={idx === rings.length - 1 ? 1.5 : 1}
                strokeDasharray={idx < rings.length - 1 ? '4 4' : 'none'}
              />
              <text
                x={center + 4}
                y={center - ratio * radius - 4}
                fill="#64748B"
                fontSize="10"
                fontFamily="Inter, sans-serif"
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
          const labelCoord = getCoordinates(118, i);
          const textAnchor =
            Math.abs(labelCoord.x - center) < 15
              ? 'middle'
              : labelCoord.x > center
              ? 'start'
              : 'end';

          return (
            <g key={`spoke-${i}`}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.10)"
                strokeWidth="1"
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor={textAnchor}
                fill="#E2E8F0"
                fontSize="11"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {item.axis}
              </text>
            </g>
          );
        })}

        {/* Target Polygon (Mars/Moon) */}
        <polygon
          points={targetPoints}
          fill="url(#targetGlow)"
          stroke={targetColor}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Analog Polygon (Earth Candidate) */}
        <polygon
          points={analogPoints}
          fill="url(#analogGlow)"
          stroke={analogColor}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Target Vertex Nodes */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.targetValue, i);
          return (
            <circle
              key={`target-node-${i}`}
              cx={x}
              cy={y}
              r={3.5}
              fill={targetColor}
              stroke="#030712"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Analog Vertex Nodes */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.analogValue, i);
          return (
            <circle
              key={`analog-node-${i}`}
              cx={x}
              cy={y}
              r={3.5}
              fill={analogColor}
              stroke="#030712"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Radar Chart Legend */}
      <div className="flex items-center space-x-6 mt-6 font-inter text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: targetColor }}></span>
          <span className="text-starlight-white font-medium">{targetLabel}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: analogColor }}></span>
          <span className="text-starlight-white font-medium">{analogLabel}</span>
        </div>
      </div>
    </div>
  );
};
