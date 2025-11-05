import { Logger } from '../core/Logger';
import { PlayerProfile } from '../core/PlayerProfileManager';

export type CloudMessageType =
  | 'profile_sync'
  | 'achievement'
  | 'chat'
  | 'leaderboard_update'
  | 'leaderboard_submit'
  | 'match_found'
  | 'match_request'
  | 'leave_room';

export interface CloudMessage {
  type: CloudMessageType;
  payload: any;
}

export class CloudService {
  private static ws: WebSocket | null = null;
  private static connected = false;
  private static listeners: ((msg: CloudMessage) => void)[] = [];

  static connect(): void {
    if (this.ws && this.connected) return;

    const url = 'wss://echo.websocket.events';
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connected = true;
      Logger.info('☁️ Connected to CloudService');
      this.send({ type: 'profile_sync', payload: 'join' });
    };

    this.ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data);
        this.listeners.forEach(cb => cb(msg));
      } catch {
        Logger.debug(`Cloud message: ${e.data}`);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      Logger.warn('☁️ CloudService disconnected');
      setTimeout(() => this.connect(), 3000);
    };
  }

  static onMessage(cb: (msg: CloudMessage) => void): void {
    this.listeners.push(cb);
  }

  static send(msg: CloudMessage): void {
    if (!this.connected || !this.ws) return;
    this.ws.send(JSON.stringify(msg));
  }

  static syncProfile(profile: PlayerProfile): void {
    this.send({ type: 'profile_sync', payload: profile });
  }
}
