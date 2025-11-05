import { vec3 } from 'gl-matrix';

export class PointLight {
  public position: vec3;
  public color: vec3;
  public intensity: number;
  public constant: number;
  public linear: number;
  public quadratic: number;

  constructor(
    position: vec3 = vec3.fromValues(0, 0, 0),
    color: vec3 = vec3.fromValues(1, 1, 1),
    intensity = 1.0,
    constant = 1.0,
    linear = 0.09,
    quadratic = 0.032
  ) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
    this.constant = constant;
    this.linear = linear;
    this.quadratic = quadratic;
  }

  getUniformData() {
    return {
      position: this.position,
      color: this.color,
      intensity: this.intensity,
      constant: this.constant,
      linear: this.linear,
      quadratic: this.quadratic
    };
  }
}
