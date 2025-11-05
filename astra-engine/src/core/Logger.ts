// src/core/Logger.ts

export const LogLevel = {
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  WARN: 'WARN',
  ERROR: 'ERROR'
} as const;

export type LogLevelType = keyof typeof LogLevel;

/**
 * AstraEngine Logger
 * - Pretty timestamped console output
 * - Accepts multiple arguments for structured logging
 */
export class Logger {
  static level: LogLevelType = 'DEBUG';

  private static levelOrder: LogLevelType[] = ['INFO', 'DEBUG', 'WARN', 'ERROR'];

  private static getColor(level: LogLevelType): string {
    switch (level) {
      case 'INFO': return '#00aaff';
      case 'DEBUG': return '#aaaaff';
      case 'WARN': return '#ffcc00';
      case 'ERROR': return '#ff5555';
      default: return '#ffffff';
    }
  }

  private static shouldLog(level: LogLevelType): boolean {
    const currentIdx = this.levelOrder.indexOf(level);
    const minIdx = this.levelOrder.indexOf(this.level);
    return currentIdx >= minIdx;
  }

  /** Generic logger supporting multiple arguments */
  static log(level: LogLevelType, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const color = this.getColor(level);
    const prefix = `%c[${timestamp}] [${level}]`;

    switch (level) {
      case 'INFO':
        console.info(prefix, `color:${color}`, ...args);
        break;
      case 'DEBUG':
        console.debug(prefix, `color:${color}`, ...args);
        break;
      case 'WARN':
        console.warn(prefix, `color:${color}`, ...args);
        break;
      case 'ERROR':
        console.error(prefix, `color:${color}`, ...args);
        break;
    }
  }

  // Convenience wrappers
  static info(...args: any[]) { this.log('INFO', ...args); }
  static debug(...args: any[]) { this.log('DEBUG', ...args); }
  static warn(...args: any[]) { this.log('WARN', ...args); }
  static error(...args: any[]) { this.log('ERROR', ...args); }
}
