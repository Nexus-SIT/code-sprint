
import React, { useMemo, useState } from 'react';
import { OHLCData } from '../types';

interface TradingChartProps {
  data: OHLCData[];
  onCandleClick: (index: number) => void;
  correctIndex?: number;
  showSuccess?: number | null;
  showError?: number | null;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  data, 
  onCandleClick, 
  correctIndex,
  showSuccess,
  showError
}) => {
  const width = 800;
  const height = 400;
  const padding = 40;

  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    const allPrices = data.flatMap(d => [d.high, d.low]);
    const min = Math.min(...allPrices) * 0.98;
    const max = Math.max(...allPrices) * 102;
    return { minPrice: min, maxPrice: max, priceRange: max - min };
  }, [data]);

  const candleWidth = (width - padding * 2) / data.length;

  const getX = (index: number) => padding + index * candleWidth + candleWidth / 2;
  const getY = (price: number) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);

  return (
    <div className="relative bg-[#161b22] rounded-xl border border-slate-700 p-4 overflow-hidden shadow-2xl group">
      <div className="absolute top-4 left-4 flex space-x-4 text-[10px] mono text-slate-500 uppercase tracking-widest z-10 bg-slate-900/50 px-2 py-1 rounded">
        <span>BTC/USD (Frozen Sim)</span>
        <span>1H</span>
        <span>Vol: {data.reduce((acc, d) => acc + d.volume, 0).toLocaleString()}</span>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="cursor-crosshair overflow-visible">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padding}
            y1={getY(minPrice + p * (maxPrice - minPrice))}
            x2={width - padding}
            y2={getY(minPrice + p * (maxPrice - minPrice))}
            stroke="#30363d"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Candles */}
        {data.map((d, i) => {
          const isBullish = d.close >= d.open;
          const x = getX(i);
          const yOpen = getY(d.open);
          const yClose = getY(d.close);
          const yHigh = getY(d.high);
          const yLow = getY(d.low);
          
          const bodyY = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
          const color = isBullish ? '#238636' : '#da3633';
          
          const isTargeted = i === showSuccess || i === showError;
          const statusColor = i === showSuccess ? '#10b981' : i === showError ? '#ef4444' : color;

          return (
            <g 
              key={i} 
              className="transition-all duration-200"
              onClick={() => onCandleClick(i)}
            >
              {/* Wick */}
              <line 
                x1={x} y1={yHigh} x2={x} y2={yLow} 
                stroke={statusColor} strokeWidth="1.5" 
              />
              {/* Body */}
              <rect
                x={x - candleWidth * 0.35}
                y={bodyY}
                width={candleWidth * 0.7}
                height={bodyHeight}
                fill={statusColor}
                className="hover:brightness-125 transition-all cursor-pointer"
                stroke={isTargeted ? '#fff' : 'none'}
                strokeWidth={isTargeted ? 2 : 0}
              />
              {/* Interaction zone */}
              <rect
                x={x - candleWidth * 0.5}
                y={padding}
                width={candleWidth}
                height={height - padding * 2}
                fill="transparent"
                className="hover:bg-slate-700/10 cursor-pointer"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Price Labels */}
      <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col justify-between py-10 text-[9px] mono text-slate-600 pr-2 pointer-events-none">
        <span>{maxPrice.toFixed(0)}</span>
        <span>{((maxPrice + minPrice) / 2).toFixed(0)}</span>
        <span>{minPrice.toFixed(0)}</span>
      </div>
    </div>
  );
};

export default TradingChart;
