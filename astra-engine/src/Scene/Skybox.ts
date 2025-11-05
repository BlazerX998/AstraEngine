import { Renderer } from '../core/Renderer';
import { Material } from '../core/Material';
import { TextureLoader } from '../Utils/TextureLoader';
import { Logger } from '../core/Logger';
import { Camera } from '../core/Camera';

export class Skybox {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private vbo: WebGLBuffer | null = null;
  private material: Material;
  private cubemap: WebGLTexture | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.material = new Material(gl);
  }

  async init(): Promise<void> {
    const gl = this.gl;

    const vertices = new Float32Array([
      -1,  1, -1,  -1, -1, -1,   1, -1, -1,
       1, -1, -1,   1,  1, -1,  -1,  1, -1,
      -1, -1,  1,  -1, -1, -1,  -1,  1, -1,
      -1,  1, -1,  -1,  1,  1,  -1, -1,  1,
       1, -1, -1,   1, -1,  1,   1,  1,  1,
       1,  1,  1,   1,  1, -1,   1, -1, -1,
      -1, -1,  1,  -1,  1,  1,   1,  1,  1,
       1,  1,  1,   1, -1,  1,  -1, -1,  1,
      -1,  1, -1,   1,  1, -1,   1,  1,  1,
       1,  1,  1,  -1,  1,  1,  -1,  1, -1,
      -1, -1, -1,  -1, -1,  1,   1, -1, -1,
       1, -1, -1,  -1, -1,  1,   1, -1,  1
    ]);

    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();
    if (!this.vao || !this.vbo) throw new Error('Failed to create Skybox buffers');

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const vertexSrc = `#version 300 es
    layout(location=0) in vec3 aPos;
    out vec3 vTexCoord;
    uniform mat4 uView;
    uniform mat4 uProj;
    void main() {
      vTexCoord = aPos;
      vec4 pos = uProj * uView * vec4(aPos, 1.0);
      gl_Position = pos.xyww;
    }`;

    const fragmentSrc = `#version 300 es
    precision highp float;
    in vec3 vTexCoord;
    out vec4 FragColor;
    uniform samplerCube skybox;
    void main() {
      FragColor = texture(skybox, vTexCoord);
    }`;

    await this.material.init(vertexSrc, fragmentSrc);

    this.cubemap = await TextureLoader.loadCubemap(gl, {
      right: 'assets/skybox/right.jpg',
      left:  'assets/skybox/left.jpg',
      top:   'assets/skybox/top.jpg',
      bottom:'assets/skybox/bottom.jpg',
      front: 'assets/skybox/front.jpg',
      back:  'assets/skybox/back.jpg'
    });

    Logger.info('Skybox initialized.');
  }

  render(renderer: Renderer, camera: Camera): void {
    const gl = this.gl;
    if (!this.vao || !this.cubemap) return;

    this.material.use();

    const view = camera.getViewMatrix();
    view[12] = view[13] = view[14] = 0; // remove translation
    const proj = camera.getProjectionMatrix();

    const uView = gl.getUniformLocation(this.material['program']!, 'uView');
    const uProj = gl.getUniformLocation(this.material['program']!, 'uProj');
    const uSkybox = gl.getUniformLocation(this.material['program']!, 'skybox');

    if (uView) gl.uniformMatrix4fv(uView, false, view);
    if (uProj) gl.uniformMatrix4fv(uProj, false, proj);
    if (uSkybox) gl.uniform1i(uSkybox, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemap);

    renderer.drawSkybox(this.vao);
  }
}
