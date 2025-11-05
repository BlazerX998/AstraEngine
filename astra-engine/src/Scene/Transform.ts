import { mat4, vec3 } from 'gl-matrix';

export class Transform {
  position: vec3 = vec3.fromValues(0, 0, 0);
  rotation: vec3 = vec3.fromValues(0, 0, 0);
  scale: vec3 = vec3.fromValues(1, 1, 1);

  getMatrix(): mat4 {
    const model = mat4.create();
    mat4.translate(model, model, this.position);
    mat4.rotateX(model, model, this.rotation[0]);
    mat4.rotateY(model, model, this.rotation[1]);
    mat4.rotateZ(model, model, this.rotation[2]);
    mat4.scale(model, model, this.scale);
    return model;
  }
}
