// src/core/ShaderProgram.ts
import { Logger } from './Logger';

export class ShaderProgram {
  private gl: WebGL2RenderingContext;
  program: WebGLProgram;

  constructor(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string) {
    this.gl = gl;
    const vs = this.compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = this.compile(gl.FRAGMENT_SHADER, fragmentSrc);
    this.program = this.link(vs, fs);
  }

  private compile(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      Logger.error(`Shader compile error: ${info}`);
      throw new Error(info || 'Shader compile error');
    }
    return shader;
  }

  private link(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      Logger.error(`Shader link error: ${info}`);
      throw new Error(info || 'Shader link error');
    }
    return program;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  setUniformMat4(name: string, mat: Float32Array) {
    const loc = this.gl.getUniformLocation(this.program, name);
    if (loc) this.gl.uniformMatrix4fv(loc, false, mat);
  }
}
