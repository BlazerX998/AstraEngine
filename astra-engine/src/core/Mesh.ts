// src/core/Mesh.ts
import { mat4, vec3 } from 'gl-matrix';
import { Material } from './Material';
import { Logger } from './Logger';

export class Mesh {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private vertexCount = 0;
  private material: Material | null = null;

  // ✅ Transform data
  private position: vec3 = vec3.fromValues(0, 0, 0);
  private rotation: vec3 = vec3.fromValues(0, 0, 0);
  private scale: vec3 = vec3.fromValues(1, 1, 1);
  private modelMatrix: mat4 = mat4.create();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /** Build a simple vertex buffer for this mesh */
  build(vertices: Float32Array) {
    const gl = this.gl;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Position attribute layout (location = 0)
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    this.vertexCount = vertices.length / 3;
    Logger.info(`Mesh built with ${this.vertexCount} vertices.`);
  }

  /** Attach material */
  setMaterial(material: Material) {
    this.material = material;
  }

  /** ✅ Getter for pipeline */
  getMaterial(): Material | null {
    return this.material;
  }

  /** ✅ Update transforms manually or via Scene */
  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
    this.updateModelMatrix();
  }

  setRotation(x: number, y: number, z: number) {
    vec3.set(this.rotation, x, y, z);
    this.updateModelMatrix();
  }

  setScale(x: number, y: number, z: number) {
    vec3.set(this.scale, x, y, z);
    this.updateModelMatrix();
  }

  /** ✅ Rebuild model matrix when transform changes */
  private updateModelMatrix() {
    const m = this.modelMatrix;
    mat4.identity(m);
    mat4.translate(m, m, this.position);
    mat4.rotateX(m, m, this.rotation[0]);
    mat4.rotateY(m, m, this.rotation[1]);
    mat4.rotateZ(m, m, this.rotation[2]);
    mat4.scale(m, m, this.scale);
  }

  /** ✅ Return model matrix for shader uniforms */
  getModelMatrix(): mat4 {
    return this.modelMatrix;
  }

  /** ✅ Main render draw call (used by pipeline) */
  draw() {
    if (!this.vao || !this.material) return;
    const gl = this.gl;

    this.material.use();
    this.material.applyUniforms();

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    gl.bindVertexArray(null);
  }
}
