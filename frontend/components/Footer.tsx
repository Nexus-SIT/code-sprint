import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
    const { theme } = useStore();

    return (
        <footer className={`mt-auto border-t-4 transition-colors z-10 relative ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : 'bg-wood border-wood-dark text-parchment'
            }`}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full mb-6">
                    <Link
                        to="/about"
                        className="font-pixel text-lg hover:text-yellow-400 transition-colors border-b-2 border-transparent hover:border-yellow-400"
                    >
                        About Us
                    </Link>

                    <a
                        href="https://github.com/Nexus-SIT/nexus-alpha"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 font-pixel text-lg hover:text-yellow-400 transition-colors group"
                    >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        <span>GitHub</span>
                    </a>
                </div>

                <div className="pt-4 border-t-2 border-current/10 text-center font-pixel text-xs opacity-60">
                    © {new Date().getFullYear()} Candle Crush. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
