import { Logger } from './Logger';
import { PlayerProfileManager } from './PlayerProfileManager';
import { CloudService } from '../Network/CloudServices';

export interface SaveData {
  slot: string;
  gameId: string;
  timestamp: number;
  data: any;
}

/**
 * Handles local and cloud save data per player/game.
 */
export class SaveSlotManager {
  private static saves: SaveData[] = [];

  static init() {
    const stored = localStorage.getItem('astra_saves');
    if (stored) this.saves = JSON.parse(stored);
    Logger.info('💾 SaveSlotManager initialized');
  }

  static getAll(gameId?: string): SaveData[] {
    return gameId ? this.saves.filter(s => s.gameId === gameId) : this.saves;
  }

  static saveGame(gameId: string, slot = 'auto', data: any): void {
    const player = PlayerProfileManager.getActive();
    if (!player) return;

    const entry: SaveData = { slot, gameId, timestamp: Date.now(), data };
    const idx = this.saves.findIndex(s => s.gameId === gameId && s.slot === slot);
    if (idx >= 0) this.saves[idx] = entry;
    else this.saves.push(entry);

    localStorage.setItem('astra_saves', JSON.stringify(this.saves));
    CloudService.send({ type: 'save_upload' as any, payload: entry });
    Logger.info(`💾 Saved slot "${slot}" for ${gameId}`);
  }

  /** ✅ Fix: Added this missing method */
  static loadGame(gameId: string, slot = 'auto'): SaveData | null {
    const save = this.saves.find(s => s.gameId === gameId && s.slot === slot);
    if (save) {
      Logger.info(`📂 Loaded save "${slot}" for ${gameId}`);
      return save;
    }
    Logger.warn(`⚠️ No save found for ${gameId} (${slot})`);
    return null;
  }
}
