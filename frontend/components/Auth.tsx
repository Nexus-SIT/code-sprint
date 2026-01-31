import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail } from '../services/firebaseApi';
import { User, Mail, Lock, LogIn, UserPlus, Coins, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
    onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                if (!name) throw new Error('Name is required');
                await signUpWithEmail(email, password, name);
            }
            onLoginSuccess();
        } catch (err: any) {
            let msg = 'Authentication failed';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                msg = 'Invalid email or password.';
            } else if (err.code === 'auth/email-already-in-use') {
                msg = 'Email is already registered.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.';
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-parchment border-4 border-wood-dark p-8 rounded-2xl shadow-pixel max-w-md w-full relative overflow-hidden"
            >
                {/* Decorative Header */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-wood border-b-2 border-wood-dark shadow-sm"></div>

                <div className="text-center mb-8 pt-4">
                    <div className="inline-block p-4 bg-wood-dark rounded-xl mb-4 border-2 border-wood shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                        {isLogin ? <ShieldCheck className="w-10 h-10 text-amber-400" /> : <UserPlus className="w-10 h-10 text-amber-400" />}
                    </div>
                    <h2 className="text-3xl font-pixel text-coffee uppercase tracking-wider mb-2">
                        {isLogin ? 'Trader Registry' : 'New Prospect'}
                    </h2>
                    <p className="text-wood-light font-medium text-xs uppercase tracking-widest">
                        {isLogin ? 'Enter your credentials to trade' : 'Join the Trading Valley'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-pixel text-wood-dark uppercase ml-1">TRADER NAME</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-wood group-focus-within:text-amber-600 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/50 border-4 border-wood-dark/20 rounded-xl py-3 pl-11 pr-4 font-pixel text-sm focus:border-amber-500 focus:bg-white outline-none transition-all"
                                    placeholder="Your username..."
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-pixel text-wood-dark uppercase ml-1">COMMUNICATION SCROLL (EMAIL)</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-wood group-focus-within:text-amber-600 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 border-4 border-wood-dark/20 rounded-xl py-3 pl-11 pr-4 font-pixel text-sm focus:border-amber-500 focus:bg-white outline-none transition-all"
                                placeholder="trader@valley.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-pixel text-wood-dark uppercase ml-1">SECRET CIPHER (PASSWORD)</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-wood group-focus-within:text-amber-600 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border-4 border-wood-dark/20 rounded-xl py-3 pl-11 pr-4 font-pixel text-sm focus:border-amber-500 focus:bg-white outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg text-[10px] font-pixel flex items-center gap-2"
                            >
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 text-white border-b-6 border-amber-900 active:border-b-0 active:translate-y-1.5 rounded-xl py-4 font-pixel text-sm shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                                {isLogin ? 'ENTER THE VALLEY' : 'ESTABLISH LEGACY'}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t-2 border-wood-dark/10 pt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[10px] font-pixel text-wood hover:text-amber-600 transition-colors uppercase tracking-widest"
                    >
                        {isLogin ? "Need a new identity? Sign up" : "Already a citizen? Log in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
