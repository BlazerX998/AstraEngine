// src/core/Transform.ts
import { mat4, vec3 } from 'gl-matrix';

export class Transform {
  position: vec3 = vec3.fromValues(0, 0, 0);
  rotation: vec3 = vec3.fromValues(0, 0, 0);
  scale: vec3 = vec3.fromValues(1, 1, 1);

  getMatrix(): mat4 {
    const m = mat4.create();
    mat4.translate(m, m, this.position);
    mat4.rotateX(m, m, this.rotation[0]);
    mat4.rotateY(m, m, this.rotation[1]);
    mat4.rotateZ(m, m, this.rotation[2]);
    mat4.scale(m, m, this.scale);
    return m;
  }
}
