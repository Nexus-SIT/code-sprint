export interface UserDoc {
  name: string;
  balance: number;
  totalProfit: number;
  xp: number;
  rankScore: number;
  createdAt: any; // Firestore Timestamp
}
