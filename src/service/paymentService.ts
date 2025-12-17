import { IPaymentProvider } from "./PaymentProvider.js";
import { ILogger } from "#util/Logger.js";

export interface IPaymentService {
  processPayment(payload: IPaymentPayload): Promise<IPaymentResult>;
}

export interface IPaymentPayload {
  amount: number;
  currency: string;
  beneficiary: any;
}

export interface IPaymentResult {
  orderId: string | number;
  status: string;
  quoteInfo: {
    id: string | number;
    total: number;
    fee: number;
  };
  beneficiaryId: any;
}

export class PaymentService implements IPaymentService {
  constructor(
    private paymentProvider: IPaymentProvider,
    private logger: ILogger
  ) {}

  async processPayment(payload: IPaymentPayload): Promise<IPaymentResult> {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.info(`[${transactionId}] Starting payment processing`, { payload });

    try {
      this.logger.debug(`[${transactionId}] Step 1: Authenticating with provider`);
      const auth = await this.paymentProvider.auth();

      this.logger.debug(`[${transactionId}] Step 2: Creating beneficiary`);
      const beneficiary = await this.paymentProvider.createBeneficiary(
        auth.accessToken,
        payload.beneficiary
      );

      this.logger.debug(`[${transactionId}] Step 3: Creating quote`);
      const quote = await this.paymentProvider.createQuote(auth.accessToken, {
        amount: payload.amount,
        currency: payload.currency,
        beneficiaryId: beneficiary.beneficiaryId,
      });

      this.logger.debug(`[${transactionId}] Step 4: Creating order (may retry on transient failures)`);
      const order = await this.paymentProvider.createOrder(auth.accessToken, {
        quoteId: quote.quoteId,
      });

      const result: IPaymentResult = {
        orderId: order.orderId,
        status: order.status,
        quoteInfo: {
          id: quote.quoteId,
          total: quote.totalAmount,
          fee: quote.fee,
        },
        beneficiaryId: beneficiary.beneficiaryId,
      };

      this.logger.info(`[${transactionId}] Payment processing completed successfully`, { result });
      return result;
    } catch (error: any) {
      this.logger.error(`[${transactionId}] Payment processing failed`, error);
      throw error;
    }
  }
}