import { GameRegistry } from '../core/GameRegistry';
import { ModeManager } from '../core/ModeManager';
import { LoadingOverlay } from './LoadingOverlay';
import { SaveSlotOverlay } from './SaveSlotOverlay';
import { SaveSlotManager } from '../core/SaveSlotManager';
import { GameMenu } from './GameMenu';
import { Logger } from '../core/Logger';

export class GameHub {
  private static hubEl: HTMLDivElement | null = null;
  private static backBtn: HTMLButtonElement | null = null;

  static show(): void {
    if (this.hubEl) {
      this.hubEl.style.display = 'grid';
      if (this.backBtn) this.backBtn.style.display = 'block';
      return;
    }

    const hub = document.createElement('div');
    Object.assign(hub.style, {
      position: 'fixed',
      inset: '0',
      background: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '20px',
      padding: '40px',
      overflowY: 'auto',
      zIndex: '9999'
    });

    const backBtn = document.createElement('button');
    Object.assign(backBtn.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      padding: '8px 14px',
      background: '#000',
      color: '#0f0',
      border: '1px solid #0f0',
      borderRadius: '6px',
      cursor: 'pointer',
      zIndex: '10000'
    });
    backBtn.textContent = '⬅ Back to Menu';
    backBtn.onclick = () => this.returnToMenu();
    document.body.appendChild(backBtn);
    this.backBtn = backBtn;

    for (const game of GameRegistry.getAll()) {
      const card = document.createElement('div');
      Object.assign(card.style, {
        border: '1px solid #0f0',
        borderRadius: '10px',
        background: '#111',
        overflow: 'hidden',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out'
      });

      card.innerHTML = `
        <img src="${game.thumbnail || 'assets/placeholder.png'}"
             style="width:100%;height:140px;object-fit:cover;border-bottom:1px solid #0f0;">
        <div style="padding:10px">
          <b>${game.title}</b><br>
          <small>${game.mode.toUpperCase()}</small><br>
          <span style="font-size:11px;opacity:0.8">${game.description || ''}</span>
        </div>`;
      card.onmouseenter = () => (card.style.transform = 'scale(1.05)');
      card.onmouseleave = () => (card.style.transform = 'scale(1)');
      card.onclick = () => this.launchGame(game.id);
      hub.appendChild(card);
    }

    document.body.appendChild(hub);
    this.hubEl = hub;
  }

  private static returnToMenu(): void {
    if (this.hubEl) this.hubEl.style.display = 'none';
    if (this.backBtn) this.backBtn.style.display = 'none';
    GameMenu.getInstance().show();
  }

  static async launchGame(id: string): Promise<void> {
    const game = GameRegistry.getById(id);
    if (!game) return;

    Logger.info(`🎮 Launching ${game.title}...`);
    LoadingOverlay.show();

    // Hide hub + menu to prevent overlay blocking
    if (this.hubEl) this.hubEl.style.display = 'none';
    if (this.backBtn) this.backBtn.style.display = 'none';
    GameMenu.getInstance().hide();

    SaveSlotOverlay.show(id);
    const lastSave = SaveSlotManager.loadGame(id);
    const modeManager = ModeManager.getInstance();

    try {
      if (game.mode === 'platform' && game.url) {
        await modeManager.loadExternalGame(game.url);
      } else {
        await modeManager.switchMode('engine');
      }

      if (lastSave) Logger.info(`🔁 Restored save: ${JSON.stringify(lastSave.data)}`);
    } catch (err) {
      Logger.error('❌ Failed to launch game:', err);
      alert(`Error loading ${game.title}`);
    } finally {
      LoadingOverlay.hide();
    }
  }
}
