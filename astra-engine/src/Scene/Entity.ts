// src/scene/Entity.ts
import { Transform } from './Transform';
import { Renderer } from '../core/Renderer';

export abstract class Entity {
  name: string;
  transform: Transform;
  active: boolean = true;

  constructor(name: string) {
    this.name = name;
    this.transform = new Transform();
  }

  start(): void {}        // Called once
  update(dt: number): void {} // Called each frame
  //render(): void {}    
    abstract render(renderer: Renderer): void;   // Called each frame (draw)
}
