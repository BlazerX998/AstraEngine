import { mat3 } from 'gl-matrix';
import { Material } from './Material';
import { Camera } from './Camera';
import { LightingManager } from './LightingManager';

interface RenderEntity {
  transform: { getMatrix: () => Float32Array };
  mesh: { draw: (program: WebGLProgram) => void };
  material: Material;
}

export class MeshRendererSystem {
  constructor(
    private gl: WebGL2RenderingContext,
    private camera: Camera,
    private lighting: LightingManager
  ) {}

  render(entities: RenderEntity[]) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const entity of entities) {
      const { transform, mesh, material } = entity;
      if (!mesh || !material) continue;

      material.use();

      const model = transform.getMatrix();
      const normalMatrix = mat3.create();
      mat3.normalFromMat4(normalMatrix, model);

      material.setUniform('uModel', model);
      material.setUniform('uView', this.camera.getViewMatrix());
      material.setUniform('uProjection', this.camera.getProjectionMatrix());
      material.setUniform('uNormalMatrix', normalMatrix);
      material.setUniform('uViewPos', this.camera.position);

      // Apply lighting to shader
      this.lighting.applyToMaterial(gl, material.getProgram());

      // Apply all uniforms + textures
      material.applyUniforms();

      // Draw mesh
      mesh.draw(material.getProgram());
    }
  }
}
