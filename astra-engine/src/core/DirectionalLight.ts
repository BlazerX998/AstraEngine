import { vec3 } from 'gl-matrix';

export class DirectionalLight {
  public direction: vec3;
  public color: vec3;
  public intensity: number;

  constructor(
    direction: vec3 = vec3.fromValues(-0.2, -1.0, -0.3),
    color: vec3 = vec3.fromValues(1.0, 1.0, 1.0),
    intensity = 1.0
  ) {
    this.direction = direction;
    this.color = color;
    this.intensity = intensity;
  }

  getUniformData() {
    return {
      direction: this.direction,
      color: this.color,
      intensity: this.intensity
    };
  }
}
