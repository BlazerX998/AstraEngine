import { Scene } from '../Scene/Scene1';
import { Camera } from './Camera';
import { LightingManager } from './LightingManager';
import { Logger } from './Logger';
import { PostProcessor } from './PostProcessor';
import { Mesh } from './Mesh'; // ✅ Added import for type

export class RenderPipeline {
  private gl: WebGL2RenderingContext;
  private scene: Scene;
  private camera: Camera;
  private lighting: LightingManager;
  private postProcessor?: PostProcessor;

  private lastFrameTime = 0;
  private running = false;
  private frameId: number | null = null;

  constructor(
    gl: WebGL2RenderingContext,
    scene: Scene,
    camera: Camera,
    lighting: LightingManager
  ) {
    this.gl = gl;
    this.scene = scene;
    this.camera = camera;
    this.lighting = lighting;

    Logger.info('RenderPipeline initialized.');
  }

  /** Attach a post-processing manager (optional) */
  attachPostProcessor(post: PostProcessor) {
    this.postProcessor = post;
    Logger.info('PostProcessor attached.');
  }

  /** Start the render loop */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    const loop = (time: number) => {
      if (!this.running) return;

      const delta = (time - this.lastFrameTime) / 1000;
      this.lastFrameTime = time;

      this.renderFrame(delta);

      this.frameId = requestAnimationFrame(loop);
    };
    this.frameId = requestAnimationFrame(loop);
  }

  /** Stop rendering */
  stop() {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    Logger.info('RenderPipeline stopped.');
  }

  /** Per-frame render logic */
  private renderFrame(delta: number) {
    const gl = this.gl;

    // Clear buffers
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.05, 0.05, 0.05, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update scene logic
    this.scene.update(delta);

    // Render each mesh
    const projectionMatrix = this.camera.getProjectionMatrix();
    const viewMatrix = this.camera.getViewMatrix();

    this.scene.getMeshes().forEach((mesh: Mesh) => { // ✅ explicit type
      const material = mesh.getMaterial();
      if (!material) return;

      material.use();
      material.setUniform('uProjection', projectionMatrix);
      material.setUniform('uView', viewMatrix);
      material.setUniform('uModel', mesh.getModelMatrix());

      // Apply lighting to shader
      this.lighting.applyToMaterial(gl, material.getProgram());
      material.applyUniforms();

      // Draw the mesh
      mesh.draw();
    });

    // Post-processing (optional)
    if (this.postProcessor) {
      this.postProcessor.apply(gl);
    }
  }
}
