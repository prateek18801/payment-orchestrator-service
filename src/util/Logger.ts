export interface ILogger {
  info(message: string, data?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}

export class Logger implements ILogger {
  private static instance: Logger;
  private readonly serviceName: string;

  private constructor() {
    this.serviceName = process.env.SERVICE_NAME || 'PaymentService';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, data?: any): void {
    console.log(`[${this.serviceName}] [INFO] ${message}`, data ? JSON.stringify(data) : '');
  }

  error(message: string, error?: any): void {
    console.error(`[${this.serviceName}] [ERROR] ${message}`, error ? JSON.stringify(error) : '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.serviceName}] [WARN] ${message}`, data ? JSON.stringify(data) : '');
  }

  debug(message: string, data?: any): void {
    if (process.env.DEBUG === 'true') {
      console.debug(`[${this.serviceName}] [DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
}
