import { AchievementManager } from '../core/AchievementManager';
import { PlayerProfileManager } from '../core/PlayerProfileManager';

export class AchievementOverlay {
  static show() {
    const player = PlayerProfileManager.getActive();
    const list = AchievementManager.getAll();

    let el = document.getElementById('achievements');
    if (!el) {
      el = document.createElement('div');
      el.id = 'achievements';
      Object.assign(el.style, {
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,0.9)',
        color: '#0f0',
        fontFamily: 'monospace',
        overflowY: 'auto',
        zIndex: '9999',
        padding: '40px',
        display: 'none'
      });
      document.body.appendChild(el);
    }

    const xp = player?.xp || 0;
    const level = Math.floor(xp / 100);
    el.innerHTML = `
      <h2>🎖️ Player Achievements</h2>
      <div>XP: <b>${xp}</b> — Level <b>${level}</b></div>
      <hr>
      ${list
        .map(a => `
          <div style="margin:10px 0;opacity:${a.unlocked ? 1 : 0.4}">
            <b>${a.title}</b><br>
            <small>${a.description}</small><br>
            <span style="color:#888">+${a.xp} XP</span>
          </div>
        `)
        .join('')}
      <hr>
      <button id="closeAchBtn" style="background:#0f0;color:#000;padding:8px 12px;border:none;border-radius:5px;cursor:pointer">Close</button>
    `;

    el.style.display = 'block';
    document.getElementById('closeAchBtn')?.addEventListener('click', () => {
      el!.style.display = 'none';
    });
  }
}
