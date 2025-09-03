import { Prize } from '../types';

export class PrizeService {
  private isProduction = process.env.NODE_ENV === 'production';
  private hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async getPrizes(): Promise<Prize[]> {
    console.log('getPrizes called');
    console.log('isProduction:', this.isProduction);
    console.log('hasBlob:', this.hasBlob);
    
    try {
      if (this.hasBlob && this.isProduction) {
        // Versuche direkt die URL zu verwenden
        try {
          const response = await fetch('https://mhpeqgrvzzmrz2fi.public.blob.vercel-storage.com/prizes.json');
          if (response.ok) {
            const data = await response.json();
            console.log('Preise von direkte URL geladen:', data.length, 'Preise');
            return data;
          } else {
            console.log('Prizes blob nicht gefunden, verwende Default');
          }
        } catch (fetchError) {
          console.log('Fetch Error:', fetchError);
          // Fallback: Versuche mit list()
          try {
            const { list } = await import('@vercel/blob');
            const blobs = await list({ prefix: 'prizes.json' });
            
            if (blobs.blobs.length > 0) {
              // Sortiere nach uploadedAt um die neueste Version zu bekommen
              const latestBlob = blobs.blobs.sort((a, b) => 
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
              )[0];
              
              const response = await fetch(latestBlob.url);
              const data = await response.json();
              console.log('Preise von Vercel Blob geladen:', data.length, 'Preise');
              return data;
            }
          } catch (blobError) {
            console.error('Vercel Blob Fehler beim Laden:', blobError);
          }
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
      console.log('Verwende Default-Preise');
      return this.getDefaultPrizes();
    } catch (error) {
      console.log('Fehler beim Laden der Preise, verwende Default-Preise:', error instanceof Error ? error.message : String(error));
      return this.getDefaultPrizes();
    }
  }

  async updatePrizes(prizes: Prize[]): Promise<void> {
    console.log('updatePrizes called with:', prizes.length, 'prizes');
    console.log('isProduction:', this.isProduction);
    console.log('hasBlob:', this.hasBlob);
    
    try {
      if (this.hasBlob && this.isProduction) {
        // Versuche in Vercel Blob zu speichern (nur in Produktion)
        console.log('Attempting to save to Vercel Blob...');
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
          console.error('Blob Error Details:', JSON.stringify(blobError, null, 2));
          throw blobError;
        }
      } else {
        // Lokale Entwicklung: Speichere in Datei
        console.log('Saving locally...');
        const fs = await import('fs/promises');
        const path = await import('path');
        const PRIZES_FILE = path.join(process.cwd(), 'data', 'prizes.json');
        await fs.mkdir(path.dirname(PRIZES_FILE), { recursive: true });
        await fs.writeFile(PRIZES_FILE, JSON.stringify(prizes, null, 2));
        console.log('Preise lokal gespeichert in:', PRIZES_FILE);
      }
    } catch (error) {
      console.error('Error updating prizes:', error);
      console.error('Error Details:', JSON.stringify(error, null, 2));
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
