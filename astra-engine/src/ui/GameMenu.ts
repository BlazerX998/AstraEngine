import { ModeManager } from '../core/ModeManager';
import { GameHub } from './GameHub';
import { AchievementOverlay } from './AchievementOverlay';

export class GameMenu {
  private static instance: GameMenu;
  private container: HTMLDivElement | null = null;

  static getInstance(): GameMenu {
    return this.instance ??= new GameMenu();
  }

  show(): void {
    if (this.container) {
      this.container.style.display = 'flex';
      return;
    }

    const c = document.createElement('div');
    Object.assign(c.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'radial-gradient(circle, #00ff00 30%, #002000 100%)',
      color: '#000',
      fontFamily: 'monospace',
      zIndex: '9999',
      gap: '15px'
    });

    const title = document.createElement('h1');
    title.textContent = '✨ AstraEngine';
    c.appendChild(title);

    const playBtn = this.makeButton('🎮 Play Games', () => {
      this.hide();
      GameHub.show();
    });

    const switchBtn = this.makeButton('🌀 Switch Mode', async () => {
      const modeManager = ModeManager.getInstance();
      const newMode = modeManager.getCurrentMode() === 'engine' ? 'platform' : 'engine';
      await modeManager.switchMode(newMode);
      alert(`Switched to ${newMode} mode!`);
    });

    const achievementsBtn = this.makeButton('🏆 Achievements', () => {
      this.hide();
      AchievementOverlay.show();
    });

    const settingsBtn = this.makeButton('⚙️ Settings', () => {
      alert('Settings not implemented yet.');
    });

    const exitBtn = this.makeButton('🚪 Exit', () => {
      if (confirm('Exit AstraEngine?')) window.location.reload();
    });

    c.append(playBtn, switchBtn, achievementsBtn, settingsBtn, exitBtn);
    document.body.appendChild(c);
    this.container = c;
  }

  hide(): void {
    if (this.container) this.container.style.display = 'none';
  }

  toggleVisible(): void {
    if (!this.container) return this.show();
    this.container.style.display = this.container.style.display === 'none' ? 'flex' : 'none';
  }

  private makeButton(text: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    Object.assign(btn.style, {
      padding: '10px 20px',
      background: '#000',
      color: '#0f0',
      border: '2px solid #0f0',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '200px',
      fontSize: '15px'
    });
    btn.textContent = text;
    btn.onclick = onClick;
    btn.onmouseenter = () => (btn.style.background = '#0f0', btn.style.color = '#000');
    btn.onmouseleave = () => (btn.style.background = '#000', btn.style.color = '#0f0');
    return btn;
  }
}
