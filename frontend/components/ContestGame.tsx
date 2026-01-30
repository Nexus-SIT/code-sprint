import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { generateCandles } from '../utils/dataGenerator';
import CandleChart from './CandleChart';
import Mentor from './Mentor';
import { Candle, MentorEmotion } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Coins, Trophy, Users, Share2, Check, Copy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { subscribeToContest, updateContestProfit, ContestDoc, joinContest } from '../services/firebaseApi';
import ThemeToggle from './ThemeToggle';

type GamePhase = 'BETTING' | 'SIMULATING' | 'RESULT';

const ContestGame: React.FC = () => {
    const { contestId } = useParams<{ contestId: string }>();
    const navigate = useNavigate();
    const { userId, userProfile, theme } = useStore();

    const [contest, setContest] = useState<ContestDoc | null>(null);
    const [fullData, setFullData] = useState<Candle[]>([]);
    const [visibleData, setVisibleData] = useState<Candle[]>([]);
    const [phase, setPhase] = useState<GamePhase>('BETTING');
    const [betAmount, setBetAmount] = useState<string>('1000');
    const [position, setPosition] = useState<'BUY' | 'SELL' | 'HOLD' | null>(null);
    const [resultPnL, setResultPnL] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Subscribe to contest updates
    useEffect(() => {
        if (!contestId) return;
        const unsubscribe = subscribeToContest(contestId, (data) => {
            setContest(data);
            setLoading(false);

            // Auto-join if user is authenticated but not in participants
            if (userId && userProfile && !data.participants[userId]) {
                joinContest(userId, userProfile.username, contestId).catch(console.error);
            }
        });
        return () => unsubscribe();
    }, [contestId, userId, userProfile]);

    // Initialize Game Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getCandles('BTCUSDT', '5m', '1d');
                if (data && data.length >= 100) {
                    setFullData(data);
                    setVisibleData(data.slice(0, 50));
                } else {
                    const generatedData = generateCandles(100, 50000);
                    setFullData(generatedData);
                    setVisibleData(generatedData.slice(0, 50));
                }
            } catch (error) {
                const generatedData = generateCandles(100, 50000);
                setFullData(generatedData);
                setVisibleData(generatedData.slice(0, 50));
            }
        };
        fetchData();
    }, []);

    const handleBet = (type: 'BUY' | 'SELL' | 'HOLD') => {
        const amount = parseInt(betAmount);
        if (isNaN(amount) || amount <= 0) return alert("Enter amount");

        // Use contest balance for check
        const currentBalance = contest?.startingBalance ? contest.startingBalance + (contest.participants[userId || '']?.profit || 0) : 0;
        if (amount > currentBalance) return alert("Insufficient contest funds");

        setPosition(type);
        setPhase('SIMULATING');
    };

    // Simulation Logic
    const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const simulationIndex = useRef(50);

    useEffect(() => {
        if (phase === 'SIMULATING') {
            simulationInterval.current = setInterval(() => {
                simulationIndex.current += 1;
                setVisibleData(fullData.slice(0, simulationIndex.current));
                if (simulationIndex.current >= 100) {
                    endGame();
                }
            }, 50);
        }
        return () => {
            if (simulationInterval.current) clearInterval(simulationInterval.current);
        };
    }, [phase]);

    const endGame = async () => {
        if (simulationInterval.current) clearInterval(simulationInterval.current);

        const entryPrice = fullData[49].close;
        const exitPrice = fullData[99].close;
        const amount = parseInt(betAmount);
        let pnl = 0;

        if (position === 'BUY') {
            pnl = amount * ((exitPrice - entryPrice) / entryPrice) * 5;
        } else if (position === 'SELL') {
            pnl = amount * ((entryPrice - exitPrice) / entryPrice) * 5;
        }

        setResultPnL(pnl);

        if (contestId && userId) {
            await updateContestProfit(contestId, userId, pnl, position === 'SELL');
        }

        setPhase('RESULT');
    };

    const resetGame = () => {
        const data = generateCandles(100, fullData[99].close);
        setFullData(data);
        setVisibleData(data.slice(0, 50));
        setPhase('BETTING');
        setPosition(null);
        simulationIndex.current = 50;
    };

    const copyCode = () => {
        if (!contestId) return;
        navigator.clipboard.writeText(contestId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || !contest) {
        return <div className="h-screen flex items-center justify-center font-pixel animate-pulse">Entering Arena...</div>;
    }

    const myStats = userId ? (contest.participants[userId] as any) : null;
    const currentBalance = contest.startingBalance + (myStats?.profit || 0);
    const roundsPlayed = myStats?.roundsPlayed || 0;

    const isContestFinishedForMe = myStats && (roundsPlayed >= contest.maxRounds || (myStats.sellsUsed || 0) >= 2);

    // Rank participants by profit (for final)
    const sortedParticipants = Object.values(contest.participants).sort((a: any, b: any) => b.profit - a.profit);

    // Sort by join date (for sidebar list)
    const joinedParticipants = Object.values(contest.participants).sort((a: any, b: any) => {
        const timeA = a.joinedAt?.seconds || 0;
        const timeB = b.joinedAt?.seconds || 0;
        return timeA - timeB;
    });

    return (
        <div className={`flex flex-col h-screen p-2 md:p-4 max-w-7xl mx-auto font-body transition-colors ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'
            }`}>
            {/* Contest Header */}
            <div className={`flex items-center justify-between mb-4 rounded-xl p-3 shadow-pixel border-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-wood border-wood-dark'
                }`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/contest')} className="bg-failure p-2 rounded hover:brightness-110">
                        <ArrowLeft className="text-white w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-parchment font-pixel text-xs md:text-sm uppercase">{contest.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-amber-400 font-pixel text-[10px]">CODE: {contestId}</span>
                            <button onClick={copyCode} className="text-parchment/50 hover:text-white transition-colors">
                                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-amber-400 font-pixel text-lg">ROUND {Math.min((myStats?.roundsPlayed || 0) + 1, contest.maxRounds)} / {contest.maxRounds}</div>
                    <div className="text-parchment/60 font-pixel text-[8px] uppercase">Contest Battle</div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg border-2 border-white/10">
                        <Users size={16} className="text-blue-400" />
                        <span className="text-parchment font-pixel text-[10px]">{sortedParticipants.length} WARRIORS</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-lg border-2 border-yellow-500/30">
                        <Coins size={20} className="text-yellow-400" />
                        <span className="text-yellow-400 font-pixel text-lg">${currentBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Left: Warriors Joined List */}
                <div className={`hidden lg:flex flex-col bg-wood/10 rounded-xl border-4 border-wood-dark p-4 overflow-hidden`}>
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-wood-dark pb-2">
                        <Users size={18} className="text-amber-400" />
                        <h3 className="font-pixel text-xs uppercase tracking-tighter">Warriors Joined</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                        {(joinedParticipants as any[]).map((p, i) => (
                            <motion.div
                                key={p.userId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center justify-between p-2 rounded-lg border-2 ${p.userId === userId ? 'bg-amber-500/20 border-amber-500' : 'bg-parchment/5 border-wood-dark/20'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-pixel text-[10px] w-4 opacity-50">{i + 1}</span>
                                    <div className="flex flex-col">
                                        <span className="font-pixel text-[10px] truncate w-24 uppercase">{p.username}</span>
                                        <span className="text-[6px] font-pixel text-wood-dark/60">READY FOR BATTLE</span>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Center: Chart/Final Standings Area */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 relative">
                    <AnimatePresence>
                        {isContestFinishedForMe ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 z-50 bg-wood-dark/95 border-4 border-amber-500 rounded-xl p-6 flex flex-col shadow-2xl items-center"
                            >
                                <div className="text-center mb-8">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="inline-block p-4 bg-amber-500 rounded-full shadow-pixel mb-4"
                                    >
                                        <Trophy size={48} className="text-white" />
                                    </motion.div>
                                    <h2 className="text-2xl font-pixel text-amber-400 uppercase tracking-widest">Contest Complete</h2>
                                    <p className="text-xs text-parchment/70 font-pixel mt-2">The dust has settled in the arena.</p>
                                </div>

                                <div className="w-full flex-1 overflow-y-auto bg-black/30 rounded-xl border-4 border-wood border-double p-4 custom-scrollbar">
                                    <div className="grid grid-cols-12 gap-2 text-[10px] font-pixel text-amber-500/50 mb-4 border-b-2 border-wood pb-2">
                                        <div className="col-span-2">RANK</div>
                                        <div className="col-span-6">WARRIOR</div>
                                        <div className="col-span-4 text-right">PROFIT</div>
                                    </div>
                                    <div className="space-y-3">
                                        {(sortedParticipants as any[]).map((p, i) => (
                                            <motion.div
                                                key={p.userId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border-2 ${p.userId === userId ? 'bg-amber-500/20 border-amber-500' : 'bg-white/5 border-transparent'
                                                    }`}
                                            >
                                                <div className="col-span-2 font-pixel text-lg text-amber-400">
                                                    #{i + 1}
                                                </div>
                                                <div className="col-span-6 font-pixel text-sm text-parchment uppercase truncate">
                                                    {p.username} {p.userId === userId && "(YOU)"}
                                                </div>
                                                <div className={`col-span-4 text-right font-pixel text-sm ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    ${p.profit.toLocaleString()}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 w-full flex justify-center">
                                    <button
                                        onClick={() => navigate('/contest')}
                                        className="bg-amber-600 hover:bg-amber-500 text-white border-b-6 border-amber-900 active:border-b-0 active:translate-y-1.5 rounded-xl px-12 py-4 font-pixel text-sm transition-all shadow-xl"
                                    >
                                        EXIT TO LOBBY
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <div className="bg-parchment border-4 border-wood-dark rounded-xl flex-1 relative overflow-hidden">
                                    <CandleChart data={visibleData} height="100%" />
                                </div>
                                <div className="h-32">
                                    <Mentor
                                        emotion={phase === 'SIMULATING' ? 'alert' : phase === 'RESULT' ? (resultPnL >= 0 ? 'happy' : 'sad') : 'thinking'}
                                        text={phase === 'RESULT' ? `Season ended. ${resultPnL >= 0 ? 'Prosperity' : 'Losses'} in the arena.` : "The market waits for no one."}
                                    />
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Controls */}
                <div className="bg-wood border-4 border-wood-dark rounded-xl p-4 flex flex-col gap-6 relative overflow-hidden">
                    {isContestFinishedForMe ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="p-4 bg-wood-dark/50 rounded-xl border-2 border-dashed border-wood-light/30">
                                <h4 className="text-amber-400 font-pixel text-xs mb-2 uppercase tracking-tighter">Battle Final Rankings</h4>
                                <p className="text-parchment/50 font-pixel text-[8px] uppercase leading-relaxed text-center">Check the center panel for the full arena leaderboard results!</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {phase === 'BETTING' && (
                                <div className="flex flex-col gap-6 h-full">
                                    <div className="bg-parchment/10 p-4 rounded border-2 border-wood-dark/50">
                                        <label className="text-parchment text-[10px] font-pixel mb-2 block text-center">ARENA STAKE</label>
                                        <input
                                            type="number"
                                            value={betAmount}
                                            onChange={(e) => setBetAmount(e.target.value)}
                                            className="w-full bg-parchment border-4 border-wood-dark rounded p-3 text-coffee font-pixel text-lg text-center"
                                        />
                                        <div className="flex justify-between items-center mt-2 px-1">
                                            <p className="text-[7px] text-parchment/50 font-pixel uppercase">Funds used</p>
                                            <p className="text-[7px] text-amber-400 font-pixel uppercase">Sells: {myStats?.sellsUsed || 0}/2</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => handleBet('BUY')} className="bg-success text-white border-b-6 border-green-900 active:border-b-0 active:translate-y-1.5 rounded-xl py-4 font-pixel text-xs flex items-center justify-center gap-2">
                                            <TrendingUp size={20} /> LONG
                                        </button>
                                        <button
                                            onClick={() => handleBet('SELL')}
                                            disabled={(myStats?.sellsUsed || 0) >= 2}
                                            className={`bg-failure text-white border-b-6 border-red-900 rounded-xl py-4 font-pixel text-xs flex items-center justify-center gap-2 transition-all ${(myStats?.sellsUsed || 0) >= 2 ? 'opacity-30 grayscale cursor-not-allowed' : 'active:border-b-0 active:translate-y-1.5'
                                                }`}
                                        >
                                            <TrendingDown size={20} /> SHORT {(myStats?.sellsUsed || 0) >= 2 && "(LOCKED)"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {phase === 'SIMULATING' && (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="animate-spin text-parchment mb-4"><Zap size={48} /></div>
                                    <h3 className="text-xl font-pixel text-parchment uppercase animate-pulse">Battle On</h3>
                                </div>
                            )}

                            {phase === 'RESULT' && (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                                    <div className="bg-parchment w-full p-4 rounded border-4 border-wood-dark shadow-pixel">
                                        <div className="text-coffee font-pixel text-[10px] mb-2 uppercase">Arena PnL</div>
                                        <div className={`text-3xl font-pixel ${resultPnL >= 0 ? 'text-success' : 'text-failure'}`}>
                                            ${resultPnL.toFixed(0)}
                                        </div>
                                    </div>
                                    <button onClick={resetGame} className="w-full bg-blue-600 text-white border-b-6 border-blue-900 active:border-b-0 active:translate-y-1.5 rounded-xl py-4 font-pixel text-sm">
                                        {myStats?.roundsPlayed + 1 >= contest.maxRounds ? "FINISH BATTLE" : "NEXT ROUND"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestGame;
