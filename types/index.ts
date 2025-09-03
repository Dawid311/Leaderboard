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

export interface TimerSettings {
  endDate: string; // ISO Date String
  title: string;
  description: string;
  isActive: boolean;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  prizes: Prize[];
  timer: TimerSettings;
  lastUpdated: string;
}
