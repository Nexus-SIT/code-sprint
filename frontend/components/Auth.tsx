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

    return null;

    /*
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-parchment border-4 border-wood-dark p-8 rounded-lg shadow-2xl max-w-md w-full relative">
                
                <div className="absolute top-0 left-0 right-0 h-4 bg-wood rounded-t border-b-2 border-wood-dark"></div>

                <div className="text-center mb-6 mt-4">
                    <div className="inline-block p-3 bg-wood-dark rounded-full mb-2 border-2 border-wood">
                        <User className="w-8 h-8 text-parchment" />
                    </div>
                   
                </div>

               
            </div>
        </div>
    );
    */
};

export default Auth;
