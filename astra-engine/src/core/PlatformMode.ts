// src/core/PlatformMode.ts
import { Logger } from './Logger';

/**
 * PlatformMode is responsible for loading and managing
 * external HTML5/WebGL games inside AstraEngine’s environment.
 *
 * It uses an <iframe> sandbox for security and performance isolation.
 */
export class PlatformMode {
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLDivElement | null = null;
  private currentGameUrl: string | null = null;
  private isRunning = false;

  /**
   * Initializes the platform mode.
   * Creates an iframe container but keeps it hidden until a game is loaded.
   */
  async start(): Promise<void> {
    Logger.info('🌐 Starting Platform Mode...');
    this.isRunning = true;

    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      Object.assign(this.container.style, {
        position: 'fixed',
        inset: '0',
        background: '#000',
        zIndex: '1',
        display: 'none',
      });
      document.body.appendChild(this.container);
    }

    window.addEventListener('message', this.handleGameMessage.bind(this));
  }

  /**
   * Loads an external game into the iframe.
   */
  async loadGame(url: string): Promise<void> {
    if (!this.isRunning) {
      Logger.warn('⚠️ PlatformMode is not active. Starting now...');
      await this.start();
    }

    Logger.info(`🎮 Loading external game from: ${url}`);
    this.currentGameUrl = url;

    // Clean up any existing iframe
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }

    // Create the new iframe
    this.iframe = document.createElement('iframe');
    Object.assign(this.iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none',
      background: '#000',
    });

    // Append and load
    this.iframe.src = url;
    this.container!.style.display = 'block';
    this.container!.appendChild(this.iframe);

    // Handle load events
    this.iframe.onload = () => {
      Logger.info(`✅ Game loaded successfully: ${url}`);
      this.postMessage({ type: 'astra_ready', payload: 'Engine connected' });
    };

    this.iframe.onerror = () => {
      Logger.error(`❌ Failed to load game at ${url}`);
    };
  }

  /**
   * Stops platform mode and cleans up iframe.
   */
  async stop(): Promise<void> {
    Logger.info('🧩 Stopping Platform Mode...');
    this.isRunning = false;

    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }

    if (this.container) {
      this.container.style.display = 'none';
    }

    window.removeEventListener('message', this.handleGameMessage.bind(this));
  }

  /**
   * Sends a structured message to the embedded game.
   */
  postMessage(message: any): void {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
      Logger.debug(`📨 Sent message to external game: ${JSON.stringify(message)}`);
    } else {
      Logger.warn('⚠️ No active iframe to post message to.');
    }
  }

  /**
   * Handles messages from the embedded game.
   */
  private handleGameMessage(event: MessageEvent): void {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'game_event':
        Logger.info(`🎯 Game Event Received: ${JSON.stringify(data.payload)}`);
        break;

      case 'chat_message':
        Logger.info(`💬 Chat from Game: ${data.payload}`);
        break;

      case 'achievement_unlock':
        Logger.info(`🏆 Game unlocked achievement: ${data.payload}`);
        break;

      default:
        Logger.debug(`📩 Unknown message from game: ${JSON.stringify(data)}`);
        break;
    }
  }

  /**
   * Pause/resume API for runtime controller integration.
   */
  setPaused(paused: boolean): void {
    this.postMessage({ type: 'astra_pause', payload: paused });
    Logger.info(paused ? '⏸️ Platform game paused' : '▶️ Platform game resumed');
  }
}

