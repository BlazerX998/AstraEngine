import { ExternalGameLoader } from './ExternalGameLoader';
import { Logger } from './Logger';
import { GameMenu } from '../ui/GameMenu';

export type GameMode = 'engine' | 'platform';

export class ModeManager {
  private static instance: ModeManager;
  private currentMode: GameMode = 'engine';
  private externalLoader: ExternalGameLoader | null = null;
  private switching = false;

  static getInstance(): ModeManager {
    return this.instance ??= new ModeManager();
  }

  getCurrentMode(): GameMode {
    return this.currentMode;
  }

  /** Switch between engine and platform. */
  async switchMode(mode: GameMode): Promise<void> {
    if (this.switching) {
      Logger.warn('ModeManager: switch already in progress.');
      return;
    }
    if (this.currentMode === mode) {
      Logger.debug(`ModeManager: already in ${mode}`);
      return;
    }

    this.switching = true;
    Logger.info(`ModeManager: switching ${this.currentMode} -> ${mode}`);

    try {
      if (mode === 'platform') {
        // hide main UI so iframe can be interactive
        GameMenu.getInstance().hide();
        // keep existing external loader or create
        this.externalLoader ??= new ExternalGameLoader();
        // set mode after hiding menu
        this.currentMode = 'platform';
      } else {
        // unload any external game and reveal menu
        await this.unloadExternalGame();
        this.currentMode = 'engine';
        GameMenu.getInstance().show();
      }
      Logger.info(`ModeManager: current mode = ${this.currentMode}`);
    } catch (err) {
      Logger.error('ModeManager.switchMode error', (err as Error).message || err);
    } finally {
      this.switching = false;
    }
  }

  /** Load an external URL into the iframe. */
  async loadExternalGame(url: string): Promise<void> {
    if (!url) {
      Logger.warn('ModeManager.loadExternalGame: no url');
      return;
    }
    Logger.info('ModeManager: loadExternalGame', url);
    // ensure we are in platform mode and menu/hub hidden
    if (!this.externalLoader) this.externalLoader = new ExternalGameLoader();
    await this.switchMode('platform');
    // load is sync in ExternalGameLoader (creates iframe) but keep it awaitable
    try {
      this.externalLoader.load(url);
      Logger.info('ModeManager: external game iframe created');
    } catch (err) {
      Logger.error('ModeManager.loadExternalGame failed', (err as Error).message || err);
      throw err;
    }
  }

  /** Unload external iframe (if any) and switch back to engine */
  async unloadExternalGame(): Promise<void> {
    if (this.externalLoader) {
      try {
        Logger.info('ModeManager: unloading external game');
        this.externalLoader.unload();
      } catch (err) {
        Logger.warn('ModeManager.unloadExternalGame error', (err as Error).message || err);
      } finally {
        this.externalLoader = null;
      }
    }
    this.currentMode = 'engine';
  }
}
