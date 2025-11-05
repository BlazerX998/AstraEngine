import { Logger } from '../core/Logger';

export class SettingsPanel {
  private static panel: HTMLDivElement | null = null;

  static show() {
    if (!this.panel) this.create();
    this.panel!.style.display = 'block';
  }

  private static create() {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      fontFamily: 'monospace',
      padding: '20px',
      borderRadius: '10px',
      zIndex: '10000'
    });

    const themeLabel = document.createElement('label');
    themeLabel.textContent = 'Theme: ';
    const themeSelect = document.createElement('select');
    themeSelect.innerHTML = `<option value="dark">Dark</option><option value="light">Light</option>`;
    themeSelect.value = localStorage.getItem('astra_theme') || 'dark';
    themeSelect.onchange = () => {
      localStorage.setItem('astra_theme', themeSelect.value);
      document.body.style.background = themeSelect.value === 'light' ? '#eee' : '#111';
      Logger.info(`🎨 Theme changed to ${themeSelect.value}`);
    };

    const volLabel = document.createElement('label');
    volLabel.textContent = 'Volume: ';
    const volInput = document.createElement('input');
    volInput.type = 'range';
    volInput.min = '0';
    volInput.max = '100';
    volInput.value = localStorage.getItem('astra_volume') || '80';
    volInput.oninput = () => {
      localStorage.setItem('astra_volume', volInput.value);
    };

    const close = document.createElement('button');
    close.textContent = 'Close';
    Object.assign(close.style, {
      marginTop: '15px',
      background: '#0f0',
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      cursor: 'pointer'
    });
    close.onclick = () => (panel.style.display = 'none');

    panel.appendChild(themeLabel);
    panel.appendChild(themeSelect);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(volLabel);
    panel.appendChild(volInput);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(close);

    document.body.appendChild(panel);
    this.panel = panel;
  }
}
