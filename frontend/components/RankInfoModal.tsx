import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Shield, Target, Zap, Star, Trophy, Info } from 'lucide-react';

interface RankInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
}

const RANK_TIERS = [
    { tier: 0, name: 'Novice Trader', minProfit: -1000000, maxProfit: 0, icon: 'novice', description: 'Just starting your journey.' },
    { tier: 1, name: 'Apprentice Trader', minProfit: 1000, maxProfit: 50000, icon: 'apprentice', description: 'Learning the ropes of the market.' },
    { tier: 2, name: 'Skilled Trader', minProfit: 50000, maxProfit: 150000, icon: 'skilled', description: 'Maintaining consistent execution.' },
    { tier: 3, name: 'Expert Trader', minProfit: 150000, maxProfit: 300000, icon: 'expert', description: 'Advanced market understanding.' },
    { tier: 4, name: 'Master Trader', minProfit: 300000, maxProfit: 600000, icon: 'master', description: 'Dominating large volume moves.' },
    { tier: 5, name: 'Elite Trader', minProfit: 600000, maxProfit: 1000000, icon: 'elite', description: 'Top tier market player.' },
    { tier: 6, name: 'Legendary Trader', minProfit: 1000000, maxProfit: Infinity, icon: 'legendary', description: 'True market mastery achieved.' }
];

const RankInfoModal: React.FC<RankInfoModalProps> = ({ isOpen, onClose, theme }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-4 shadow-pixel flex flex-col
                            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-parchment border-wood'}
                        `}
                    >
                        {/* Header */}
                        <div className={`p-6 border-b-4 flex items-center justify-between
                            ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-wood border-wood-dark text-parchment'}
                        `}>
                            <div className="flex items-center gap-3">
                                <Info className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-xl md:text-2xl font-pixel tracking-wide uppercase">Trading Ranks Info</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <p className={`text-sm font-medium mb-6 leading-relaxed
                                ${theme === 'dark' ? 'text-gray-400' : 'text-coffee/80'}
                            `}>
                                Your rank is determined by your <span className="font-bold text-green-500">Total Profit</span>. Reach new milestones to unlock prestigious tiers and showcase your market dominance.
                            </p>

                            <div className="space-y-3">
                                {RANK_TIERS.map((tier) => (
                                    <div
                                        key={tier.tier}
                                        className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.01]
                                            ${theme === 'dark'
                                                ? 'bg-gray-900/50 border-gray-700 hover:border-indigo-500/50'
                                                : 'bg-white/50 border-wood-light/50 hover:border-wood'}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-wood-dark/20 flex items-center justify-center border-2 border-wood/30">
                                                <Trophy className={`w-6 h-6 ${tier.tier >= 4 ? 'text-yellow-500' : 'text-gray-400'}`} />
                                            </div>
                                            <div>
                                                <h3 className={`font-pixel text-base ${theme === 'dark' ? 'text-amber-400' : 'text-wood-dark'}`}>
                                                    {tier.name}
                                                </h3>
                                                <p className={`text-[10px] font-medium opacity-60 uppercase tracking-widest`}>
                                                    Tier {tier.tier}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 md:mt-0 md:text-right">
                                            <div className="flex items-center md:justify-end gap-2">
                                                <span className={`text-[10px] font-pixel uppercase tracking-tighter opacity-50`}>Req. Profit</span>
                                                <div className={`font-pixel text-sm ${theme === 'dark' ? 'text-green-400' : 'text-success'}`}>
                                                    {tier.minProfit <= -1000000 ? 'START' : `$${tier.minProfit.toLocaleString()}`}
                                                </div>
                                            </div>
                                            <p className={`text-xs italic opacity-60 mt-1`}>
                                                {tier.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`p-4 text-center border-t-4
                            ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-parchment border-wood'}
                        `}>
                            <button
                                onClick={onClose}
                                className={`px-8 py-2 rounded-lg font-pixel text-xs transition-all shadow-pixel active:scale-95 border-b-4 active:border-b-0 active:translate-y-1
                                    ${theme === 'dark'
                                        ? 'bg-indigo-600 border-indigo-800 text-white hover:bg-indigo-500'
                                        : 'bg-success border-green-800 text-white hover:bg-green-600'}
                                `}
                            >
                                UNDERSTOOD
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RankInfoModal;
