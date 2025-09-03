import { Prize } from '../types';
import { put, head } from '@vercel/blob';

const PRIZES_BLOB_KEY = 'prizes.json';

export class PrizeService {
  async getPrizes(): Promise<Prize[]> {
    try {
      // Versuche Daten aus Vercel Blob zu laden
      const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN ? 'https://blob.vercel-storage.com' : ''}/prizes.json`);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      // Falls Blob nicht verfügbar, verwende Default-Preise
      return this.getDefaultPrizes();
    } catch (error) {
      console.log('Blob nicht verfügbar, verwende Default-Preise');
      return this.getDefaultPrizes();
    }
  }

  async updatePrizes(prizes: Prize[]): Promise<void> {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        // Im lokalen Development-Modus: Speichere in lokaler Datei
        const fs = await import('fs/promises');
        const path = await import('path');
        
        const PRIZES_FILE = path.join(process.cwd(), 'data', 'prizes.json');
        await fs.mkdir(path.dirname(PRIZES_FILE), { recursive: true });
        await fs.writeFile(PRIZES_FILE, JSON.stringify(prizes, null, 2));
        return;
      }

      // In Produktion: Speichere in Vercel Blob
      const blob = await put(PRIZES_BLOB_KEY, JSON.stringify(prizes, null, 2), {
        access: 'public',
        contentType: 'application/json',
      });

      console.log('Preise erfolgreich in Vercel Blob gespeichert:', blob.url);
    } catch (error) {
      console.error('Error updating prizes:', error);
      throw new Error('Failed to update prizes');
    }
  }

  private getDefaultPrizes(): Prize[] {
    return [
      { position: 1, description: '1. Platz', value: '1000€' },
      { position: 2, description: '2. Platz', value: '500€' },
      { position: 3, description: '3. Platz', value: '250€' },
    ];
  }
}
