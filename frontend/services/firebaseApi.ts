import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    serverTimestamp,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    where,
    addDoc
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { UserDoc } from '../types/user';
import { LeaderboardEntry } from '../types';

// --- Auth ---

export const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await createUserIfNotExists(cred.user.uid, name);
    return cred.user;
};

export const signInWithEmail = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
};

export const signOutUser = async () => {
    return await signOut(auth);
};

// --- User ---

export const createUserIfNotExists = async (
    userId: string,
    userName: string = 'Trader'
): Promise<UserDoc> => {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        const newUser: UserDoc = {
            name: userName,
            balance: 10000,
            totalProfit: 0,
            xp: 0,
            rankScore: 0,
            createdAt: serverTimestamp(),
        };

        await setDoc(ref, newUser);
        return newUser;
    }

    return snap.data() as UserDoc;
};

// --- Task Completion ---

export const completeTask = async (
    userId: string,
    roomId: string,
    pnl: number,
    isRoomComplete: boolean = false
): Promise<void> => {
    const userRef = doc(db, 'users', userId);

    await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) throw new Error('User not found');

        const user = snap.data() as UserDoc;

        const newBalance = user.balance + pnl;
        // Prevent negative balance from tasks if desired, or allow debt
        // let safeBalance = Math.max(0, newBalance); 

        let newXp = user.xp;
        if (pnl > 0) newXp += 10; // Simple XP for task completion

        // Update completedRooms if room is done
        let newCompletedRooms = user.completedRooms || [];
        if (isRoomComplete && !newCompletedRooms.includes(roomId)) {
            newCompletedRooms = [...newCompletedRooms, roomId];
            newXp += 200; // Bonus for room completion
        }

        tx.update(userRef, {
            balance: newBalance,
            xp: newXp,
            completedRooms: newCompletedRooms,
        });
    });
};

// --- Trading & Sessions ---

export const settleTrade = async (
    userId: string,
    pnl: number,
    tradeDetails: {
        symbol: string;
        position: 'BUY' | 'SELL' | 'HOLD';
        betAmount: number;
        entryPrice: number;
        exitPrice: number;
    }
): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    const tradesRef = collection(userRef, 'trades');

    await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) throw new Error('User not found');

        const user = snap.data() as UserDoc;

        const newBalance = user.balance + pnl;
        if (newBalance < 0) throw new Error('Insufficient balance');

        const newProfit = user.totalProfit + pnl;

        // XP Logic: Win = 100 args, Loss = 10
        const xpGained = pnl > 0 ? 100 : 10;
        const newXp = user.xp + xpGained;

        // Rank Score Logic: Profit + (XP * 0.5)
        const newRankScore = newProfit + (newXp * 0.5);

        // 1. Update User Stats
        tx.update(userRef, {
            balance: newBalance,
            totalProfit: newProfit,
            xp: newXp,
            rankScore: newRankScore,
        });

        // 2. Log Session (Trade)
        // Note: In transactions, write operations must come after reads. 
        // Since 'addDoc' cannot be used directly in transaction, we use tx.set on a new doc ref.
        const newTradeRef = doc(tradesRef);
        tx.set(newTradeRef, {
            ...tradeDetails,
            pnl,
            timestamp: serverTimestamp(),
            balanceAfter: newBalance,
        });
    });
};

// --- Leaderboard ---

export const subscribeToLeaderboard = (
    callback: (entries: LeaderboardEntry[]) => void,
    limitCount: number = 10
) => {
    const q = query(
        collection(db, 'users'),
        orderBy('rankScore', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const entries: LeaderboardEntry[] = [];
        let position = 1;

        snapshot.forEach((doc) => {
            const data = doc.data() as UserDoc;
            entries.push({
                position: position++,
                userId: doc.id,
                username: data.name,
                totalProfit: data.totalProfit,
                rank: Math.floor(data.rankScore / 1000), // Example rank tier logic
                rankName: getRankName(data.rankScore),
                winRate: '0%', // TODO: Calculate if needed
                totalTrades: 0, // TODO: Store in UserDoc if needed
            });
        });

        console.log("Leaderboard entries fetched:", entries.length, entries);
        callback(entries);
    }, (error) => {
        console.error("Leaderboard subscription error:", error);
    });
};

// Helper
const getRankName = (score: number) => {
    if (score < 1000) return 'Novice';
    if (score < 5000) return 'Apprentice';
    if (score < 10000) return 'Expert';
    return 'Master';
};
