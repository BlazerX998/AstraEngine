import { Engine } from './core/Engine';
import { Logger } from './core/Logger';
import { Scene } from './Scene/Scene1';
import { Renderer } from './core/Renderer';
import { StatsManager } from './Utils/StatsManager';
import { Rotator } from './Scene/Rotator';
import { TriangleEntity } from './Scene/TriangleEntity';
import { ModeManager } from './core/ModeManager'; // ✅ FIXED
import { GameRuntimeController } from './core/GameRuntimeController';
import { LoginOverlay } from './ui/LoginOverlay';
import { GameHub } from './ui/GameHub';
import { PlayerProfileManager } from './core/PlayerProfileManager';
import { CloudService } from './Network/CloudServices';
import { MatchmakingOverlay } from './ui/MatchmakingOverlay';
import { MatchmakingService } from './Network/MatchmakingServices';
import { LeaderboardManager } from './core/LeaderboardManager';
import { SaveSlotManager } from './core/SaveSlotManager';
import { AchievementManager } from './core/AchievementManager';
import { Dashboard } from './ui/Dashboard';
import { InGameOverlay } from './ui/InGameOverlay';

// ✅ Create WebGL canvas
const canvas = document.createElement('canvas');
canvas.id = 'glCanvas';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl2');
if (!gl) throw new Error('WebGL2 not supported!');

// ✅ Scene setup
const scene = new Scene();
scene.addEntity(new Rotator('Cube Rotator'));
scene.addEntity(new TriangleEntity());

// ✅ Renderer
const renderer = new Renderer(canvas);
const stats = new StatsManager();

Logger.info('🚀 AstraEngine 2.0 Booting...');

const modeManager = ModeManager.getInstance();
modeManager.switchMode('engine');

window.addEventListener('keydown', async (e) => {
  if (e.key === 'F1') await modeManager.switchMode('engine');
  if (e.key === 'F2') await modeManager.switchMode('platform');
  if (e.key === 'F3') modeManager.loadExternalGame('/games/space-shooter/index.html');
});

function animate() {
  stats.begin();
  renderer.clear(0.2, 0.2, 0.25);
  stats.end();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('DOMContentLoaded', async () => {
  const engine = new Engine('glCanvas', scene);
  await engine.start();
  Logger.info('🚀 AstraEngine Runtime starting...');
  GameRuntimeController.getInstance();
});

(async () => {
  await LoginOverlay.show();
  PlayerProfileManager.loadActive();
  const player = PlayerProfileManager.getActive();
  if (!player) return;

  CloudService.connect();
  AchievementManager.init();
  SaveSlotManager.init();
  MatchmakingService.init();
  LeaderboardManager.init();
  Dashboard.init();
  InGameOverlay.init();
})();

console.log('WebGL2 initialized successfully!');
