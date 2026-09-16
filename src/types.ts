export type TournamentCategory = 'sponsored' | 'rapid' | 'championship' | 'practice';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  prize?: number;
  isUser?: boolean;
  timeAgo?: string;
}

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  category: TournamentCategory;
  entryFee: number; // in Tomans (0 = free / watch ad)
  prizePool: number; // in Tomans
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  participantsCount: number;
  maxParticipants: number;
  endsInSeconds: number;
  badge?: string;
  sponsorName?: string;
  sponsorBanner?: string;
  leaderboard: LeaderboardEntry[];
}

export type TransactionType = 'deposit' | 'payout' | 'entry' | 'win' | 'ad_reward';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface UserWallet {
  balance: number; // In Tomans
  freeTickets: number; // Can be used for free entry
  totalWinnings: number;
  tournamentsPlayed: number;
  bestScore: number;
  username: string;
  avatar: string;
  transactions: Transaction[];
}

export type TargetType = 'regular' | 'gold' | 'freeze' | 'hazard';

export interface Target {
  id: string;
  x: number; // % 10 - 90
  y: number; // % 15 - 85
  type: TargetType;
  points: number;
  durationMs: number;
  createdAt: number;
  size: number;
}

export interface FloatingScore {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  combo?: number;
}

export type ActiveTab = 'tournaments' | 'game' | 'leaderboard' | 'wallet';
