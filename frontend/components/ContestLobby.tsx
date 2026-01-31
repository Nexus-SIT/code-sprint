import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, LogIn, ArrowLeft, Users, Shield, Zap, Sparkles, Copy, Check } from 'lucide-react';
import { createContest, joinContest } from '../services/firebaseApi';

const ContestLobby: React.FC = () => {
    const navigate = useNavigate();
    const { userId, userProfile, theme } = useStore();

    const [mode, setMode] = useState<'selection' | 'create' | 'join'>('selection');
    const [contestTitle, setContestTitle] = useState('');
    const [startingBalance, setStartingBalance] = useState('10000');
    const [maxRounds, setMaxRounds] = useState('5');
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successCode, setSuccessCode] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !userProfile) return;
        setLoading(true);
        setError('');
        try {
            const code = await createContest(userId, userProfile.username, contestTitle, parseInt(startingBalance), parseInt(maxRounds));
            setSuccessCode(code);
            setMode('selection');
            // Option: Auto join
            navigate(`/contest/${code}`);
        } catch (err: any) {
            setError(err.message || 'Failed to create contest');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !userProfile) return;
        setLoading(true);
        setError('');
        try {
            await joinContest(userId, userProfile.username, joinCode.toUpperCase());
            navigate(`/contest/${joinCode.toUpperCase()}`);
        } catch (err: any) {
            setError(err.message || 'Failed to join contest');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen p-6 relative font-body transition-colors ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'
            }`}>
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between relative z-10">
                <button
                    onClick={() => mode === 'selection' ? navigate('/') : setMode('selection')}
                    className="bg-wood text-parchment border-b-4 border-wood-dark px-4 py-2 rounded-lg font-pixel text-xs flex items-center hover:bg-wood-dark transition-all"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> BACK
                </button>
                <div className="text-center flex-1">
                    <h1 className="text-3xl font-pixel uppercase tracking-widest text-wood-dark dark:text-amber-400">Contest Arena</h1>
                    <p className="text-xs font-medium text-wood opacity-70">Battle for the highest profit</p>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            <main className="max-w-4xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {mode === 'selection' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
                        >
                            {/* Create Option */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-wood-dark/10 dark:bg-gray-800/50 rounded-2xl p-8 border-4 border-dashed border-wood-dark/30 flex flex-col items-center text-center group cursor-pointer"
                                onClick={() => setMode('create')}
                            >
                                <div className="p-6 bg-amber-500 rounded-2xl mb-6 shadow-pixel group-hover:rotate-6 transition-transform">
                                    <Plus size={48} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-pixel mb-3 uppercase">Host Contest</h2>
                                <p className="text-sm text-wood-light mb-6">Create a private room, set starting funds, and challenge your friends.</p>
                                <div className="mt-auto bg-amber-600 text-white px-8 py-3 rounded-xl font-pixel text-xs border-b-4 border-amber-900">CREATE NOW</div>
                            </motion.div>

                            {/* Join Option */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-wood-dark/10 dark:bg-gray-800/50 rounded-2xl p-8 border-4 border-dashed border-wood-dark/30 flex flex-col items-center text-center group cursor-pointer"
                                onClick={() => setMode('join')}
                            >
                                <div className="p-6 bg-purple-500 rounded-2xl mb-6 shadow-pixel group-hover:-rotate-6 transition-transform">
                                    <LogIn size={48} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-pixel mb-3 uppercase">Join Battle</h2>
                                <p className="text-sm text-wood-light mb-6">Enter a unique code to join an existing contest and climb its leaderboard.</p>
                                <div className="mt-auto bg-purple-600 text-white px-8 py-3 rounded-xl font-pixel text-xs border-b-4 border-purple-900">ENTER CODE</div>
                            </motion.div>
                        </motion.div>
                    )}

                    {mode === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-md mx-auto bg-parchment dark:bg-gray-800 rounded-2xl border-4 border-wood-dark p-8 shadow-pixel mt-8"
                        >
                            <h2 className="text-2xl font-pixel text-center mb-8 uppercase">Setup your Arena</h2>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-pixel text-wood-dark uppercase">Contest Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={contestTitle}
                                        onChange={(e) => setContestTitle(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 border-4 border-wood-dark/20 rounded-xl py-3 px-4 font-pixel text-sm focus:border-amber-500 outline-none transition-all"
                                        placeholder="Epic Trading Battle..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-pixel text-wood-dark uppercase">Starting Virtual Funds (₹)</label>
                                    <select
                                        value={startingBalance}
                                        onChange={(e) => setStartingBalance(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 border-4 border-wood-dark/20 rounded-xl py-3 px-4 font-pixel text-sm focus:border-amber-500 outline-none transition-all"
                                    >
                                        <option value="1000">₹1,000</option>
                                        <option value="5000">₹5,000</option>
                                        <option value="10000">₹10,000</option>
                                        <option value="50000">₹50,000</option>
                                        <option value="100000">₹100,000</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-pixel text-wood-dark uppercase">Number of Rounds (2-15)</label>
                                    <select
                                        value={maxRounds}
                                        onChange={(e) => setMaxRounds(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 border-4 border-wood-dark/20 rounded-xl py-3 px-4 font-pixel text-sm focus:border-amber-500 outline-none transition-all"
                                    >
                                        {[2, 3, 5, 8, 10, 12, 15].map(num => (
                                            <option key={num} value={num}>{num} Rounds</option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="text-xs text-red-500 font-pixel">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-success text-white border-b-6 border-green-900 active:border-b-0 active:translate-y-1.5 rounded-xl py-4 font-pixel text-sm shadow-xl hover:brightness-110 transition-all"
                                >
                                    {loading ? 'OPENING GATES...' : 'INITIALIZE CONTEST'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {mode === 'join' && (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-md mx-auto bg-parchment dark:bg-gray-800 rounded-2xl border-4 border-wood-dark p-8 shadow-pixel mt-8"
                        >
                            <h2 className="text-2xl font-pixel text-center mb-8 uppercase">Combat Entry</h2>
                            <form onSubmit={handleJoin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-pixel text-wood-dark uppercase">Enter Unique Access Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        className="w-full bg-white dark:bg-gray-700 border-4 border-wood-dark/20 rounded-xl py-4 px-4 font-pixel text-2xl text-center tracking-[0.5em] focus:border-purple-500 outline-none transition-all"
                                        placeholder="XXXXXX"
                                    />
                                </div>
                                {error && <p className="text-xs text-red-500 font-pixel text-center">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white border-b-6 border-purple-900 active:border-b-0 active:translate-y-1.5 rounded-xl py-4 font-pixel text-sm shadow-xl hover:brightness-110 transition-all"
                                >
                                    {loading ? 'LOCATING REALM...' : 'JOIN BATTLE'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-sm" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover' }}></div>
        </div>
    );
};

export default ContestLobby;
