import { Logger } from './Logger';
import { TextureLoader } from '../Utils/TextureLoader';

export class Material {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private uniforms: Record<string, any> = {};
  private textures: Record<string, WebGLTexture> = {};

  // ✅ Phong lighting properties
  ambient: [number, number, number] = [0.2, 0.2, 0.2];
  diffuse: [number, number, number] = [0.8, 0.8, 0.8];
  specular: [number, number, number] = [1.0, 1.0, 1.0];
  shininess: number = 32.0;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /** ✅ Initialize and compile shaders */
  async init(vertexSrc: string, fragmentSrc: string) {
    this.program = this.createProgram(vertexSrc, fragmentSrc);
    Logger.info('Material initialized successfully.');
  }

  /** ✅ Bind the shader program */
  use() {
    if (!this.program) throw new Error('Material not initialized before use()');
    this.gl.useProgram(this.program);
  }

  /** ✅ Load and bind texture to uniform */
  async setTexture(name: string, path: string, unit = 0) {
    const texture = await TextureLoader.loadTexture(this.gl, path);
    this.textures[name] = texture;
    this.uniforms[name] = unit;
  }

  /** ✅ Set custom uniforms (vec3, float, mat4, etc.) */
  setUniform(name: string, value: any) {
    this.uniforms[name] = value;
  }

  /** ✅ Apply all stored uniforms and textures to GPU */
  applyUniforms() {
    if (!this.program) return;

    const gl = this.gl;

    // Non-texture uniforms
    for (const [name, value] of Object.entries(this.uniforms)) {
      const loc = gl.getUniformLocation(this.program, name);
      if (!loc) continue;

      if (typeof value === 'number') {
        gl.uniform1f(loc, value);
      } else if (Array.isArray(value)) {
        switch (value.length) {
          case 2: gl.uniform2fv(loc, value); break;
          case 3: gl.uniform3fv(loc, value); break;
          case 4: gl.uniform4fv(loc, value); break;
          case 9: gl.uniformMatrix3fv(loc, false, value); break;
          case 16: gl.uniformMatrix4fv(loc, false, value); break;
        }
      }
    }

    // Texture uniforms
    let texIndex = 0;
    for (const [name, tex] of Object.entries(this.textures)) {
      const loc = gl.getUniformLocation(this.program, name);
      if (!loc) continue;

      gl.activeTexture(gl.TEXTURE0 + texIndex);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(loc, texIndex);
      texIndex++;
    }
  }

  /** ✅ Return underlying WebGLProgram for lighting use */
  getProgram(): WebGLProgram {
    if (!this.program) throw new Error('Material program not yet initialized');
    return this.program;
  }

  // -------------------------
  // 🔧 Private Helpers
  // -------------------------
  private createProgram(vsSrc: string, fsSrc: string): WebGLProgram {
    const gl = this.gl;

    const compile = (type: GLenum, src: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        Logger.error(`❌ Shader compile error: ${gl.getShaderInfoLog(shader)}`);
        throw new Error(`Shader compile failed`);
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      Logger.error(`❌ Program link error: ${gl.getProgramInfoLog(program)}`);
      throw new Error('Shader program linking failed');
    }

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    return program;
  }
}
