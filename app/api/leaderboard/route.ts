import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '../../../lib/googleSheets';
import { DemoSheetsService } from '../../../lib/demoSheetsService';
import { PrizeService } from '../../../lib/prizeService';
import { TimerService } from '../../../lib/timerService';
import { LeaderboardData, Prize, TimerSettings } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Erstelle frische Instanzen für jeden Request ohne Cache
    const prizeService = new PrizeService();
    const timerService = new TimerService();

    // Handle spezifische Aktionen
    if (action === 'prizes') {
      const prizes = await prizeService.getPrizes();
      return NextResponse.json(prizes);
    }

    if (action === 'timer') {
      const timer = await timerService.getTimer();
      return NextResponse.json(timer);
    }

    // Standard: Komplette Leaderboard-Daten
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

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter required' },
        { status: 400 }
      );
    }

    const prizeService = new PrizeService();
    const timerService = new TimerService();

    if (action === 'prizes') {
      const prizes: Prize[] = await request.json();
      
      // Validiere Preise
      if (!Array.isArray(prizes)) {
        return NextResponse.json(
          { error: 'Prizes must be an array' },
          { status: 400 }
        );
      }

      for (const prize of prizes) {
        if (!prize.position || !prize.description || !prize.value) {
          return NextResponse.json(
            { error: 'Each prize must have position, description, and value' },
            { status: 400 }
          );
        }
      }

      await prizeService.updatePrizes(prizes);
      return NextResponse.json({ success: true });
    }

    if (action === 'timer') {
      const timerData: TimerSettings = await request.json();
      
      // Validiere Timer
      if (!timerData.title || !timerData.description || !timerData.endDate || typeof timerData.isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'Timer must have title, description, endDate and isActive status' },
          { status: 400 }
        );
      }

      // Stelle sicher, dass alle erforderlichen Felder vorhanden sind
      const validatedTimer: TimerSettings = {
        title: timerData.title,
        description: timerData.description,
        endDate: timerData.endDate,
        isActive: timerData.isActive
      };

      await timerService.updateTimer(validatedTimer);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in leaderboard POST API:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}
