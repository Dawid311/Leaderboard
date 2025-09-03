import { NextRequest, NextResponse } from 'next/server';
import { TimerService } from '../../../lib/timerService';
import { TimerSettings } from '../../../types';

const timerService = new TimerService();

export async function GET() {
  try {
    const timer = await timerService.getTimer();
    return NextResponse.json(timer);
  } catch (error) {
    console.error('Error fetching timer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const timer: TimerSettings = await request.json();
    
    // Validate timer data
    if (typeof timer.endDate !== 'string' || 
        typeof timer.title !== 'string' || 
        typeof timer.description !== 'string' ||
        typeof timer.isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid timer format' },
        { status: 400 }
      );
    }

    // Validate date
    const endDate = new Date(timer.endDate);
    if (isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid end date' },
        { status: 400 }
      );
    }

    await timerService.updateTimer(timer);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating timer:', error);
    return NextResponse.json(
      { error: 'Failed to update timer' },
      { status: 500 }
    );
  }
}
