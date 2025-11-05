import { ModeManager } from '../core/ModeManager';
import { GameMenu } from './GameMenu';

export class InGameOverlay {
  private static box: HTMLDivElement | null = null;

  /** Initialize the ESC key handler */
  static init() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.toggle();
    });
  }

  /** Toggle visibility of overlay */
  private static toggle() {
    if (!this.box) {
      this.create();
    }

    const box = this.box as HTMLDivElement; // ✅ Type-safe reference
    const visible = box.style.display === 'flex';
    box.style.display = visible ? 'none' : 'flex';
  }

  /** Create overlay UI */
  private static create() {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      inset: '0',
      display: 'none', // start hidden
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      fontFamily: 'monospace',
      zIndex: '10000',
      transition: 'opacity 0.25s ease-in-out'
    });

    const title = document.createElement('h2');
    title.textContent = '⏸ Game Paused';
    Object.assign(title.style, { marginBottom: '20px', color: '#0f0' });
    box.appendChild(title);

    const resume = this.makeBtn('▶️ Resume', () => (box.style.display = 'none'));
    const menu = this.makeBtn('🏠 Main Menu', () => {
      box.style.display = 'none';
      ModeManager.getInstance().unloadExternalGame();
      GameMenu.getInstance().show();
    });
    const exit = this.makeBtn('❌ Quit Game', () => window.location.reload());

    box.append(resume, menu, exit);
    document.body.appendChild(box);
    this.box = box;
  }

  /** Helper to create styled buttons */
  private static makeBtn(label: string, fn: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      background: '#000',
      color: '#0f0',
      border: '1px solid #0f0',
      padding: '10px 20px',
      borderRadius: '8px',
      margin: '6px',
      cursor: 'pointer',
      fontFamily: 'monospace',
      fontSize: '15px'
    });
    btn.onclick = fn;
    btn.onmouseenter = () => {
      btn.style.background = '#0f0';
      btn.style.color = '#000';
    };
    btn.onmouseleave = () => {
      btn.style.background = '#000';
      btn.style.color = '#0f0';
    };
    return btn;
  }
}
