// src/core/GameRegistry.ts
import { Logger } from './Logger';

export interface GameEntry {
  id: string;
  title: string;
  mode: 'engine' | 'platform';
  url?: string;              // for external HTML5/WebGL games
  description?: string;
  thumbnail?: string;        // ✅ added to fix TS2339
}

export class GameRegistry {
  private static games: GameEntry[] = [
    {
      id: 'demo_cube',
      title: 'Rotating Cube Demo',
      mode: 'engine',
      description: 'A simple AstraEngine WebGL demo rendering a rotating cube.',
      thumbnail: 'assets/cube_demo.png'
    },
    {
      id: 'snakex',
      title: 'Snake Xenia 3D',
      mode: 'platform',
      url: 'https://blazerx998.github.io/Snake-Xenia-3D/',
      description: 'External 3D snake game powered by AstraEngine.',
      thumbnail: 'assets/snakex.png'
    },
    {
      id: 'space_invaders',
      title: 'Space Invaders Classic',
      mode: 'platform',
      url: 'https://example.com/games/space-invaders/index.html',
      description: 'Retro alien shooter rebuilt in HTML5.',
      thumbnail: 'assets/space_invaders.png'
    }
  ];

  static getAll(): GameEntry[] {
    return this.games;
  }

  static getById(id: string): GameEntry | undefined {
    const g = this.games.find(x => x.id === id);
    if (!g) Logger.warn(`Game not found: ${id}`);
    return g;
  }

  static add(entry: GameEntry): void {
    if (this.games.find(g => g.id === entry.id)) {
      Logger.warn(`Duplicate game ID ignored: ${entry.id}`);
      return;
    }
    this.games.push(entry);
    Logger.info(`🕹 Added new game: ${entry.title}`);
  }
}
