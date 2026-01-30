import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Cell, ReferenceLine } from 'recharts';
import { Candle } from '../types';

interface CandleChartProps {
  data: Candle[];
  activeIndex?: number;
  highlightIndices?: number[];
  height?: number | string;
}

const CustomCandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;

  const isUp = close >= open;
  const color = isUp ? '#2D6A4F' : '#A4243B'; // Success (Emerald) vs Failure (Brick Red)
  const strokeWidth = 2; // Thicker lines for pixel feel

  // Guard against invalid dimensions
  if (!width || height <= 0 || high === low) {
    return <line x1={x} y1={y} x2={x + width} y2={y} stroke={color} strokeWidth={strokeWidth} shapeRendering="crispEdges" />;
  }

  const range = high - low;
  const ratio = height / range;

  const bodyTopValue = Math.max(open, close);
  const bodyBottomValue = Math.min(open, close);

  const bodyTopOffset = (high - bodyTopValue) * ratio;
  const bodyHeight = Math.max(2, (bodyTopValue - bodyBottomValue) * ratio);

  const bodyY = y + bodyTopOffset;
  const centerX = x + width / 2;

  return (
    <g shapeRendering="crispEdges">
      {/* Wick */}
      <line
        x1={centerX}
        y1={y}
        x2={centerX}
        y2={y + height}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={0} // Fill handles color, stroke is optional but keeping 0 prevents blur
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { open, high, low, close } = payload[0].payload;
    return (
      <div className="bg-parchment border-2 border-wood-dark p-2 rounded-none shadow-pixel-sm text-xs font-pixel text-coffee z-50">
        <p className="text-wood font-bold mb-1 border-b border-wood-light/30 pb-1">Price Action</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span>O: {open.toFixed(0)}</span>
          <span>H: {high.toFixed(0)}</span>
          <span>L: {low.toFixed(0)}</span>
          <span>C: {close.toFixed(0)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CandleChart: React.FC<CandleChartProps> = ({ data, activeIndex, height = 400 }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-wood-light font-pixel">Waiting for Market Data...</div>;

  const processedData = data.map(d => ({
    ...d,
    candleRange: [d.low, d.high]
  }));

  const minLow = Math.min(...data.map(d => d.low)) * 0.99;
  const maxHigh = Math.max(...data.map(d => d.high)) * 1.01;

  return (
    <div className="w-full h-full overflow-hidden select-none">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="time"
            hide
          />
          <YAxis
            domain={[minLow, maxHigh]}
            hide
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#5C321F', strokeWidth: 1, strokeDasharray: '4 4' }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="candleRange"
            shape={<CustomCandleShape />}
            isAnimationActive={false}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
          {activeIndex !== undefined && (
            <ReferenceLine x={activeIndex} stroke="#5C321F" strokeDasharray="3 3" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;