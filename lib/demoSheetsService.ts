import { LeaderboardEntry } from '../types';

// Demo-Service für Tests ohne echte Google Sheets API
export class DemoSheetsService {
  async getLeaderboardData(): Promise<LeaderboardEntry[]> {
    // Simuliere API-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500));

    // Demo-Daten basierend auf der Tabellenstruktur
    const demoData: LeaderboardEntry[] = [
      {
        instagram: 'influencer_max',
        tiktok: 'max_tiktok',
        facebook: 'Max Mustermann',
        expTotal: 2500,
        rank: 1,
      },
      {
        instagram: 'anna_insta',
        tiktok: undefined, // Kein TikTok
        facebook: 'Anna Schmidt',
        expTotal: 2100,
        rank: 2,
      },
      {
        instagram: undefined, // Kein Instagram
        tiktok: 'tom_viral',
        facebook: 'Thomas Weber',
        expTotal: 1950,
        rank: 3,
      },
      {
        instagram: 'lisa_photos',
        tiktok: 'lisa_dance',
        facebook: undefined, // Kein Facebook
        expTotal: 1800,
        rank: 4,
      },
      {
        instagram: 'mike_fitness',
        tiktok: 'mike_workouts',
        facebook: 'Mike Johnson',
        expTotal: 1650,
        rank: 5,
      },
    ];

    return demoData;
  }
}
