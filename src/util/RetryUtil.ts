import { ILogger } from "./Logger.js";

export interface IRetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

export class RetryUtil {
  private readonly config: IRetryConfig;

  constructor(
    private logger: ILogger,
    config?: Partial<IRetryConfig>
  ) {
    this.config = {
      maxAttempts: config?.maxAttempts ?? 3,
      initialDelayMs: config?.initialDelayMs ?? 100,
      maxDelayMs: config?.maxDelayMs ?? 5000,
      backoffMultiplier: config?.backoffMultiplier ?? 2,
      retryableStatusCodes: config?.retryableStatusCodes ?? [502, 503, 504],
    };
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        this.logger.debug(`Executing ${operationName} (attempt ${attempt}/${this.config.maxAttempts})`);
        return await operation();
      } catch (error: any) {
        lastError = error;
        const isRetryable =
          this.config.retryableStatusCodes.includes(error.statusCode) &&
          attempt < this.config.maxAttempts;

        if (isRetryable) {
          const delay = this.calculateBackoffDelay(attempt);
          this.logger.warn(
            `${operationName} failed with status ${error.statusCode}, retrying in ${delay}ms (attempt ${attempt}/${this.config.maxAttempts})`,
            { error: error.message }
          );
          await this.sleep(delay);
        } else {
          this.logger.error(`${operationName} failed (attempt ${attempt}/${this.config.maxAttempts})`, error);
          throw error;
        }
      }
    }

    throw lastError;
  }

  private calculateBackoffDelay(attempt: number): number {
    const delay = this.config.initialDelayMs * Math.pow(this.config.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.config.maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
