import { ILogger } from "#util/Logger.js";
import { RetryUtil } from "#util/RetryUtil.js";

export interface IAuthToken {
  accessToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface IPaymentProvider {
  auth(): Promise<{ accessToken: string; expiresIn: number }>;
  createBeneficiary(token: string, beneficiary: any): Promise<any>;
  createQuote(token: string, params: any): Promise<any>;
  createOrder(token: string, params: any): Promise<any>;
}

export class PaymentProvider implements IPaymentProvider {
  private static instance: PaymentProvider;
  private cachedToken: IAuthToken | null = null;
  private retryUtil: RetryUtil;

  private constructor(private logger: ILogger) {
    this.retryUtil = new RetryUtil(logger);
  }

  public static getInstance(logger?: ILogger): PaymentProvider {
    if (!PaymentProvider.instance) {
      if (!logger) {
        throw new Error('Logger is required for first PaymentProvider instantiation');
      }
      PaymentProvider.instance = new PaymentProvider(logger);
    }
    return PaymentProvider.instance;
  }

  async auth(): Promise<{ accessToken: string; expiresIn: number }> {

    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      this.logger.info('Using cached authentication token');
      return {
        accessToken: this.cachedToken.accessToken,
        expiresIn: Math.floor((this.cachedToken.expiresAt - Date.now()) / 1000),
      };
    }

    this.logger.info('Authenticating with payment provider');

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresIn = 3600;
    const expiresAt = Date.now() + expiresIn * 1000;

    this.cachedToken = { accessToken: token, expiresIn, expiresAt };
    this.logger.debug('Authentication successful, token cached', { expiresIn });

    return { accessToken: token, expiresIn };
  }

  async createBeneficiary(_token: string, beneficiary: any): Promise<any> {
    this.logger.info('Creating beneficiary', { beneficiary });

    const beneficiaryId = `ben_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const response = {
      beneficiaryId,
      ...beneficiary,
      createdAt: new Date().toISOString(),
    };

    this.logger.debug('Beneficiary created successfully', { beneficiaryId });
    return response;
  }

  async createQuote(_token: string, _params: any): Promise<any> {
    this.logger.info('Creating quote', { params: _params });

    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const response = {
      quoteId,
      totalAmount: _params.amount || 10000,
      fee: Math.ceil((_params.amount || 10000) * 0.005),
      currency: _params.currency || 'USD',
      validUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    this.logger.debug('Quote created successfully', { quoteId });
    return response;
  }

  async createOrder(_token: string, _params: any): Promise<any> {
    const operationName = `createOrder (quoteId: ${_params?.quoteId})`;

    return this.retryUtil.executeWithRetry(
      async () => {
        this.logger.info('Creating order', { params: _params });

        if (Math.random() < 0.3) {
          const err: any = new Error('Temporary failure - service unavailable');
          err.statusCode = 503;
          this.logger.warn('Order creation failed with transient error', { statusCode: 503 });
          throw err;
        }

        const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const response = {
          orderId,
          quoteId: _params?.quoteId,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        this.logger.info('Order created successfully', { orderId });
        return response;
      },
      operationName
    );
  }
}