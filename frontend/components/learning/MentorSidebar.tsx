import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface MentorSidebarProps {
    emotion: 'happy' | 'neutral' | 'sad' | 'alert' | 'thinking';
    onBack: () => void;
}

const MentorSidebar: React.FC<MentorSidebarProps> = ({ emotion, onBack }) => {

    // Map emotions to assets
    const getAsset = () => {
        switch (emotion) {
            case 'happy': return '/mentor/CatJoyFull.png';
            case 'sad': return '/mentor/CatSad.png';
            case 'alert': return '/mentor/CatShocked.png';
            case 'neutral':
            default: return '/mentor/CatNormal.png';
        }
    };

    return (
        <div className="w-full md:w-[400px] bg-[#5D4037] flex flex-col items-center p-6 relative border-r-4 border-[#3E2723] shadow-2xl">
            {/* Back Button */}
            <div className="w-full mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-[#8D6E63] text-[#EFEBE9] px-4 py-2 rounded-lg border-b-4 border-[#3E2723] active:border-b-0 active:translate-y-1 hover:bg-[#A1887F] font-bold font-pixel text-sm uppercase transition-all shadow-lg"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Pattern Background Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#3E2723 15%, transparent 16%), radial-gradient(#3E2723 15%, transparent 16%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }}>
            </div>

            {/* Portrait Frame */}
            <div className="relative z-10 w-full aspect-square max-w-[320px] bg-[#EFEBE9] p-4 rounded-xl border-4 border-[#D7CCC8] shadow-[0_0_0_8px_#8D6E63,0_10px_20px_rgba(0,0,0,0.5)]">
                <div className="w-full h-full bg-[#D7CCC8] rounded-lg overflow-hidden flex items-end justify-center relative inner-shadow">
                    {/* Inner Shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none z-20"></div>

                    <motion.img
                        key={emotion}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        src={getAsset()}
                        alt="Mentor Cat"
                        className="w-[90%] object-contain relative z-10 drop-shadow-xl filter contrast-125"
                    />
                </div>
            </div>

            {/* Nameplate */}
            <div className="relative z-20 -mt-6">
                <div className="bg-[#3E2723] text-[#FFE0B2] px-10 py-3 rounded-lg border-2 border-[#8D6E63] shadow-lg font-pixel text-xl tracking-widest uppercase text-shadow">
                    MENTOR
                </div>
            </div>

        </div>
    );
};

export default MentorSidebar;
