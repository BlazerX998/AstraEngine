import { SessionManager } from './SessionManager';
import { ModeManager } from './ModeManager';
import { Logger } from './Logger';
import { PlayerProfileManager } from './PlayerProfileManager';
import { AchievementManager } from './AchievementManager';

export class GameRuntimeController {
  private static instance: GameRuntimeController;
  private modeManager: ModeManager;
  private overlayEl: HTMLDivElement | null = null;
  private fps = 0;
  private lastFrame = performance.now();
  private paused = false;

  private constructor() {
    this.modeManager = ModeManager.getInstance();
    this.createOverlay();
    this.bindInputs();
    this.loadState();
    this.startFPSCounter();
    AchievementManager.unlock('first_launch');
  }

  static getInstance() { return this.instance ??= new GameRuntimeController(); }

  private createOverlay(): void {
    const player = PlayerProfileManager.getActive();
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:'fixed',top:'10px',right:'10px',
      color:'#0f0',background:'rgba(0,0,0,0.4)',
      fontFamily:'monospace',fontSize:'12px',
      padding:'8px 10px',borderRadius:'8px',zIndex:'9999'
    });
    overlay.innerHTML = `
      <div>🧩 AstraEngine Runtime</div>
      <div>Player: <b>${player?.name || 'Guest'}</b></div>
      <div>Mode: <b>engine</b></div>
      <div>Status: <b>Running</b></div>
      <div>FPS: <b>0</b></div>
      <div style="margin-top:4px;opacity:0.8">[M] Switch Mode  [P] Pause/Resume  [G] Menu</div>
    `;
    document.body.appendChild(overlay);
    this.overlayEl = overlay;
  }

  private bindInputs(): void {
    window.addEventListener('keydown', async e => {
      switch (e.key.toLowerCase()) {
        case 'm': await this.modeManager.switchMode(this.modeManager.getCurrentMode()==='engine'?'platform':'engine'); break;
        case 'p': this.paused = !this.paused; break;
        case 'g': import('../ui/GameMenu').then(m => m.GameMenu.getInstance().toggleVisible()); break;
        case 'r': SessionManager.clear(); break;
      }
    });
  }

  private startFPSCounter(): void {
    const loop = (t: number) => {
      const delta = t - this.lastFrame;
      this.lastFrame = t;
      this.fps = 1000 / delta;
      const el = this.overlayEl?.querySelector('div:nth-child(5) b');
      if (el) el.textContent = this.fps.toFixed(0);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private async loadState() {
    const saved = SessionManager.load();
    if (saved) await this.modeManager.switchMode(saved.mode);
  }
}
