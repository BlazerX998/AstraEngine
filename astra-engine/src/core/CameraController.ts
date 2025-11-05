import { vec3 } from 'gl-matrix';
import { Camera } from './Camera';
import { InputManager } from './InputManager';

export class CameraController {
  private camera: Camera;
  private input: InputManager;
  private speed = 3.0;
  private sensitivity = 0.002;
  private yaw = -Math.PI / 2;
  private pitch = 0;

  constructor(camera: Camera, input: InputManager) {
    this.camera = camera;
    this.input = input;
    this.setupMouseLook();
  }

  private setupMouseLook() {
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.yaw += e.movementX * this.sensitivity;
        this.pitch -= e.movementY * this.sensitivity;
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        this.updateCameraDirection();
      }
    });

    document.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
  }

  private updateCameraDirection() {
    const dir = vec3.fromValues(
      Math.cos(this.pitch) * Math.cos(this.yaw),
      Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.sin(this.yaw)
    );

    const pos = this.camera['position']; // private in Camera, adjust if needed
    const target = vec3.create();
    vec3.add(target, pos, dir);
    this.camera.lookAt(target);
  }

  update(dt: number) {
    const forward = vec3.fromValues(
      Math.cos(this.yaw),
      0,
      Math.sin(this.yaw)
    );
    const right = vec3.fromValues(-forward[2], 0, forward[0]);
    const pos = this.camera['position'];

    if (this.input.isPressed('w')) vec3.scaleAndAdd(pos, pos, forward, dt * this.speed);
    if (this.input.isPressed('s')) vec3.scaleAndAdd(pos, pos, forward, -dt * this.speed);
    if (this.input.isPressed('a')) vec3.scaleAndAdd(pos, pos, right, -dt * this.speed);
    if (this.input.isPressed('d')) vec3.scaleAndAdd(pos, pos, right, dt * this.speed);

    this.camera.setPosition(pos);
  }
}
