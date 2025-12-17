import { IPaymentProvider } from "./PaymentProvider.js";

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

  constructor(private paymentProvider: IPaymentProvider) { }

  async processPayment(payload: IPaymentPayload): Promise<IPaymentResult> {
    const auth = await this.paymentProvider.auth();
    const beneficiary = await this.paymentProvider.createBeneficiary(
      auth.accessToken,
      payload.beneficiary
    );

    const quote = await this.paymentProvider.createQuote(auth.accessToken, {
      amount: payload.amount,
      currency: payload.currency,
      beneficiaryId: beneficiary.beneficiaryId,
    });

    let order;
    try {
      order = await this.paymentProvider.createOrder(auth.accessToken, {
        quoteId: quote.quoteId,
      });
    } catch (error: any) {
      if (error.statusCode === 503) {
        order = await this.paymentProvider.createOrder(auth.accessToken, {
          quoteId: quote.quoteId,
        });
      } else {
        throw error;
      }
    }

    return {
      orderId: order.orderId,
      status: order.status,
      quoteInfo: {
        id: quote.quoteId,
        total: quote.totalAmount,
        fee: quote.fee,
      },
      beneficiaryId: beneficiary.beneficiaryId,
    };
  }
}