import { GameHub } from './GameHub';
import { ProfilePanel } from './ProfilePanel';
import { ModeManager } from '../core/ModeManager';
import { Logger } from '../core/Logger';

export class Dashboard {
  private static dashEl: HTMLDivElement | null = null;

  static init() {
    if (this.dashEl) return;

    const el = document.createElement('div');
    el.id = 'dashboard';
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      background: 'radial-gradient(circle at top, #0f0 0%, #000 80%)',
      color: '#000',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999'
    });

    const title = document.createElement('h1');
    title.textContent = '✨ AstraEngine';
    title.style.fontSize = '36px';
    title.style.textShadow = '0 0 20px #0f0';
    el.appendChild(title);

    const btnWrap = document.createElement('div');
    Object.assign(btnWrap.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginTop: '20px'
    });

    btnWrap.appendChild(this.createButton('🎮 Play Games', () => this.launchHub()));
    btnWrap.appendChild(this.createButton('🧩 Switch Mode', async () => this.toggleMode()));
    btnWrap.appendChild(this.createButton('🏆 Achievements', () => this.showAchievements()));
    btnWrap.appendChild(this.createButton('⚙️ Settings', () => this.showSettings()));
    btnWrap.appendChild(this.createButton('🚪 Exit', () => window.close?.()));

    el.appendChild(btnWrap);
    document.body.appendChild(el);
    this.dashEl = el;

    ProfilePanel.init();
  }

  private static createButton(label: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      background: '#000',
      color: '#0f0',
      border: '1px solid #0f0',
      borderRadius: '6px',
      fontSize: '16px',
      padding: '8px 16px',
      cursor: 'pointer',
      minWidth: '180px'
    });
    btn.onmouseenter = () => ((btn.style.background = '#0f0'), (btn.style.color = '#000'));
    btn.onmouseleave = () => ((btn.style.background = '#000'), (btn.style.color = '#0f0'));
    btn.onclick = onClick;
    return btn;
  }

  private static launchHub() {
    if (this.dashEl) this.dashEl.style.display = 'none';
    GameHub.show();
  }

  private static async toggleMode() {
    const manager = ModeManager.getInstance();
    const current = manager.getCurrentMode();
    const next = current === 'engine' ? 'platform' : 'engine';
    Logger.info(`Switching mode → ${next}`);
    await manager.switchMode(next);
  }

  private static showAchievements() {
    import('./AchievementOverlay').then(m => m.AchievementOverlay.show());
  }

  private static showSettings() {
    import('./SettingsPanel').then(m => m.SettingsPanel.show());
  }
}
