// src/core/EngineMode.ts
import { Logger } from './Logger';
import { SceneSandbox } from './SceneSandbox';

/**
 * EngineMode — AstraEngine’s native runtime for WebGL rendering.
 * This mode is responsible for running internal demo scenes,
 * physics simulations, or any non-external HTML5 game.
 */
export class EngineMode {
  private gl: WebGL2RenderingContext | null = null;
  private sandbox: SceneSandbox | null = null;
  private running = false;
  private currentDemoId: string | null = null;
  private rafId: number | null = null;

  /** 🔹 Start EngineMode and initialize WebGL2 */
  async start(): Promise<void> {
    if (this.running) return;
    Logger.info('🚀 Starting AstraEngine Engine Mode...');
    const canvas = document.getElementById('glCanvas') as HTMLCanvasElement | null;
    if (!canvas) throw new Error('❌ Missing <canvas id="glCanvas"> in DOM.');

    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('❌ WebGL2 not supported in this browser.');

    this.gl = gl;
    this.sandbox = new SceneSandbox(gl);
    this.running = true;

    // Auto-run the last or default demo
    const defaultDemo = this.currentDemoId ?? 'triangle';
    this.loadInternalDemo(defaultDemo);

    this.loop();
  }

  /** 🔹 Load a specific built-in demo scene */
  loadInternalDemo(id: string): void {
    if (!this.sandbox) {
      Logger.warn('EngineMode: Sandbox not initialized yet.');
      return;
    }

    this.currentDemoId = id;
    Logger.info(`🧱 Loading internal demo: ${id}`);
    this.sandbox.loadDemo(id);
  }

  /** 🔹 Main render loop */
  private loop = (): void => {
    if (!this.running || !this.gl) return;

    // Clear background each frame
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0.1, 0.1, 0.12, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Draw current sandbox scene (if any)
    if (this.sandbox && this.currentDemoId) {
      this.sandbox.loadDemo(this.currentDemoId);
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  /** 🔹 Stop EngineMode cleanly */
  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    Logger.info('🛑 AstraEngine Engine Mode stopped.');
  }

  /** 🔹 Optional: Pause/Resume for runtime controller */
  setPaused(paused: boolean): void {
    this.running = !paused;
    Logger.debug(`⏸️ EngineMode ${paused ? 'paused' : 'resumed'}`);
    if (this.running) this.loop();
  }
}
