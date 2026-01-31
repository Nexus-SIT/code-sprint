import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { db } from '../firebase';
import { awardXP } from '../services/firebaseApi';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, updateDoc, doc, arrayUnion, runTransaction } from 'firebase/firestore';
import { ArrowLeft, Send, MessageSquare, Plus, Clock, BarChart2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PollOption {
    text: string;
    votes: string[]; // userIds
}

interface ChatMessage {
    id: string;
    text?: string;
    senderId: string;
    senderName: string;
    createdAt: any;
    rank?: number;
    type?: 'text' | 'poll';
    pollData?: {
        question: string;
        options: PollOption[];
        expiresAt: any;
        resolved: boolean;
        winningOptionIndex?: number;
    };
}

const Community: React.FC = () => {
    const navigate = useNavigate();
    const { theme, userId, userProfile } = useStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['Yes', 'No']);
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
                    rank: data.rank,
                    type: data.type || 'text',
                    pollData: data.pollData
                });
            });
            setMessages(msgs);
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
                type: 'text',
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleCreatePoll = async () => {
        if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()) || !userId || !userProfile) return;

        try {
            // Market closes at 3:30 PM (15:30) IST, or set it to 1 hour from now for testing
            const expiry = new Date();
            expiry.setHours(15, 30, 0, 0);
            if (expiry.getTime() < Date.now()) {
                expiry.setDate(expiry.getDate() + 1);
                expiry.setHours(15, 30, 0, 0);
            }

            await addDoc(collection(db, 'global_chat'), {
                senderId: userId,
                senderName: userProfile.username || 'Trader',
                rank: userProfile.rank,
                type: 'poll',
                pollData: {
                    question: pollQuestion.trim(),
                    options: pollOptions.map(opt => ({ text: opt.trim(), votes: [] })),
                    expiresAt: expiry,
                    resolved: false
                },
                createdAt: serverTimestamp()
            });
            setShowPollCreator(false);
            setPollQuestion('');
            setPollOptions(['Yes', 'No']);
        } catch (error) {
            console.error("Error creating poll:", error);
        }
    };

    const handleVote = async (messageId: string, optionIndex: number) => {
        if (!userId) return;

        const messageRef = doc(db, 'global_chat', messageId);

        try {
            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(messageRef);
                if (!docSnap.exists()) return;

                const data = docSnap.data() as ChatMessage;
                if (!data.pollData) return;

                // Check if already voted
                const hasVoted = data.pollData.options.some(opt => opt.votes.includes(userId));
                if (hasVoted) return;

                // Check if expired
                const isExpired = data.pollData.expiresAt.toDate ? data.pollData.expiresAt.toDate() < new Date() : new Date(data.pollData.expiresAt) < new Date();
                if (isExpired) return;

                const newOptions = [...data.pollData.options];
                newOptions[optionIndex].votes.push(userId);

                transaction.update(messageRef, {
                    'pollData.options': newOptions
                });
            });
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const resolvePoll = async (messageId: string, winningIndex: number) => {
        // In a real app, this would be a cloud function. Here we simulate it.
        const msg = messages.find(m => m.id === messageId);
        if (!msg || !msg.pollData || msg.pollData.resolved) return;

        const messageRef = doc(db, 'global_chat', messageId);
        try {
            await updateDoc(messageRef, {
                'pollData.resolved': true,
                'pollData.winningOptionIndex': winningIndex
            });

            // Award XP to winners
            const winners = msg.pollData.options[winningIndex].votes;
            for (const winnerId of winners) {
                await awardXP(winnerId, 50);
            }
        } catch (error) {
            console.error("Error resolving poll:", error);
        }
    };

    return (
        <div className={`h-screen overflow-hidden p-4 md:p-6 relative font-body transition-colors flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'
            }`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 border-4 shadow-pixel z-10 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-wood-dark border-wood text-white'}`}>
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 font-pixel text-xs"
                >
                    <ArrowLeft size={20} /> BACK
                </button>
                <div className="flex items-center gap-3 flex-1 justify-center">
                    <div className="p-2 bg-amber-500 rounded-lg">
                        <MessageSquare size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                        <h1 className="font-pixel text-lg leading-none uppercase">Community Hub</h1>
                        <p className="text-[10px] font-pixel opacity-70">Trading Room & Sentiment Polls</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowPollCreator(!showPollCreator)}
                    className={`p-2 rounded-lg border-b-4 transition-all active:border-b-0 active:translate-y-1 ${showPollCreator ? 'bg-red-500 border-red-700' : 'bg-blue-500 border-blue-700'}`}
                >
                    {showPollCreator ? <ArrowLeft size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {/* Poll Creator Modal/Overlay */}
            <AnimatePresence>
                {showPollCreator && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className={`w-full max-w-md p-6 rounded-2xl border-4 shadow-pixel ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-wood-dark'}`}>
                            <h2 className="text-xl font-pixel mb-4 text-amber-500">Create Prediction Poll</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-pixel mb-1 opacity-70">Question</label>
                                    <input
                                        type="text"
                                        value={pollQuestion}
                                        onChange={(e) => setPollQuestion(e.target.value)}
                                        placeholder="Will NIFTY close green today?"
                                        className={`w-full p-3 rounded-lg border-2 font-body text-sm outline-none ${theme === 'dark' ? 'bg-gray-900 border-gray-600' : 'bg-parchment border-wood-light'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-pixel mb-1 opacity-70">Options</label>
                                    {pollOptions.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...pollOptions];
                                                newOpts[idx] = e.target.value;
                                                setPollOptions(newOpts);
                                            }}
                                            className={`w-full p-2 rounded-lg border-2 font-body text-xs outline-none ${theme === 'dark' ? 'bg-gray-900 border-gray-600' : 'bg-parchment border-wood-light'}`}
                                        />
                                    ))}
                                    {pollOptions.length < 4 && (
                                        <button
                                            onClick={() => setPollOptions([...pollOptions, ''])}
                                            className="text-[10px] font-pixel text-blue-500 hover:underline"
                                        >
                                            + Add Option
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowPollCreator(false)}
                                        className="flex-1 p-3 rounded-lg border-b-4 border-gray-600 bg-gray-500 text-white font-pixel text-xs active:border-b-0 active:translate-y-1"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={handleCreatePoll}
                                        className="flex-1 p-3 rounded-lg border-b-4 border-amber-800 bg-amber-500 text-white font-pixel text-xs active:border-b-0 active:translate-y-1"
                                    >
                                        LAUNCH POLL
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Container */}
            <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col relative z-10 overflow-hidden rounded-2xl border-4 border-wood-dark shadow-pixel bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => {
                            const isMe = msg.senderId === userId;
                            const isPoll = msg.type === 'poll';

                            if (isPoll && msg.pollData) {
                                const totalVotes = msg.pollData.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                                const hasVoted = msg.pollData.options.some(opt => opt.votes.includes(userId || ''));
                                const expiryDate = msg.pollData.expiresAt.toDate ? msg.pollData.expiresAt.toDate() : new Date(msg.pollData.expiresAt);
                                const isExpired = expiryDate < new Date();

                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex justify-center"
                                    >
                                        <div className={`w-full max-w-md p-4 rounded-xl border-4 shadow-pixel relative overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-wood-light'
                                            }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 text-amber-500 font-pixel text-[10px]">
                                                    <BarChart2 size={14} /> SENTIMENT POLL
                                                </div>
                                                <div className={`flex items-center gap-1 font-pixel text-[8px] ${isExpired ? 'text-red-500' : 'text-green-500'}`}>
                                                    <Clock size={10} /> {isExpired ? 'CLOSED' : 'OPEN'}
                                                </div>
                                            </div>

                                            <h3 className="font-pixel text-sm mb-4 leading-relaxed">{msg.pollData.question}</h3>

                                            <div className="space-y-3">
                                                {msg.pollData.options.map((opt, idx) => {
                                                    const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                                                    const canVote = !hasVoted && !isExpired && !!userId;
                                                    const isWinner = msg.pollData?.resolved && msg.pollData?.winningOptionIndex === idx;

                                                    return (
                                                        <div key={idx} className="relative">
                                                            <button
                                                                onClick={() => canVote && handleVote(msg.id, idx)}
                                                                disabled={!canVote}
                                                                className={`w-full p-3 rounded-lg border-2 text-left relative z-10 transition-all ${hasVoted ? 'cursor-default' : 'hover:border-amber-500 cursor-pointer'
                                                                    } ${isWinner ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-body text-sm flex items-center gap-2">
                                                                        {opt.text}
                                                                        {isWinner && <CheckCircle2 size={14} className="text-green-500" />}
                                                                    </span>
                                                                    {(hasVoted || isExpired) && (
                                                                        <span className="font-pixel text-[10px] opacity-70">{percentage}%</span>
                                                                    )}
                                                                </div>

                                                                {(hasVoted || isExpired) && (
                                                                    <div className="absolute inset-0 bg-amber-500/10 pointer-events-none transition-all" style={{ width: `${percentage}%` }} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 flex justify-between items-center text-[8px] font-pixel opacity-50 uppercase">
                                                <span>BY {msg.senderName}</span>
                                                <span>{totalVotes} VOTES</span>
                                            </div>

                                            {/* Creator controls for simulation */}
                                            {!msg.pollData.resolved && isExpired && msg.senderId === userId && (
                                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-600 flex gap-2 overflow-x-auto pb-2">
                                                    {msg.pollData.options.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => resolvePoll(msg.id, idx)}
                                                            className="whitespace-nowrap bg-success text-white px-2 py-1 rounded text-[8px] font-pixel border-b-2 border-green-800"
                                                        >
                                                            WIN: OPT {idx + 1}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            }

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-[10px] font-pixel text-wood-light dark:text-gray-400">
                                                {msg.senderName}
                                            </span>
                                            {msg.rank !== undefined && (
                                                <div className="bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded text-[8px] font-pixel border border-amber-500/30">
                                                    RANK {msg.rank}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`px-4 py-2 rounded-xl border-2 shadow-pixel ${isMe
                                                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 rounded-tr-none'
                                                : 'bg-white dark:bg-gray-700 border-wood-light/30 dark:border-gray-600 rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm md:text-base break-words font-body">{msg.text}</p>
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
                            placeholder="Share your trade signal..."
                            className={`flex-1 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 font-medium transition-colors border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-wood-dark/30 text-coffee'
                                }`}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-amber-500 text-white px-4 rounded-xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
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
