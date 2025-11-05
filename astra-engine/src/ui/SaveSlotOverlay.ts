import { SaveSlotManager } from '../core/SaveSlotManager';
import { GameHub } from './GameHub';

export class SaveSlotOverlay {
  private static box: HTMLDivElement | null = null;
  private static currentGame = '';

  static show(gameId: string) {
    this.currentGame = gameId;
    if (this.box) {
      this.refresh();
      this.box.style.display = 'flex';
      return;
    }

    const b = document.createElement('div');
    Object.assign(b.style, {
      position: 'fixed',
      right: '10px',
      top: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#0f0',
      fontFamily: 'monospace',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      borderRadius: '8px',
      pointerEvents: 'auto', // only click this overlay
    });

    const title = document.createElement('h4');
    title.textContent = `💾 Saves: ${gameId}`;
    title.style.textAlign = 'center';
    b.appendChild(title);

    const list = document.createElement('div');
    list.id = 'slotList';
    b.appendChild(list);

    const create = document.createElement('button');
    create.textContent = '💾 Create New Save';
    styleBtn(create);
    create.onclick = () => {
      SaveSlotManager.saveGame(gameId, `manual-${Date.now()}`, { progress: Math.random() });
      this.refresh();
    };
    b.appendChild(create);

    const close = document.createElement('button');
    close.textContent = '⬅ Back to Games';
    styleBtn(close);
    close.onclick = () => {
      b.style.display = 'none';
      GameHub.show();
    };
    b.appendChild(close);

    document.body.appendChild(b);
    this.box = b;
    this.refresh();
  }

  private static refresh() {
    if (!this.box) return;
    const list = this.box.querySelector('#slotList') as HTMLDivElement;
    list.innerHTML = '';
    const slots = SaveSlotManager.getAll(this.currentGame);
    for (const s of slots) {
      const div = document.createElement('div');
      div.textContent = `${s.slot} — ${new Date(s.timestamp).toLocaleTimeString()}`;
      styleBtn(div as any);
      div.onclick = () => alert(JSON.stringify(s.data, null, 2));
      list.appendChild(div);
    }
  }
}

function styleBtn(el: HTMLElement) {
  Object.assign(el.style, {
    background: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    borderRadius: '5px',
    margin: '5px 0',
    padding: '6px 12px',
    cursor: 'pointer',
    textAlign: 'center'
  });
  el.onmouseenter = () => ((el.style.background = '#0f0'), (el.style.color = '#000'));
  el.onmouseleave = () => ((el.style.background = '#000'), (el.style.color = '#0f0'));
}
