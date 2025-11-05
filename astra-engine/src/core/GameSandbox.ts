import { Logger } from './Logger';

/**
 * GameSandbox handles secure messaging between AstraEngine and
 * external HTML5/WebGL games running inside an iframe.
 */
export class GameSandbox {
  private iframe: HTMLIFrameElement;
  private messageHandler = this.onMessage.bind(this);

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  /** Start listening for messages from the external game */
  listen(): void {
    window.addEventListener('message', this.messageHandler);
    Logger.info('🧩 Sandbox messaging initialized');
  }

  /** Stop listening */
  dispose(): void {
    window.removeEventListener('message', this.messageHandler);
    Logger.info('🧹 Sandbox messaging disposed');
  }

  /** Handle messages received from external game iframe */
  private onMessage(event: MessageEvent): void {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'GAME_READY':
        Logger.info('🎮 External game signaled READY');
        break;
      case 'GAME_PAUSED':
        Logger.info('⏸ External game PAUSED');
        break;
      case 'GAME_RESUMED':
        Logger.info('▶️ External game RESUMED');
        break;
      case 'GAME_OVER':
        Logger.info('💀 External game OVER');
        break;
      default:
        Logger.debug('📩 Unknown message from sandbox:', data);
    }
  }
}