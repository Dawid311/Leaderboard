import { Prize } from '../types';

export class PrizeService {
  private isProduction = process.env.NODE_ENV === 'production';
  private hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async getPrizes(): Promise<Prize[]> {
    try {
      if (this.hasBlob && this.isProduction) {
        // Versuche von Vercel Blob zu laden (nur in Produktion)
        const { list } = await import('@vercel/blob');
        const blobs = await list({ prefix: 'prizes' });
        
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
          const PRIZES_FILE = path.join(process.cwd(), 'data', 'prizes.json');
          const data = await fs.readFile(PRIZES_FILE, 'utf-8');
          return JSON.parse(data);
        } catch (fileError) {
          console.log('Lokale Preise-Datei nicht gefunden, verwende Default-Preise');
        }
      }
      
      // Fallback zu Default-Preisen
      return this.getDefaultPrizes();
    } catch (error) {
      console.log('Fehler beim Laden der Preise, verwende Default-Preise:', error instanceof Error ? error.message : String(error));
      return this.getDefaultPrizes();
    }
  }

  async updatePrizes(prizes: Prize[]): Promise<void> {
    try {
      if (this.hasBlob && this.isProduction) {
        // Versuche in Vercel Blob zu speichern (nur in Produktion)
        try {
          const { put } = await import('@vercel/blob');
          const blob = await put('prizes.json', JSON.stringify(prizes, null, 2), {
            access: 'public',
            contentType: 'application/json',
          });
          console.log('Preise erfolgreich in Vercel Blob gespeichert:', blob.url);
          return;
        } catch (blobError) {
          console.error('Vercel Blob Fehler:', blobError);
          // Kein Fallback mehr - Fehler werfen
          throw new Error('Vercel Blob ist nicht verfügbar');
        }
      } else {
        // Lokale Entwicklung: Speichere in Datei
        const fs = await import('fs/promises');
        const path = await import('path');
        const PRIZES_FILE = path.join(process.cwd(), 'data', 'prizes.json');
        await fs.mkdir(path.dirname(PRIZES_FILE), { recursive: true });
        await fs.writeFile(PRIZES_FILE, JSON.stringify(prizes, null, 2));
        console.log('Preise lokal gespeichert in:', PRIZES_FILE);
      }
    } catch (error) {
      console.error('Error updating prizes:', error);
      throw new Error('Failed to update prizes: ' + (error instanceof Error ? error.message : String(error)));
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
