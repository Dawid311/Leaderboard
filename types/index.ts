export interface LeaderboardEntry {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  expTotal: number;
  rank: number;
}

export interface Prize {
  position: number;
  description: string;
  value: string;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  prizes: Prize[];
  lastUpdated: string;
}
