import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { sendMessage, subscribeToMessages, ChatMessage } from '../services/firebaseApi';
import { Send, ArrowLeft, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityChat: React.FC = () => {
    const navigate = useNavigate();
    const { userId, userProfile, theme } = useStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = subscribeToMessages((msgs) => {
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId || !userProfile) return;

        const text = newMessage;
        setNewMessage('');

        try {
            await sendMessage(userId, userProfile.username, text);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return '...';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 border-b-4 shadow-md z-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-wood-dark border-wood text-white'}`}>
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg">
                        <Users size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-pixel text-lg leading-none">COMMUNITY CHAT</h1>
                        <p className="text-[10px] font-pixel opacity-70">Global Trading Floor</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-500"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="font-pixel animate-pulse text-amber-500">Loading Scrolls...</div>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => {
                            const isMe = msg.userId === userId;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-xl border-2 shadow-pixel ${isMe
                                            ? (theme === 'dark' ? 'bg-indigo-900 border-indigo-700' : 'bg-indigo-600 border-indigo-800 text-white')
                                            : (theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-wood-light')
                                        }`}>
                                        {!isMe && (
                                            <div className="text-[10px] font-pixel text-amber-500 mb-1">
                                                {msg.username}
                                            </div>
                                        )}
                                        <div className="text-sm font-body break-words">
                                            {msg.text}
                                        </div>
                                        <div className={`text-[8px] font-pixel mt-1 flex items-center gap-1 opacity-60 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <Clock size={8} />
                                            {formatTimestamp(msg.timestamp)}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-parchment border-wood'}`}>
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Cast a message..."
                        className={`flex-1 p-3 rounded-lg border-2 font-body text-sm outline-none transition-all ${theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 focus:border-amber-500'
                                : 'bg-white border-wood-light focus:border-wood'
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-lg border-b-4 transition-all active:border-b-0 active:translate-y-1 ${newMessage.trim()
                                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-800'
                                : 'bg-gray-400 text-gray-200 border-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommunityChat;
