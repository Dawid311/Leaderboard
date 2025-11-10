import { LeaderboardEntry, StartExp } from '../types';

// Demo-Service für Tests ohne echte Google Sheets API
export class DemoSheetsService {
  async getLeaderboardData(startExp?: StartExp[]): Promise<LeaderboardEntry[]> {
    // Simuliere API-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500));

    // Demo-Daten basierend auf der Tabellenstruktur
    const demoData: LeaderboardEntry[] = [
      {
        instagram: 'influencer_max',
        tiktok: 'max_tiktok',
        facebook: 'Max Mustermann',
        youtube: 'MaxInfluencer',
        expTotal: 2500,
        rank: 1,
      },
      {
        instagram: 'anna_insta',
        tiktok: undefined, // Kein TikTok
        facebook: 'Anna Schmidt',
        youtube: 'AnnaVlogs',
        expTotal: 2100,
        rank: 2,
      },
      {
        instagram: undefined, // Kein Instagram
        tiktok: 'tom_viral',
        facebook: 'Thomas Weber',
        youtube: 'TomGaming',
        expTotal: 1950,
        rank: 3,
      },
      {
        instagram: 'lisa_photos',
        tiktok: 'lisa_dance',
        facebook: undefined, // Kein Facebook
        youtube: 'LisaDance',
        expTotal: 1800,
        rank: 4,
      },
      {
        instagram: 'mike_fitness',
        tiktok: 'mike_workouts',
        facebook: 'Mike Johnson',
        youtube: 'MikeFitness',
        expTotal: 1650,
        rank: 5,
      },
    ];

    if (!startExp) return demoData;

    // Wenn Start-EXP vorhanden sind, berechne die Differenz
    return demoData.map(entry => {
      const startEntry = startExp.find(start => 
        (start.instagram && start.instagram === entry.instagram) ||
        (start.tiktok && start.tiktok === entry.tiktok) ||
        (start.facebook && start.facebook === entry.facebook) ||
        (start.youtube && start.youtube === entry.youtube)
      );

      if (startEntry) {
        return {
          ...entry,
          expTotal: Math.max(0, entry.expTotal - startEntry.expTotal)
        };
      }

      return entry;
    });
  }
}
