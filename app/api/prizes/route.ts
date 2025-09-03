import { NextRequest, NextResponse } from 'next/server';
import { PrizeService } from '../../../lib/prizeService';
import { Prize } from '../../../types';

export async function GET() {
  try {
    const prizeService = new PrizeService();
    const prizes = await prizeService.getPrizes();
    return NextResponse.json(prizes);
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prizes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prizes: Prize[] = await request.json();
    
    // Validate prizes data
    if (!Array.isArray(prizes)) {
      return NextResponse.json(
        { error: 'Invalid prizes data' },
        { status: 400 }
      );
    }

    for (const prize of prizes) {
      if (typeof prize.position !== 'number' || 
          typeof prize.description !== 'string' || 
          typeof prize.value !== 'string') {
        return NextResponse.json(
          { error: 'Invalid prize format' },
          { status: 400 }
        );
      }
    }

    const prizeService = new PrizeService();
    await prizeService.updatePrizes(prizes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating prizes:', error);
    return NextResponse.json(
      { error: 'Failed to update prizes' },
      { status: 500 }
    );
  }
}
