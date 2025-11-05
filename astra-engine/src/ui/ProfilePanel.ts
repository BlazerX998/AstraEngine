import { PlayerProfileManager } from '../core/PlayerProfileManager';
import { AchievementOverlay } from './AchievementOverlay';

export class ProfilePanel {
  static init() {
    const player = PlayerProfileManager.getActive();
    if (!player) return;

    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.6)',
      color: '#0f0',
      padding: '8px',
      fontFamily: 'monospace',
      borderRadius: '8px',
      zIndex: '9999',
      cursor: 'pointer'
    });
    el.innerHTML = `
      👤 <b>${player.name}</b><br>
      XP: ${player.xp || 0}
    `;
    el.onclick = () => AchievementOverlay.show();
    document.body.appendChild(el);
  }
}
