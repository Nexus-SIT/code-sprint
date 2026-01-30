export interface UserDoc {
  name: string;
  balance: number;
  totalProfit: number;
  xp: number;
  rankScore: number;
  completedRooms?: string[];
  createdAt: any; // Firestore Timestamp
}
