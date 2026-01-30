import React from 'react';
import { useStore } from '../store';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useStore();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full border-2 transition-colors ${isDark
                    ? 'bg-indigo-900 border-indigo-700'
                    : 'bg-amber-200 border-amber-400'
                }`}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-yellow-400'
                    }`}
                animate={{
                    x: isDark ? 30 : 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-blue-200" />
                ) : (
                    <Sun className="w-4 h-4 text-amber-900" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
