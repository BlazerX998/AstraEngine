export class Light {
  direction: [number, number, number];
  color: [number, number, number];
  intensity: number;

  constructor(
    direction: [number, number, number] = [0, -1, 0],
    color: [number, number, number] = [1, 1, 1],
    intensity = 1.0
  ) {
    this.direction = direction;
    this.color = color;
    this.intensity = intensity;
  }
}
