import { Prize } from '../types';
import fs from 'fs/promises';
import path from 'path';

const PRIZES_FILE = path.join(process.cwd(), 'data', 'prizes.json');

export class PrizeService {
  async getPrizes(): Promise<Prize[]> {
    try {
      const data = await fs.readFile(PRIZES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Return default prizes if file doesn't exist
      return this.getDefaultPrizes();
    }
  }

  async updatePrizes(prizes: Prize[]): Promise<void> {
    try {
      // Ensure data directory exists
      await fs.mkdir(path.dirname(PRIZES_FILE), { recursive: true });
      await fs.writeFile(PRIZES_FILE, JSON.stringify(prizes, null, 2));
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
