import { PlayerProfileManager } from '../core/PlayerProfileManager';
import { Logger } from '../core/Logger';

export class LoginOverlay {
  static async show(): Promise<void> {
    if (PlayerProfileManager.getActive()) return;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      fontFamily: 'monospace',
      zIndex: '10000'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: '#111',
      padding: '20px 30px',
      borderRadius: '10px',
      textAlign: 'center',
      width: '300px'
    });
    box.innerHTML = `<h3>👾 Welcome to AstraEngine</h3>
      <p>Enter your player name</p>
      <input id="playerName" type="text" placeholder="Player 1" style="width:100%;padding:6px;background:#000;color:#0f0;border:1px solid #0f0;border-radius:5px;text-align:center;"><br><br>
      <button id="startBtn" style="padding:6px 15px;background:#0f0;color:#000;border:none;border-radius:5px;cursor:pointer;">Start</button>`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    return new Promise(resolve => {
      box.querySelector('#startBtn')!.addEventListener('click', () => {
        const name = (box.querySelector('#playerName') as HTMLInputElement).value.trim() || 'Player 1';
        PlayerProfileManager.login(name);
        Logger.info(`✅ Logged in as ${name}`);
        overlay.remove();
        resolve();
      });
    });
  }
}
