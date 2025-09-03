import { google } from 'googleapis';
import { LeaderboardEntry } from '../types';

export class GoogleSheetsService {
  private credentials: any;
  private sheetId: string;

  constructor() {
    this.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
    this.sheetId = process.env.GOOGLE_SHEET_ID!;
  }

  async getLeaderboardData(): Promise<LeaderboardEntry[]> {
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
        const expTotal = parseFloat(row[7]); // Spalte H (ExpTotal)
        
        // Skip rows without valid ExpTotal
        if (!isNaN(expTotal) && expTotal > 0) {
          validEntries.push({
            instagram: row[0] || undefined,  // Spalte A (InstagramUser)
            tiktok: row[1] || undefined,     // Spalte B (TiktokUser)
            facebook: row[2] || undefined,   // Spalte C (FacebookUser)
            expTotal,
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
