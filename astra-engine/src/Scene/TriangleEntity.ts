// src/Scene/TriangleEntity.ts
import { EntityBase } from './EntityBase';
import { Renderer } from '../core/Renderer';
import { Logger } from '../core/Logger';

export class TriangleEntity extends EntityBase {
  private vao: WebGLVertexArrayObject | null = null;
  private program: WebGLProgram | null = null;

  constructor(name = 'Triangle') {
    super(name);
  }

  private ensureInit(gl: WebGL2RenderingContext) {
    if (this.program) return;

    const vertSrc = `#version 300 es
      layout(location = 0) in vec2 aPos;
      void main() {
        gl_Position = vec4(aPos, 0.0, 1.0);
      }`;

    const fragSrc = `#version 300 es
      precision mediump float;
      out vec4 FragColor;
      void main() {
        FragColor = vec4(0.2, 0.6, 1.0, 1.0);
      }`;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        Logger.error(`Shader compile error: ${info}`);
        throw new Error(info || 'Shader compile error');
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      Logger.error(`Program link error: ${info}`);
      throw new Error(info || 'Program link error');
    }

    this.program = prog;

    // Create VAO and VBO
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    const vertices = new Float32Array([
      0, 0.6,  // top
      -0.5, -0.4, // left
      0.5, -0.4  // right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    Logger.info('TriangleEntity initialized.');
  }

  update(dt: number) {
    // Nothing dynamic for now
  }

  render(renderer: Renderer) {
    const gl = renderer.getContext();
    this.ensureInit(gl);
    if (!this.program || !this.vao) return;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }
}

