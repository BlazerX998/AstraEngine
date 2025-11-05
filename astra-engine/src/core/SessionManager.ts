import { Logger } from './Logger';

export interface SavedSession {
  mode: 'engine' | 'platform';
  gameId: string;
  timestamp: number;
}

export class SessionManager {
  private static readonly KEY = 'astra_last_session';

  static save(mode: 'engine' | 'platform', gameId: string) {
    const data: SavedSession = { mode, gameId, timestamp: Date.now() };
    localStorage.setItem(this.KEY, JSON.stringify(data));
    Logger.info(`💾 Session saved for ${gameId} (${mode})`);
  }

  static load(): SavedSession | null {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      Logger.error('Failed to parse saved session.');
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(this.KEY);
    Logger.info('🗑️ Session cleared.');
  }
}
