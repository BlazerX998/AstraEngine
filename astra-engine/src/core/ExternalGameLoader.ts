// src/core/ExternalGameLoader.ts
import { Logger } from './Logger';
import { GameSandbox } from './GameSandbox';

/**
 * ExternalGameLoader dynamically loads, displays and unloads
 * external HTML5 / WebGL games into an iframe container.
 */
export class ExternalGameLoader {
  private iframe: HTMLIFrameElement | null = null;
  private sandbox: GameSandbox | null = null;
  private currentURL: string | null = null;

  /** Load a new external game into an iframe */
  load(url: string): void {
    Logger.info(`Loading external game: ${url}`);
    this.unload(); // remove any existing instance first

    this.iframe = document.createElement('iframe');
    this.iframe.src = url;
    this.iframe.style.position = 'absolute';
    this.iframe.style.top = '0';
    this.iframe.style.left = '0';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.allow = 'autoplay; fullscreen; gamepad; cross-origin-isolated';

    document.body.appendChild(this.iframe);
    this.currentURL = url;

    // set up sandbox messaging
    this.sandbox = new GameSandbox(this.iframe);
    this.sandbox.listen();

    Logger.info(`✅ Game loaded at ${url}`);
  }

  /** Unload the current game and free memory */
  unload(): void {
    if (this.iframe) {
      Logger.info(`Unloading external game: ${this.currentURL}`);
      this.sandbox?.dispose();
      this.sandbox = null;

      if (this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      this.iframe = null;
      this.currentURL = null;
    }
  }

  /** Send a message to the loaded game (if it supports postMessage) */
  sendMessage(message: Record<string, any>): void {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
      Logger.debug('📨 Sent message to external game:', message);
    }
  }

  /** Used internally when AstraEngine changes modes */
  pause(): void {
    this.sendMessage({ type: 'ASTRA_PAUSE' });
  }

  resume(): void {
    this.sendMessage({ type: 'ASTRA_RESUME' });
  }
}
