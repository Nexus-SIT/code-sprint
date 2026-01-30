import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail } from 'lucide-react';
import { useStore } from '../store';

const About: React.FC = () => {
    const { theme } = useStore();

    // Theme-based styles
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-parchment';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-coffee';
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-vintage-gold';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} p-2 flex flex-col items-center justify-center`}>
            <div className="w-full">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    {/* Team Section */}
                    <div>
                        <motion.h1
                            variants={itemVariants}
                            className={`text-6xl md:text-8xl font-black text-center mb-10 ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500' : 'text-coffee'}`}
                        >
                            Meet the Team
                        </motion.h1>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full px-2">
                            {[
                                { name: "Your Name", role: "Founder & Lead", email: "your.email@example.com", image: "" },
                                { name: "Team Member 1", role: "Developer", email: "member1@example.com", image: "/team/member2.jpg" },
                                { name: "Team Member 2", role: "Designer", email: "member2@example.com", image: "" },
                                { name: "Team Member 3", role: "Analyst", email: "member3@example.com", image: "" }
                            ].map((member, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className={`${cardBg} p-4 rounded-3xl border-2 shadow-2xl text-center hover:scale-105 transition-transform duration-300 flex flex-col items-center`}
                                >
                                    <div className="w-full aspect-square mb-6 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-indigo-500/30">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-24 h-24 opacity-50" />
                                        )}
                                    </div>
                                    <h3 className="font-black text-4xl mb-2">{member.name}</h3>
                                    <div className="flex items-center justify-center gap-3 text-lg opacity-70 bg-black/5 dark:bg-white/5 py-2 px-4 rounded-lg">
                                        <Mail className="w-5 h-5" />
                                        <span className="text-sm md:text-base truncate max-w-[200px]">{member.email}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
