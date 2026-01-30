import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail } from '../services/firebaseApi';
import { User, Coins } from 'lucide-react';

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
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-parchment border-4 border-wood-dark p-8 rounded-lg shadow-2xl max-w-md w-full relative">
                {/* Wood Grain Header */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-wood rounded-t border-b-2 border-wood-dark"></div>

                <div className="text-center mb-6 mt-4">
                    <div className="inline-block p-3 bg-wood-dark rounded-full mb-2 border-2 border-wood">
                        <User className="w-8 h-8 text-parchment" />
                    </div>
                    <h2 className="text-2xl font-pixel text-coffee">
                        {isLogin ? 'GUILD LOGIN' : 'JOIN THE GUILD'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-pixel text-wood-dark mb-1">TRADER NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-paper border-2 border-wood-light p-2 font-pixel text-coffee focus:outline-none focus:border-wood-dark rounded"
                                placeholder="Enter your name"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-pixel text-wood-dark mb-1">EMAIL SCROLL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-paper border-2 border-wood-light p-2 font-pixel text-coffee focus:outline-none focus:border-wood-dark rounded"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-pixel text-wood-dark mb-1">SECRET KEY</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-paper border-2 border-wood-light p-2 font-pixel text-coffee focus:outline-none focus:border-wood-dark rounded"
                            placeholder="********"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-xs font-pixel bg-red-100 p-2 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-wood text-parchment font-pixel py-3 rounded border-b-4 border-wood-dark active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : (isLogin ? 'ENTER MARKET' : 'REGISTER')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs font-pixel text-wood-light hover:text-wood-dark underline"
                    >
                        {isLogin ? "NEED A LICENSE? REGISTER" : "ALREADY LICENSED? LOGIN"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
