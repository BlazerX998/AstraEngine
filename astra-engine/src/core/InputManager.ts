export class InputManager {
  private keys: Record<string, boolean> = {};
  private mouseDelta = { x: 0, y: 0 };
  private lastMouse = { x: 0, y: 0 };
  private mouseCaptured = false;

  constructor() {
    window.addEventListener('keydown', e => (this.keys[e.key.toLowerCase()] = true));
    window.addEventListener('keyup', e => (this.keys[e.key.toLowerCase()] = false));
    window.addEventListener('mousemove', e => this.handleMouseMove(e));
    window.addEventListener('click', () => this.captureMouse());
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.mouseCaptured) return;
    this.mouseDelta.x += e.movementX;
    this.mouseDelta.y += e.movementY;
  }

  private captureMouse() {
    if (!this.mouseCaptured) {
      document.body.requestPointerLock();
      this.mouseCaptured = true;
    }
  }

  poll() {
    // Reset mouse deltas after each frame
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
  }

  isPressed(key: string) {
    return !!this.keys[key.toLowerCase()];
  }

  getMouseDelta() {
    return { ...this.mouseDelta };
  }
}
