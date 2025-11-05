// src/core/SpotLight.ts
import { vec3 } from 'gl-matrix';

export class SpotLight {
  position: vec3;
  direction: vec3;
  color: vec3;
  intensity: number;
  cutOff: number;
  outerCutOff: number;
  constant: number;
  linear: number;
  quadratic: number;

  constructor(
    position: vec3,
    direction: vec3,
    color: vec3 = vec3.fromValues(1, 1, 1),
    intensity = 1.0,
    cutOff = Math.cos((12.5 * Math.PI) / 180), // inner angle
    outerCutOff = Math.cos((17.5 * Math.PI) / 180), // outer angle
    constant = 1.0,
    linear = 0.09,
    quadratic = 0.032
  ) {
    this.position = position;
    this.direction = direction;
    this.color = color;
    this.intensity = intensity;
    this.cutOff = cutOff;
    this.outerCutOff = outerCutOff;
    this.constant = constant;
    this.linear = linear;
    this.quadratic = quadratic;
  }

  getUniformData() {
    return {
      position: this.position,
      direction: this.direction,
      color: this.color,
      intensity: this.intensity,
      cutOff: this.cutOff,
      outerCutOff: this.outerCutOff,
      constant: this.constant,
      linear: this.linear,
      quadratic: this.quadratic,
    };
  }
}
