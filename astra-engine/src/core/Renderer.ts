import { Logger } from './Logger';

export class Renderer {
  private gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.1, 0.1, 0.12, 1.0);

    Logger.info('Renderer initialized (WebGL2)');
  }

  clear(r: number, g: number, b: number): void {
    this.gl.clearColor(r, g, b, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  resize(width: number, height: number): void {
    this.gl.viewport(0, 0, width, height);
  }

  getContext(): WebGL2RenderingContext {
    return this.gl;
  }

  drawMesh(vao: WebGLVertexArrayObject, vertexCount: number): void {
    const gl = this.gl;
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    gl.bindVertexArray(null);
  }

  drawSkybox(vao: WebGLVertexArrayObject): void {
    const gl = this.gl;
    gl.depthFunc(gl.LEQUAL);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.bindVertexArray(null);
    gl.depthFunc(gl.LESS);
  }
}

