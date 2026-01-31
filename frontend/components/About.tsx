import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Github, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

const About: React.FC = () => {
    const { theme } = useStore();

    // Theme-based styles
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-parchment';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-coffee';
    const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-[#7C492E] border-vintage-gold text-white';

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
        <div className={`min-h-screen ${bgColor} ${textColor} font-pixel p-2 flex flex-col items-center justify-center`}>
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
                            className={`text-4xl md:text-6xl font-black text-center mb-10 ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500' : 'text-coffee'}`}
                        >
                            Meet the Team
                        </motion.h1>

                        {/* Retro Back Button */}
                        <motion.div variants={itemVariants} className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                            <Link to="/" className="group relative inline-flex items-center justify-center px-6 py-2 font-pixel text-lg uppercase tracking-widest text-white bg-[#A4243B] border-4 border-[#A4243B] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200">
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span>Back</span>
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full px-2">
                            {[
                                { name: "Manish R Shetty", role: "Founder & Lead", email: "mmanishrshetty@gmail.com", image: "/team/manish.webp", github: "https://github.com/ManishRShetty", portfolio: "https://yourportfolio.com" },
                                { name: "Anush", role: "Developer", email: "kulalanush18@gmail.com", image: "/team/member2.jpg", github: "https://github.com/Anush-kulal" },
                                { name: "Karthik", role: "Designer", email: "karthikashetty@gmail.com", image: "/team/karthik.jpg", github: "https://github.com/Karthikshettyhub" },
                                { name: "Chirag kulal", role: "Developer", email: "chiragkulal877@gmail.com", image: "/team/chiku.webp", github: "https://github.com/Chiragkulal07" }
                            ].map((member: any, idx) => (
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
                                    <h3 className="font-black text-2xl mb-2">{member.name}</h3>
                                    <div className="flex flex-col gap-2 w-full max-w-[240px]">
                                        <div className="flex items-center justify-center gap-2 text-xs opacity-90 bg-white/10 py-1.5 px-3 rounded-lg overflow-hidden w-full">
                                            <Mail className="w-3 h-3 flex-shrink-0" />
                                            <span className="text-[10px] md:text-xs truncate">{member.email}</span>
                                        </div>

                                        <div className="flex items-center justify-center gap-2">
                                            {member.github && (
                                                <a
                                                    href={member.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-xs opacity-90 bg-white/10 py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors flex-1 justify-center min-w-0"
                                                >
                                                    <Github className="w-3 h-3 flex-shrink-0" />
                                                    <span className="text-[10px] md:text-xs truncate">GitHub</span>
                                                </a>
                                            )}
                                            {member.portfolio && (
                                                <a
                                                    href={member.portfolio}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-xs opacity-90 bg-white/10 py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors flex-1 justify-center min-w-0"
                                                >
                                                    <Globe className="w-3 h-3 flex-shrink-0" />
                                                    <span className="text-[10px] md:text-xs truncate">Portfolio</span>
                                                </a>
                                            )}
                                        </div>
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
