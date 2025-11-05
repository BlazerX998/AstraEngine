import { MatchmakingService } from '../Network/MatchmakingServices';
import { LeaderboardManager } from '../core/LeaderboardManager';

export class MatchmakingOverlay {
  static init() {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.6)',
      color: '#0f0',
      padding: '8px',
      fontFamily: 'monospace',
      borderRadius: '8px',
      zIndex: '9999'
    });

    const findBtn = document.createElement('button');
    findBtn.textContent = '🎯 Find Match';
    findBtn.onclick = () => MatchmakingService.findMatch();
    styleBtn(findBtn);

    const leaveBtn = document.createElement('button');
    leaveBtn.textContent = '🚪 Leave Match';
    leaveBtn.onclick = () => MatchmakingService.leaveMatch();
    styleBtn(leaveBtn);

    const scoreBtn = document.createElement('button');
    scoreBtn.textContent = '🏆 Submit Random Score';
    scoreBtn.onclick = () => LeaderboardManager.submitScore(Math.floor(Math.random() * 500));
    styleBtn(scoreBtn);

    box.append(findBtn, leaveBtn, scoreBtn);
    document.body.appendChild(box);

    MatchmakingService.onMatchFound(match => {
      alert(`✅ Match found!\nRoom: ${match.roomId}\nPlayers: ${match.players.join(', ')}`);
    });
  }
}

function styleBtn(btn: HTMLButtonElement) {
  Object.assign(btn.style, {
    display: 'block',
    width: '100%',
    margin: '4px 0',
    background: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    borderRadius: '4px',
    cursor: 'pointer'
  });
  btn.onmouseenter = () => (btn.style.background = '#0f0', btn.style.color = '#000');
  btn.onmouseleave = () => (btn.style.background = '#000', btn.style.color = '#0f0');
}
