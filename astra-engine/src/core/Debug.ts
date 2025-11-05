// src/core/Debug.ts
import { Logger } from './Logger';

export class Debug {
  private static enabled = true;
  private static showConsoleWarnings = true;
  // optional dat.GUI container reference (set if dat.GUI is installed)
  static gui: any = null;

  static init(options?: { enabled?: boolean; useGui?: boolean; gui?: any }) {
    if (options?.enabled === false) this.enabled = false;
    if (options?.useGui && options.gui) {
      this.gui = options.gui;
    }
    if (this.enabled) {
      Logger.info('Debug initialized');
    }
  }

  // Call at frame start
  static begin() {
    if (!this.enabled) return;
    // marker for future expansions (performance timers, overlays)
    // keep minimal to avoid accidental allocations
  }

  // Call at frame end
  static end() {
    if (!this.enabled) return;
    // finalize markers
  }

  static warn(msg: string) {
    if (this.enabled && this.showConsoleWarnings) console.warn(`[DEBUG WARN] ${msg}`);
  }

  // Register a simple variable in debug GUI (if provided)
  static register(name: string, ref: any) {
    if (this.gui && typeof this.gui.add === 'function') {
      try {
        this.gui.add(ref, name);
      } catch (err) {
        Logger.warn(`Debug.register failed for ${name}: ${String(err)}`);
      }
    }
  }
}
