import { Renderer } from './Renderer';
import { Logger } from './Logger';
import { Debug } from './Debug';
import { InputManager } from './InputManager';
import { Scene } from '../Scene/Scene1';
import { StatsManager } from '../Utils/StatsManager';
import { CameraController } from './CameraController';

export class Engine {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private input: InputManager;
  private scene: Scene;
  private stats: StatsManager;
  private controller: CameraController;
  private running = false;
  private lastTime = 0;

  constructor(canvasId: string, scene: Scene) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found.`);
    }

    this.scene = scene;
    this.input = new InputManager();
    this.stats = new StatsManager();
    this.renderer = new Renderer(this.canvas);

    // ✅ Link controller to scene’s camera
    this.controller = new CameraController(this.scene.camera, this.input);

    Debug.init();
    Logger.info('Engine initialized successfully.');
  }

  async start() {
    Logger.info('Starting main loop...');
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  private loop = () => {
    if (!this.running) return;

    this.stats.begin();
    Debug.begin();

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(delta);
    this.render();

    Debug.end();
    this.stats.end();
    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.input.poll();

    // ✅ Delegate camera updates to the controller
    this.controller.update(dt);
    this.scene.update(dt);
  }

  private render() {
    this.renderer.clear(0.1, 0.1, 0.12);
    this.scene.render(this.renderer);
  }

  stop() {
    this.running = false;
    Logger.info('Engine stopped.');
  }

  getRenderer(): Renderer {
    return this.renderer;
  }
}
