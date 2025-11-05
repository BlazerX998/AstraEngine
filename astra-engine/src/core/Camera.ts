// src/core/Camera.ts
import { mat4, vec3 } from 'gl-matrix';

export class Camera {
  public position: vec3;
  public front: vec3;
  public up: vec3;
  public right: vec3;
  public worldUp: vec3;
  private viewMatrix: mat4;
  private projectionMatrix: mat4;

  // Perspective parameters
  private fov: number;
  private aspect: number;
  private near: number;
  private far: number;

  constructor() {
    this.position = vec3.fromValues(0, 0, 3);
    this.front = vec3.fromValues(0, 0, -1);
    this.worldUp = vec3.fromValues(0, 1, 0);
    this.up = vec3.create();
    this.right = vec3.create();
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();

    this.fov = 45;
    this.aspect = 1;
    this.near = 0.1;
    this.far = 100.0;

    this.updateCameraVectors();
    this.updateProjectionMatrix();
  }

  /** Recalculate view directions */
  private updateCameraVectors() {
    const right = vec3.create();
    vec3.cross(right, this.front, this.worldUp);
    vec3.normalize(this.right, right);

    const up = vec3.create();
    vec3.cross(up, this.right, this.front);
    vec3.normalize(this.up, up);
  }

  /** Updates and returns the view matrix */
  public getViewMatrix(): mat4 {
    const target = vec3.create();
    vec3.add(target, this.position, this.front);
    mat4.lookAt(this.viewMatrix, this.position, target, this.up);
    return this.viewMatrix;
  }

  /** Updates perspective projection */
  public setProjection(aspect: number, fov = 45, near = 0.1, far = 100.0) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  /** Internal projection matrix calculation */
  private updateProjectionMatrix() {
    mat4.perspective(
      this.projectionMatrix,
      (this.fov * Math.PI) / 180,
      this.aspect,
      this.near,
      this.far
    );
  }

  /** ✅ Getter for Skybox and Scene */
  public getProjectionMatrix(): mat4 {
    return this.projectionMatrix;
  }

  /** ✅ For responsive resize handling */
  public setAspectRatio(width: number, height: number) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }

  /** ✅ Used by CameraController for movement */
  public setPosition(x: number | vec3, y?: number, z?: number) {
    if (typeof x === 'number' && y !== undefined && z !== undefined) {
      vec3.set(this.position, x, y, z);
    } else if (x instanceof Float32Array) {
      vec3.copy(this.position, x);
    } else {
      throw new Error('Invalid arguments to setPosition');
    }
  }

  /** ✅ Used by CameraController for rotation */
  public lookAt(target: vec3) {
    const dir = vec3.create();
    vec3.subtract(dir, target, this.position);
    vec3.normalize(this.front, dir);
    this.updateCameraVectors();
  }
}
