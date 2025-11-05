import Stats from 'stats.js';

export class StatsManager {
  private stats: Stats;

  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: FPS
    document.body.appendChild(this.stats.dom);
  }

  begin(): void {
    this.stats.begin();
  }

  end(): void {
    this.stats.end();
  }
}