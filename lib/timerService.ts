import { TimerSettings } from '../types';

export class TimerService {
  private isProduction = process.env.NODE_ENV === 'production';
  private hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async getTimer(): Promise<TimerSettings> {
    try {
      if (this.hasBlob) {
        // Versuche von Vercel Blob zu laden
        const { list } = await import('@vercel/blob');
        const blobs = await list({ prefix: 'timer' });
        
        if (blobs.blobs.length > 0) {
          const response = await fetch(blobs.blobs[0].url);
          const data = await response.json();
          return data;
        }
      } else if (!this.isProduction) {
        // Lokale Entwicklung: Versuche aus Datei zu laden
        try {
          const fs = await import('fs/promises');
          const path = await import('path');
          const TIMER_FILE = path.join(process.cwd(), 'data', 'timer.json');
          const data = await fs.readFile(TIMER_FILE, 'utf-8');
          return JSON.parse(data);
        } catch (fileError) {
          // Datei existiert nicht, verwende Default
        }
      }
      
      // Fallback zu Default-Timer
      return this.getDefaultTimer();
    } catch (error) {
      console.log('Fehler beim Laden des Timers, verwende Default-Timer:', error instanceof Error ? error.message : String(error));
      return this.getDefaultTimer();
    }
  }

  async updateTimer(timer: TimerSettings): Promise<void> {
    try {
      if (this.hasBlob) {
        // Speichere in Vercel Blob
        const { put } = await import('@vercel/blob');
        const blob = await put('timer.json', JSON.stringify(timer, null, 2), {
          access: 'public',
          contentType: 'application/json',
        });
        console.log('Timer erfolgreich in Vercel Blob gespeichert:', blob.url);
      } else if (!this.isProduction) {
        // Lokale Entwicklung: Speichere in Datei
        const fs = await import('fs/promises');
        const path = await import('path');
        const TIMER_FILE = path.join(process.cwd(), 'data', 'timer.json');
        await fs.mkdir(path.dirname(TIMER_FILE), { recursive: true });
        await fs.writeFile(TIMER_FILE, JSON.stringify(timer, null, 2));
        console.log('Timer lokal gespeichert');
      } else {
        throw new Error('Keine Speichermöglichkeit verfügbar');
      }
    } catch (error) {
      console.error('Error updating timer:', error);
      throw new Error('Failed to update timer: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private getDefaultTimer(): TimerSettings {
    // Standard: 30 Tage ab jetzt
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    return {
      endDate: endDate.toISOString(),
      title: 'Contest endet in:',
      description: 'Preisauszahlung erfolgt nach Ablauf des Timers',
      isActive: true,
    };
  }
}
