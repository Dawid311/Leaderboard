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

export interface StartExp {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  expTotal: number;
}

export interface TimerSettings {
  endDate: string; // ISO Date String
  title: string;
  description: string;
  isActive: boolean;
  contestStartDate?: string; // Wann der aktuelle Contest gestartet wurde
  startExp?: StartExp[]; // Die EXP-Werte zum Zeitpunkt des Contest-Starts
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  prizes: Prize[];
  timer: TimerSettings;
  lastUpdated: string;
}
