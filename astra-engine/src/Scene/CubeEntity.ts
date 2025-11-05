import { EntityBase } from './EntityBase';
import { Renderer } from '../core/Renderer';
import { Shader } from '../core/Shader';
import { mat4 } from 'gl-matrix';
import { Light } from './Light';
import { Material } from '../core/Material';

export class CubeEntity extends EntityBase {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private shader: Shader;
  private angle = 0;

  private light: Light;
  private material: Material;

  constructor(gl: WebGL2RenderingContext, light: Light, material: Material) {
    super('Lit Cube');
    this.gl = gl;
    this.shader = new Shader(gl);
    this.light = light;
    this.material = material;
  }

  async init() {
    await this.shader.load('/assets/shaders/phong.vert', '/assets/shaders/phong.frag');

    const vertices = new Float32Array([
      // positions + normals
      -1, -1, -1, 0, 0, -1,
       1, -1, -1, 0, 0, -1,
       1,  1, -1, 0, 0, -1,
      -1,  1, -1, 0, 0, -1,

      -1, -1,  1, 0, 0, 1,
       1, -1,  1, 0, 0, 1,
       1,  1,  1, 0, 0, 1,
      -1,  1,  1, 0, 0, 1
    ]);

    const indices = new Uint16Array([
      0, 1, 2, 2, 3, 0, // back
      4, 5, 6, 6, 7, 4  // front
    ]);

    this.vao = this.gl.createVertexArray();
    const vbo = this.gl.createBuffer();
    const ebo = this.gl.createBuffer();

    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ebo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    const stride = 6 * 4;
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 3 * 4);
    this.gl.enableVertexAttribArray(1);

    this.gl.bindVertexArray(null);
  }

  update(dt: number) {
    this.angle += dt;
  }

  render(renderer: Renderer) {
    const gl = renderer.getContext();
    this.shader.use();

    const model = mat4.create();
    mat4.rotateY(model, model, this.angle);

    const view = mat4.create();
    const proj = mat4.create();
    mat4.perspective(proj, Math.PI / 3, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    mat4.translate(view, view, [0, 0, -5]);
    
this.shader.setUniformMat4('uModel', model as Float32Array);
this.shader.setUniformMat4('uView', view as Float32Array);
this.shader.setUniformMat4('uProj', proj as Float32Array);
    // ✅ Light + Material uniforms
    this.shader.setUniformVec3('uLightDir', this.light.direction);
    this.shader.setUniformVec3('uLightColor', this.light.color);
    this.shader.setUniformFloat('uLightIntensity', this.light.intensity);

    this.shader.setUniformVec3('uMatAmbient', this.material.ambient);
    this.shader.setUniformVec3('uMatDiffuse', this.material.diffuse);
    this.shader.setUniformVec3('uMatSpecular', this.material.specular);
    this.shader.setUniformFloat('uMatShininess', this.material.shininess);

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}
