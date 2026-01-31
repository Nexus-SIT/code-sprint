
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Send, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: any;
    rank?: number;
}

const Community: React.FC = () => {
    const navigate = useNavigate();
    const { theme, userId, userProfile } = useStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const q = query(
            collection(db, 'global_chat'),
            orderBy('createdAt', 'asc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({
                    id: doc.id,
                    text: data.text,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    createdAt: data.createdAt,
                    rank: data.rank
                });
            });
            setMessages(msgs);
            // Scroll to bottom on new messages
            setTimeout(scrollToBottom, 100);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId || !userProfile) return;

        try {
            await addDoc(collection(db, 'global_chat'), {
                text: newMessage.trim(),
                senderId: userId,
                senderName: userProfile.username || 'Trader',
                rank: userProfile.rank,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className={`min-h-screen p-4 md:p-6 relative font-body transition-colors flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'
            }`}>
            {/* Header */}
            <div className="max-w-4xl w-full mx-auto mb-4 flex items-center justify-between relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="bg-wood text-parchment border-b-4 border-wood-dark px-4 py-2 rounded-lg font-pixel text-xs flex items-center hover:bg-wood-dark transition-all"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> BACK
                </button>
                <div className="text-center flex-1">
                    <h1 className="text-2xl md:text-3xl font-pixel uppercase tracking-widest text-wood-dark dark:text-amber-400 flex items-center justify-center gap-3">
                        <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
                        Community Hub
                    </h1>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col relative z-10 overflow-hidden rounded-2xl border-4 border-wood-dark shadow-pixel bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => {
                            const isMe = msg.senderId === userId;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] font-pixel text-wood-light dark:text-gray-400 mb-1 px-1">
                                            {msg.senderName}
                                            {/* Could add rank badge here */}
                                        </span>
                                        <div
                                            className={`px-4 py-2 rounded-xl border-2 ${isMe
                                                    ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 rounded-tr-none'
                                                    : 'bg-white dark:bg-gray-700 border-wood-light/30 dark:border-gray-600 rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm md:text-base break-words">{msg.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-wood/10 dark:bg-gray-900/50 border-t-4 border-wood-dark">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Say something to the community..."
                            className="flex-1 bg-white dark:bg-gray-800 border-2 border-wood-dark/30 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 font-medium transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-amber-500 text-white p-2 rounded-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-sm" style={{ backgroundImage: "url('/bg.webp')", backgroundSize: 'cover' }}></div>
        </div>
    );
};

export default Community;
