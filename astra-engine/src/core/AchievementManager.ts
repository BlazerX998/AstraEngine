import { Logger } from './Logger';
import { CloudService } from '../Network/CloudServices';
import { PlayerProfileManager } from './PlayerProfileManager';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  date?: number;
}

export class AchievementManager {
  private static list: Achievement[] = [];

  static init() {
    CloudService.onMessage(msg => {
      if (msg.type === 'achievement') {
        Logger.info(`☁️ Received achievement sync`);
        this.list = msg.payload;
      }
    });

    const stored = localStorage.getItem('astra_achievements');
    if (stored) this.list = JSON.parse(stored);
  }

  static getAll(): Achievement[] {
    return this.list;
  }

  static unlock(id: string): void {
    const ach = this.list.find(a => a.id === id);
    if (!ach) {
      Logger.warn(`Achievement ${id} not found.`);
      return;
    }
    if (ach.unlocked) return;

    ach.unlocked = true;
    ach.date = Date.now();

    const player = PlayerProfileManager.getActive();
    if (player) {
      PlayerProfileManager.addXP(ach.xp);
      PlayerProfileManager.unlockAchievement(id);
    }

    this.persist();
    CloudService.send({ type: 'achievement', payload: ach });
    Logger.info(`🏆 Unlocked: ${ach.title}`);
    this.showToast(ach.title, ach.description);
  }

  private static showToast(title: string, desc: string) {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#0f0',
      color: '#000',
      padding: '10px 15px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      zIndex: '9999',
      boxShadow: '0 0 10px #0f05',
      animation: 'slideIn 0.4s ease-out'
    });
    box.innerHTML = `<b>🏆 ${title}</b><br><small>${desc}</small>`;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4000);
  }

  private static persist() {
    localStorage.setItem('astra_achievements', JSON.stringify(this.list));
  }
}
