import { Logger } from './Logger';

export class SceneSandbox {
  private gl: WebGL2RenderingContext;
  private currentDemo: string | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  loadDemo(id: string) {
    this.currentDemo = id;
    Logger.info(`🧩 SceneSandbox loading demo: ${id}`);
    switch (id) {
      case 'triangle': this.renderTriangle(); break;
      case 'rotator': this.renderRotator(); break;
      default: Logger.warn(`Unknown demo id: ${id}`);
    }
  }

  private renderTriangle() {
    const gl = this.gl;
    const verts = new Float32Array([
      0.0,  0.5, 0.0,
     -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0
    ]);

    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const vsSrc = `#version 300 es
      layout(location=0) in vec3 aPos;
      void main(){ gl_Position = vec4(aPos,1.0); }`;
    const fsSrc = `#version 300 es
      precision mediump float;
      out vec4 color;
      void main(){ color = vec4(0.2,1.0,0.3,1.0); }`;

    const vs = this.compile(gl.VERTEX_SHADER, vsSrc);
    const fs = this.compile(gl.FRAGMENT_SHADER, fsSrc);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private renderRotator() {
    // placeholder animation demo
    Logger.info('🌀 Rotator demo running (placeholder)');
  }

  private compile(type: number, src: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
      throw new Error(this.gl.getShaderInfoLog(shader) || 'Shader compile error');
    return shader;
  }
}
