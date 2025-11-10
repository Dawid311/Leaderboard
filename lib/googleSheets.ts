import { google } from 'googleapis';
import { LeaderboardEntry, StartExp } from '../types';

export class GoogleSheetsService {
  private credentials: any;
  private sheetId: string;

  constructor() {
    this.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
    this.sheetId = process.env.GOOGLE_SHEET_ID!;
  }

  async getLeaderboardData(startExp?: StartExp[]): Promise<LeaderboardEntry[]> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: this.credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      });

      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Globaluser!A:H', // Globaluser Sheet, Spalten A bis H
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        return [];
      }

      // Skip header row
      const dataRows = rows.slice(1);
      
      const validEntries: LeaderboardEntry[] = [];
      
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const currentExpTotal = parseFloat(row[7]); // Spalte H (ExpTotal)
        
        // Skip rows without valid ExpTotal
        if (!isNaN(currentExpTotal) && currentExpTotal > 0) {
          const instagram = row[0] || undefined;
          const tiktok = row[1] || undefined;
          const facebook = row[2] || undefined;

          // Finde den Start-EXP-Wert für diesen User
          let startValue = 0;
          if (startExp) {
            const startEntry = startExp.find(entry => 
              (entry.instagram && entry.instagram === instagram) ||
              (entry.tiktok && entry.tiktok === tiktok) ||
              (entry.facebook && entry.facebook === facebook)
            );
            if (startEntry) {
              startValue = startEntry.expTotal;
            }
          }

          // Berechne die Differenz zwischen aktuellem EXP und Start-EXP
          const expTotal = currentExpTotal - startValue;

          validEntries.push({
            instagram,
            tiktok,
            facebook,
            expTotal: expTotal > 0 ? expTotal : 0, // Verhindere negative Werte
            rank: 0, // Will be set after sorting
          });
        }
      }
      
      // Sort by ExpTotal (highest first)
      validEntries.sort((a, b) => b.expTotal - a.expTotal);
      
      // Assign ranks
      for (let i = 0; i < validEntries.length; i++) {
        validEntries[i].rank = i + 1;
      }

      return validEntries;
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw new Error('Failed to fetch leaderboard data');
    }
  }
}
