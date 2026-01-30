/**
 * Logger Utility
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private level: LogLevel = LogLevel.INFO

  setLevel(level: LogLevel): void {
    this.level = level
  }

  debug(message: string, meta?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, meta ?? '')
    }
  }

  info(message: string, meta?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, meta ?? '')
    }
  }

  warn(message: string, meta?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, meta ?? '')
    }
  }

  error(message: string, error?: Error | any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error ?? '')
    }
  }
}

export const logger = new Logger()
