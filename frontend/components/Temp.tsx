import React, { useMemo, useState, useEffect } from 'react';

// --- INFERRED TYPES ---
export type MascotState = 'happy' | 'dizzy' | 'thinking' | 'surprised' | 'idle';

export interface OHLCData {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp?: number;
}

export interface Room {
    id: string;
    title: string;
    iconType: 'terminal' | 'shield' | 'chart' | 'target' | 'sword' | 'lock' | 'skull' | 'heart' | 'cat';
}

export interface Module {
    id: string;
    title: string;
    description: string;
    rooms: Room[];
}

export interface Path {
    modules: Module[];
}

// --- COMPONENT 1: MASCOT ---
interface MascotProps {
    state: MascotState;
    message?: string;
}

export const Mascot: React.FC<MascotProps> = ({ state, message }) => {
    const getFace = () => {
        switch (state) {
            case 'happy': return '^ ω ^';
            case 'dizzy': return 'x ω x';
            case 'thinking': return '• ω •';
            case 'surprised': return 'O ω O';
            default: return 'u ω u';
        }
    };

    const getAnimation = () => {
        switch (state) {
            case 'happy': return 'animate-bounce';
            case 'dizzy': return 'animate-pulse';
            case 'thinking': return 'animate-bounce';
            default: return 'animate-none';
        }
    };

    return (
        <div className="flex flex-col items-center space-y-3 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
            <div className={`text-4xl transition-all duration-300 ${getAnimation()}`}>
                <div className="relative inline-block">
                    <div className="absolute -top-4 -left-1 text-slate-400">/ \</div>
                    <div className="absolute -top-4 -right-1 text-slate-400">/ \</div>
                    <div className="bg-slate-700 p-4 rounded-full border-2 border-slate-500 flex items-center justify-center min-w-[100px] min-h-[100px] shadow-inner">
                        <span className="mono font-bold text-emerald-400">{getFace()}</span>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <h3 className="font-bold text-emerald-400 text-sm mb-1 uppercase tracking-wider">Cipher the Cat</h3>
                {message && (
                    <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 max-w-[200px] leading-relaxed">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT 2: TRADING CHART ---
interface TradingChartProps {
    data: OHLCData[];
    onCandleClick: (index: number) => void;
    correctIndex?: number;
    showSuccess?: number | null;
    showError?: number | null;
}

export const TradingChart: React.FC<TradingChartProps> = ({
    data,
    onCandleClick,
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
            }, 300);
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
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <line key={i} x1={padding} y1={getY(minPrice + p * (maxPrice - minPrice))} x2={width - padding} y2={getY(minPrice + p * (maxPrice - minPrice))} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4" />
                    ))}
                    {livePrice && (
                        <line x1={padding} y1={getY(livePrice)} x2={width - padding} y2={getY(livePrice)} stroke="#84cc16" strokeWidth="0.5" opacity="0.5" strokeDasharray="2" />
                    )}
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
                            <g key={i} className="transition-all duration-300" onClick={() => onCandleClick(i)}>
                                <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={statusColor} strokeWidth="1.2" opacity={isTargeted ? 1 : 0.6} />
                                <rect x={x - candleWidth * 0.3} y={bodyY} width={candleWidth * 0.6} height={bodyHeight} fill={statusColor} fillOpacity={isTargeted ? 1 : 0.8} className={`hover:brightness-125 transition-all cursor-pointer ${i === visibleCount - 1 && isPlaying ? 'animate-pulse' : ''}`} stroke={isTargeted ? '#fff' : 'none'} strokeWidth={isTargeted ? 2 : 0} rx="1" />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

// --- COMPONENT 3: ROADMAP VIEW ---
interface RoadmapViewProps {
    path: Path;
    completedRooms: string[];
    onSelectRoom: (moduleIndex: number, roomIndex: number) => void;
}

const RoomNode: React.FC<{ room: Room; completed: boolean; onClick: () => void; isRight: boolean; index: number }> = ({ room, completed, onClick, isRight }) => {
    const icons: any = { terminal: '💻', shield: '🛡️', chart: '📊', target: '🎯', sword: '⚔️', lock: '🔒', skull: '💀', heart: '❤️', cat: '🐱' };
    return (
        <div className={`relative flex items-center w-full min-h-[160px] ${isRight ? 'justify-end pr-12 lg:pr-32' : 'justify-start pl-12 lg:pl-32'}`}>
            <div className={`relative z-20 flex items-center gap-10 group cursor-pointer transition-all duration-300 ${isRight ? 'flex-row' : 'flex-row-reverse'}`} onClick={onClick}>
                <div className={`flex flex-col ${isRight ? 'text-left' : 'text-right'} min-w-[150px]`}>
                    <h4 className="text-base font-black text-white group-hover:text-lime-400 transition-colors tracking-tight">{room.title}</h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">INTRO</span>
                    {completed && <div className={`flex items-center gap-1 mt-1 ${isRight ? 'justify-start' : 'justify-end'}`}><span className="text-[9px] font-black text-lime-400">✓ COMPLETED</span></div>}
                </div>
                <div className="relative w-32 h-24 flex items-center justify-center">
                    <div className="absolute bottom-2 w-24 h-8 bg-black/40 rounded-[100%] blur-lg opacity-50" />
                    <div className="relative w-24 h-12 transform-gpu" style={{ transform: 'rotateX(55deg) rotateZ(-25deg)' }}>
                        <div className={`absolute top-4 left-0 w-full h-full rounded-xl ${completed ? 'bg-lime-700' : 'bg-slate-800'} border-b-8 border-black/30`} />
                        <div className={`absolute top-0 left-0 w-full h-full rounded-xl transition-all duration-300 shadow-xl ${completed ? 'bg-lime-500' : 'bg-[#2d3a35] group-hover:bg-[#3d4a45]'} border border-white/10`}>
                            <div className="absolute inset-2 border border-white/5 rounded-lg" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl -translate-y-12 -rotate-x-12 rotate-z-25 animate-float pointer-events-none">
                            <span className="drop-shadow-2xl group-hover:-translate-y-3 transition-transform duration-700 block" style={{ transform: 'rotateX(-55deg) rotateZ(25deg)' }}>{icons[room.iconType] || '📍'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms, onSelectRoom }) => {
    return (
        <div className="flex-1 bg-[#0d1117] overflow-y-auto overflow-x-hidden selection:bg-lime-500/30">
            <div className="max-w-[1000px] mx-auto p-4 lg:p-12 space-y-20">
                {path.modules.map((module, modIndex) => (
                    <div key={module.id} className="relative rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl bg-[#11161d]">
                        <div className="bg-[#1c2431] p-10 lg:p-12 border-b border-slate-800">
                            <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.4em] block mb-3">Module {modIndex + 1}</span>
                            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3 tracking-tighter">{module.title}</h2>
                            <p className="text-sm text-slate-400 font-medium max-w-xl leading-relaxed">{module.description}</p>
                        </div>
                        <div className="relative p-12 lg:p-20 bg-[#0d1117]">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-50 hidden lg:block" />
                            <div className="flex flex-col gap-4 relative">
                                {module.rooms.map((room, roomIndex) => (
                                    <RoomNode key={room.id} index={roomIndex} room={room} completed={completedRooms.includes(room.id)} onClick={() => onSelectRoom(modIndex, roomIndex)} isRight={roomIndex % 2 !== 0} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(2deg); } } .animate-float { animation: float 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }`}</style>
        </div>
    );
};