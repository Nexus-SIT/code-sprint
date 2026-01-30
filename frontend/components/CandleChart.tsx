import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Cell, ReferenceLine } from 'recharts';
import { Candle } from '../types';

interface CandleChartProps {
  data: Candle[];
  activeIndex?: number;
  highlightIndices?: number[];
  height?: number;
}

const CustomCandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  
  const isUp = close >= open;
  const color = isUp ? '#4ade80' : '#ef4444'; 

  // Guard against invalid dimensions or flat candles
  if (!width || height <= 0 || high === low) {
    return <line x1={x} y1={y} x2={x + width} y2={y} stroke={color} strokeWidth={2} />;
  }

  // Calculate pixel ratio based on the bar's height (which represents high - low)
  const range = high - low;
  const ratio = height / range;

  // Calculate body dimensions
  const bodyTopValue = Math.max(open, close);
  const bodyBottomValue = Math.min(open, close);
  
  // Pixels from top of the bar (which is 'high')
  const bodyTopOffset = (high - bodyTopValue) * ratio;
  const bodyHeight = Math.max(2, (bodyTopValue - bodyBottomValue) * ratio);
  
  const bodyY = y + bodyTopOffset;
  const centerX = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line 
        x1={centerX} 
        y1={y} 
        x2={centerX} 
        y2={y + height} 
        stroke={color} 
        strokeWidth={1.5} 
      />
      {/* Body */}
      <rect 
        x={x} 
        y={bodyY} 
        width={width} 
        height={bodyHeight} 
        fill={color} 
        stroke={color} 
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { open, high, low, close } = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg text-xs font-mono">
          <p className="text-gray-400">Price Action</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-gray-200">
             <span>O: {open.toFixed(2)}</span>
             <span>H: {high.toFixed(2)}</span>
             <span>L: {low.toFixed(2)}</span>
             <span>C: {close.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

const CandleChart: React.FC<CandleChartProps> = ({ data, activeIndex, height = 400 }) => {
  if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-gray-500">No Data</div>;

  // Process data for Recharts Bar (Range)
  // We map [low, high] so the Bar component renders the full height of the candle
  const processedData = data.map(d => ({
    ...d,
    candleRange: [d.low, d.high]
  }));

  const minLow = Math.min(...data.map(d => d.low)) * 0.995;
  const maxHigh = Math.max(...data.map(d => d.high)) * 1.005;

  return (
    <div className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-700">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={processedData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[minLow, maxHigh]} 
            hide 
          />
          <Tooltip content={<CustomTooltip />} />
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
            <ReferenceLine x={activeIndex} stroke="white" strokeDasharray="3 3" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;