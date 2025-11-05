// src/scene/Scene.ts
import { Renderer } from '../core/Renderer';
import { Logger } from '../core/Logger';
import { EntityBase } from './EntityBase';
import { Camera } from '../core/Camera';
import { Mesh } from '../core/Mesh';
import { mat4 } from 'gl-matrix';

export class Scene {
  private entities: EntityBase[] = [];
  private meshes: Mesh[] = [];
  public camera = new Camera();

  constructor() {
    Logger.info('Scene created.');
  }

  /** ✅ Add an entity to the scene */
  addEntity(entity: EntityBase): void {
    this.entities.push(entity);
    Logger.info(`Entity added: ${entity.name}`);
  }

  /** ✅ Add a mesh directly to the scene (for procedural geometry) */
  addMesh(mesh: Mesh): void {
    this.meshes.push(mesh);
    Logger.info('Mesh added to scene.');
  }

  /** ✅ Initialize all entities (if async init exists) */
  async init(gl: WebGL2RenderingContext): Promise<void> {
    for (const entity of this.entities) {
      if (typeof (entity as any).init === 'function') {
        await (entity as any).init(gl);
      }
    }
  }

  /** ✅ Remove an entity */
  removeEntity(entity: EntityBase): void {
    const idx = this.entities.indexOf(entity);
    if (idx >= 0) this.entities.splice(idx, 1);
  }

  /** ✅ Update all entities (called every frame) */
  update(dt: number): void {
    for (const entity of this.entities) {
      try {
        entity.update(dt);
      } catch (err) {
        Logger.error(`Entity.update error (${entity.name}): ${String(err)}`);
      }
    }
  }

  /** ✅ Main render loop */
  render(renderer: Renderer): void {
    const gl = renderer.getContext();

    // Clear previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const view = this.camera.getViewMatrix();
    const proj = this.camera.getProjectionMatrix();

    // --- Render Entities ---
    for (const entity of this.entities) {
      try {
        // Handle entities with either render(renderer) or render(renderer, camera)
        if ((entity as any).render.length === 2) {
          (entity as any).render(renderer, this.camera);
        } else {
          entity.render(renderer);
        }
      } catch (err) {
        Logger.error(`Entity.render error (${entity.name}): ${String(err)}`);
      }
    }

    // --- Render Meshes directly (like skybox or primitives) ---
    for (const mesh of this.meshes) {
      try {
        const material = mesh.getMaterial();
        if (!material) continue;

        // Apply camera uniforms
        material.setUniform('uView', view);
        material.setUniform('uProj', proj);
        material.setUniform('uModel', mesh.getModelMatrix());

        // Optional camera position (for lighting)
        const camPos = this.camera.position;
        material.setUniform('uCameraPos', [camPos[0], camPos[1], camPos[2]]);

        material.applyUniforms();
        mesh.draw();
      } catch (err) {
        Logger.error(`Mesh.render error: ${String(err)}`);
      }
    }
  }

  /** ✅ Handle canvas resize updates */
  resize(width: number, height: number): void {
    this.camera.setAspectRatio(width, height);
  }

  /** ✅ Clear all objects */
  clear(): void {
    this.entities.length = 0;
    this.meshes.length = 0;
    Logger.warn('Scene cleared.');
  }

  /** ✅ Get all scene entities (read-only) */
  getEntities(): EntityBase[] {
    return [...this.entities];
  }

  /** ✅ Get all meshes (for debugging or post-processing) */
  getMeshes(): Mesh[] {
    return [...this.meshes];
  }
}
