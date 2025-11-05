import { Logger } from './Logger';
import { AssetLoader } from '../Utils/AssetLoader';

export class Shader {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  async load(vertexPath: string, fragmentPath: string) {
    const vertSrc = await AssetLoader.loadText(vertexPath);
    const fragSrc = await AssetLoader.loadText(fragmentPath);

    const vertShader = this.compile(this.gl.VERTEX_SHADER, vertSrc);
    const fragShader = this.compile(this.gl.FRAGMENT_SHADER, fragSrc);

    this.program = this.gl.createProgram();
    if (!this.program) throw new Error('Failed to create shader program');

    this.gl.attachShader(this.program, vertShader);
    this.gl.attachShader(this.program, fragShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(this.program);
      throw new Error('Shader linking failed: ' + info);
    }

    Logger.info('Shader linked successfully');
  }

  use() {
    if (this.program) this.gl.useProgram(this.program);
  }

  private compile(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Unable to create shader');
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      throw new Error(`Shader compile error: ${info}`);
    }
    return shader;
  }

    // ✅ Uniform helpers
  setUniformMat4(name: string, mat: Float32Array) {
    const loc = this.gl.getUniformLocation(this.program!, name);
    if (loc) this.gl.uniformMatrix4fv(loc, false, mat);
  }

  setUniformVec3(name: string, vec: [number, number, number]) {
    const loc = this.gl.getUniformLocation(this.program!, name);
    if (loc) this.gl.uniform3fv(loc, vec);
  }

  setUniformFloat(name: string, value: number) {
    const loc = this.gl.getUniformLocation(this.program!, name);
    if (loc) this.gl.uniform1f(loc, value);
  }
}
