import { Logger } from '../core/Logger';
import { CloudService } from './CloudServices';
import { PlayerProfileManager } from '../core/PlayerProfileManager';

export interface MatchData {
  roomId: string;
  players: string[];
}

export class MatchmakingService {
  private static queue = false;
  private static room: MatchData | null = null;
  private static listeners: ((match: MatchData) => void)[] = [];

  static init() {
    CloudService.onMessage(msg => {
      if (msg.type === 'match_found') {
        this.room = msg.payload;
        this.queue = false;
        this.listeners.forEach(cb => cb(this.room!));
        Logger.info(`🎯 Match found: ${this.room?.roomId}`);
      }
    });
  }

  static async findMatch(): Promise<void> {
    if (this.queue) return;
    const player = PlayerProfileManager.getActive();
    if (!player) return;

    this.queue = true;
    CloudService.send({ type: 'match_request', payload: { name: player.name } });
    Logger.info('🔍 Searching for match...');
  }

  static leaveMatch() {
    if (this.room) {
      CloudService.send({ type: 'leave_room', payload: this.room.roomId });
      this.room = null;
      Logger.info('🚪 Left match room');
    }
  }

  static onMatchFound(cb: (match: MatchData) => void) {
    this.listeners.push(cb);
  }
}
