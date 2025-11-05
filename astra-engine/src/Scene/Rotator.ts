import { EntityBase } from './EntityBase';
import { Renderer } from '../core/Renderer';
import { Logger } from '../core/Logger';
import { Entity } from './Entity';

export class Rotator extends Entity{
  private rotation = 0;
   private angle = 0;


  constructor(name: string) {
    super(name);
    Logger.info(`${this.name} initialized`);
  }

  update(dt: number): void {
    this.angle += dt;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
  }

    render(renderer: Renderer): void {
    // Placeholder render: clears screen color with slight variation
    const r = (Math.sin(this.angle) * 0.5 + 0.5) * 0.2;
    renderer.clear(0.1 + r, 0.1, 0.12);
  }
}
