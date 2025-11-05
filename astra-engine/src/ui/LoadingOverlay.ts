export class LoadingOverlay {
  private static overlay: HTMLDivElement | null = null;
  private static progressBar: HTMLDivElement | null = null;

  static show(): void {
    if (this.overlay) return;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      zIndex: '10000',
      transition: 'opacity 0.5s ease',
    });

    overlay.innerHTML = `<h2>🚀 Loading Game...</h2>`;
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      width: '60%',
      height: '6px',
      background: '#111',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '20px',
      boxShadow: '0 0 8px #0f0'
    });

    const fill = document.createElement('div');
    Object.assign(fill.style, {
      width: '0%',
      height: '100%',
      background: '#0f0',
      transition: 'width 0.2s ease',
    });
    bar.appendChild(fill);

    overlay.appendChild(bar);
    document.body.appendChild(overlay);

    this.overlay = overlay;
    this.progressBar = fill;
  }

  static update(progress: number): void {
    if (this.progressBar) this.progressBar.style.width = `${progress}%`;
  }

  static hide(): void {
    if (!this.overlay) return;
    this.overlay.style.opacity = '0';
    setTimeout(() => this.overlay?.remove(), 500);
    this.overlay = null;
    this.progressBar = null;
  }
}
