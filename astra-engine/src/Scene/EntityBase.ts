import { Renderer } from '../core/Renderer';

export abstract class EntityBase {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // Optional initialization hook for entities needing GL setup
  init?(gl: WebGL2RenderingContext): void;

  abstract update(dt: number): void;

  // Accept optional camera for 3D entities
  abstract render(renderer: Renderer, camera?: any): void;
}