import { Logger } from './Logger';

export class LeaderboardManager {
  private static scores: { name: string; score: number }[] = [];

  static init() {
    Logger.info('🏆 Leaderboard initialized.');
  }

  static submitScore(score: number) {
    const name = 'Player';
    this.scores.push({ name, score });
    this.scores.sort((a, b) => b.score - a.score);
    Logger.info(`⭐ New score submitted: ${score}`);
  }

  static getTopScores(limit = 10) {
    return this.scores.slice(0, limit);
  }
}
