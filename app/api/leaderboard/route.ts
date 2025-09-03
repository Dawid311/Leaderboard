import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../lib/googleSheets';
import { DemoSheetsService } from '../../../lib/demoSheetsService';
import { PrizeService } from '../../../lib/prizeService';
import { LeaderboardData } from '../../../types';

const prizeService = new PrizeService();

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

    const prizes = await prizeService.getPrizes();

    const leaderboardData: LeaderboardData = {
      entries,
      prizes,
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
