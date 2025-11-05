import { Logger } from './Logger';

export interface PlayerProfile {
  id: string;
  name: string;
  xp: number;
  achievements: string[];
  createdAt: number;
  lastLogin: number;
}

export class PlayerProfileManager {
  private static readonly STORAGE_KEY = 'astra_profiles';
  private static currentProfile: PlayerProfile | null = null;

  static getAllProfiles(): PlayerProfile[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      Logger.error('Failed to load player profiles.');
      return [];
    }
  }

  static login(name: string): PlayerProfile {
    const profiles = this.getAllProfiles();
    let profile = profiles.find(p => p.name === name);
    const now = Date.now();

    if (!profile) {
      profile = {
        id: crypto.randomUUID(),
        name,
        xp: 0,
        achievements: [],
        createdAt: now,
        lastLogin: now
      };
      profiles.push(profile);
      Logger.info(`👤 New player created: ${name}`);
    } else {
      profile.lastLogin = now;
      Logger.info(`👤 Welcome back, ${name}`);
    }

    this.currentProfile = profile;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    return profile;
  }

  static addXP(amount: number): void {
    if (!this.currentProfile) return;
    this.currentProfile.xp += amount;
    this.saveCurrent();
  }

  static unlockAchievement(id: string): void {
    if (!this.currentProfile) return;
    if (!this.currentProfile.achievements.includes(id)) {
      this.currentProfile.achievements.push(id);
      this.saveCurrent();
      Logger.info(`🏆 Achievement unlocked: ${id}`);
    }
  }

  static getActive(): PlayerProfile | null {
    return this.currentProfile;
  }

  static saveCurrent(): void {
    if (!this.currentProfile) return;
    const profiles = this.getAllProfiles().map(p =>
      p.id === this.currentProfile!.id ? this.currentProfile : p
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
  }

  static loadActive(): void {
    const profiles = this.getAllProfiles();
    if (profiles.length > 0) this.currentProfile = profiles[0];
  }
}
