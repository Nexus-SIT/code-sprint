
import React, { useMemo, useState, useEffect } from 'react';
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
  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isPlaying, setIsPlaying] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  
  const width = 800;
  const height = 400;
  const padding = 40;

  const visibleData = data.slice(0, visibleCount);

  useEffect(() => {
    let interval: any;
    if (isPlaying && visibleCount < data.length) {
      interval = setInterval(() => {
        setVisibleCount(prev => prev + 1);
        setLivePrice(data[visibleCount].close);
      }, 300); // Faster, more realistic speed
    } else {
      setIsPlaying(false);
      setLivePrice(null);
    }
    return () => clearInterval(interval);
  }, [isPlaying, visibleCount, data]);

  const { minPrice, maxPrice } = useMemo(() => {
    const allPrices = visibleData.flatMap(d => [d.high, d.low]);
    if (allPrices.length === 0) return { minPrice: 0, maxPrice: 100 };
    const min = Math.min(...allPrices) * 0.98;
    const max = Math.max(...allPrices) * 1.02;
    return { minPrice: min, maxPrice: max };
  }, [visibleData]);

  const candleWidth = (width - padding * 2) / (data.length || 1);

  const getX = (index: number) => padding + index * candleWidth + candleWidth / 2;
  const getY = (price: number) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);

  return (
    <div className="relative bg-[#0d1117] rounded-3xl border border-slate-800 p-6 overflow-hidden shadow-2xl group flex flex-col gap-4">
      {/* Simulation Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4 items-center">
           <button 
             onClick={() => { setVisibleCount(Math.max(1, Math.floor(data.length * 0.2))); setIsPlaying(true); }}
             className="bg-lime-500 hover:bg-lime-400 text-slate-900 px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all flex items-center gap-2 shadow-lg shadow-lime-500/20"
           >
             {isPlaying ? '⏸ SIMULATING...' : '▶ START REPLAY'}
           </button>
           <button 
             onClick={() => { setVisibleCount(data.length); setIsPlaying(false); }}
             className="text-slate-500 hover:text-white text-[10px] font-black uppercase transition-colors"
           >
             Jump to End
           </button>
        </div>
        <div className="flex items-center gap-4 text-[10px] mono text-slate-500 uppercase font-black">
          {livePrice && (
            <span className="text-lime-500 animate-pulse">PRICE: ${livePrice.toFixed(2)}</span>
          )}
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            LIVE_FEED
          </span>
        </div>
      </div>

      <div className="relative border border-slate-800/50 rounded-2xl bg-[#090c10] p-4 min-h-[400px]">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="cursor-crosshair overflow-visible">
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1={padding}
              y1={getY(minPrice + p * (maxPrice - minPrice))}
              x2={width - padding}
              y2={getY(minPrice + p * (maxPrice - minPrice))}
              stroke="#1e293b"
              strokeWidth="0.5"
              strokeDasharray="4"
            />
          ))}

          {/* Price Line (Crosshair) */}
          {livePrice && (
            <line 
              x1={padding} y1={getY(livePrice)} x2={width - padding} y2={getY(livePrice)}
              stroke="#84cc16" strokeWidth="0.5" opacity="0.5" strokeDasharray="2"
            />
          )}

          {/* Candles */}
          {visibleData.map((d, i) => {
            const isBullish = d.close >= d.open;
            const x = getX(i);
            const yOpen = getY(d.open);
            const yClose = getY(d.close);
            const yHigh = getY(d.high);
            const yLow = getY(d.low);
            
            const bodyY = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
            
            const isTargeted = i === showSuccess || i === showError;
            const candleColor = isBullish ? '#10b981' : '#ef4444';
            const statusColor = i === showSuccess ? '#ffffff' : i === showError ? '#ef4444' : candleColor;

            return (
              <g 
                key={i} 
                className="transition-all duration-300"
                onClick={() => onCandleClick(i)}
              >
                <line 
                  x1={x} y1={yHigh} x2={x} y2={yLow} 
                  stroke={statusColor} strokeWidth="1.2" 
                  opacity={isTargeted ? 1 : 0.6}
                />
                <rect
                  x={x - candleWidth * 0.3}
                  y={bodyY}
                  width={candleWidth * 0.6}
                  height={bodyHeight}
                  fill={statusColor}
                  fillOpacity={isTargeted ? 1 : 0.8}
                  className={`hover:brightness-125 transition-all cursor-pointer ${i === visibleCount - 1 && isPlaying ? 'animate-pulse' : ''}`}
                  stroke={isTargeted ? '#fff' : 'none'}
                  strokeWidth={isTargeted ? 2 : 0}
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-[9px] mono text-slate-600 px-2 font-black uppercase tracking-tighter">
        <span>TICK: {visibleCount} / {data.length}</span>
        <span>MARKET_STATUS: {isPlaying ? 'REPLAY_ACTIVE' : 'IDLE'}</span>
        <span>SYSTEM_SECURE: 0x2A3B</span>
      </div>
    </div>
  );
};

export default TradingChart;
