import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../lib/googleSheets';
import { DemoSheetsService } from '../../../lib/demoSheetsService';
import { PrizeService } from '../../../lib/prizeService';
import { TimerService } from '../../../lib/timerService';
import { LeaderboardData } from '../../../types';

export async function GET() {
  try {
    // Verwende Demo-Service wenn keine Service Account-Keys gesetzt sind
    const useDemo = !process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEET_ID;
    
    let entries;
    if (useDemo) {
      const demoService = new DemoSheetsService();
      entries = await demoService.getLeaderboardData();
    } else {
      const googleSheetsService = new GoogleSheetsService();
      entries = await googleSheetsService.getLeaderboardData();
    }

    // Erstelle frische Instanzen für jeden Request ohne Cache
    const prizeService = new PrizeService();
    const timerService = new TimerService();

    const [prizes, timer] = await Promise.all([
      prizeService.getPrizes(),
      timerService.getTimer(),
    ]);

    const leaderboardData: LeaderboardData = {
      entries,
      prizes,
      timer,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
