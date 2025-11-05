// src/Scene/MeshRenderer.ts
import { Renderer } from '../core/Renderer';
import { ShaderProgram } from '../core/ShaderProgram';
import { mat4 } from 'gl-matrix';

export class MeshRenderer {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private shader: ShaderProgram;

  constructor(gl: WebGL2RenderingContext, vertices: Float32Array, vertexSrc: string, fragSrc: string) {
    this.gl = gl;
    this.shader = new ShaderProgram(gl, vertexSrc, fragSrc);
    this.initBuffer(vertices);
  }

  private initBuffer(vertices: Float32Array) {
    const gl = this.gl;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
  }

draw(model: mat4, view: mat4, proj: mat4) {
  const gl = this.gl;
  this.shader.use();

  // Convert mat4 (from gl-matrix) to Float32Array before sending to GPU
  this.shader.setUniformMat4('uModel', new Float32Array(model));
  this.shader.setUniformMat4('uView', new Float32Array(view));
  this.shader.setUniformMat4('uProj', new Float32Array(proj));

  gl.bindVertexArray(this.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  gl.bindVertexArray(null);
}
}
