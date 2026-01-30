import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';

interface AchievementNotificationProps {
    achievement: {
        id: string;
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
        xpReward: number;
    };
    onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'from-gray-500 to-gray-600';
            case 'uncommon': return 'from-green-500 to-green-600';
            case 'rare': return 'from-blue-500 to-blue-600';
            case 'epic': return 'from-purple-500 to-purple-600';
            case 'legendary': return 'from-yellow-500 to-orange-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getRarityGlow = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'shadow-[0_0_30px_rgba(251,191,36,0.6)]';
            case 'epic': return 'shadow-[0_0_20px_rgba(168,85,247,0.5)]';
            case 'rare': return 'shadow-[0_0_15px_rgba(59,130,246,0.4)]';
            default: return '';
        }
    };

    return (
        <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.8 }}
            className={`fixed top-20 right-6 z-50 w-80 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-lg border-4 border-white/20 p-4 ${getRarityGlow(achievement.rarity)}`}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <div className="flex items-start gap-3">
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-5xl"
                >
                    {achievement.icon}
                </motion.div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-yellow-300" />
                        <h3 className="font-pixel text-sm text-white">ACHIEVEMENT!</h3>
                    </div>

                    <h4 className="font-pixel text-lg text-white mb-1">{achievement.name}</h4>
                    <p className="text-xs text-white/80 mb-2">{achievement.description}</p>

                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span className="text-xs font-pixel text-yellow-300">+{achievement.xpReward} XP</span>
                    </div>
                </div>
            </div>

            {achievement.rarity === 'legendary' && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: [
                            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.3) 0%, transparent 70%)',
                            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0) 0%, transparent 70%)',
                        ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};

interface AchievementNotificationsProps {
    achievements: any[];
    onDismiss: (id: string) => void;
}

const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({ achievements, onDismiss }) => {
    return (
        <div className="fixed top-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {achievements.map((achievement, index) => (
                        <div key={achievement.id} style={{ marginTop: index * 10 }}>
                            <AchievementNotification
                                achievement={achievement}
                                onClose={() => onDismiss(achievement.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AchievementNotifications;
