export interface IPaymentProvider {
  auth(): Promise<{ accessToken: string; expiresIn: number }>;
  createBeneficiary(token: string, beneficiary: any): Promise<any>;
  createQuote(token: string, params: any): Promise<any>;
  createOrder(token: string, params: any): Promise<any>;
}

export class PaymentProvider implements IPaymentProvider {

  private static instance: PaymentProvider;

  private constructor() { }

  public static getInstance(): PaymentProvider {
    if (!PaymentProvider.instance) {
      PaymentProvider.instance = new PaymentProvider();
    }
    return PaymentProvider.instance;
  }

  async auth() {
    return {
      accessToken: "abcd",
      expiresIn: 90
    };
  }

  async createBeneficiary(_token: string, beneficiary: any) {
    return beneficiary;
  }

  async createQuote(_token: string, _params: any) {
    return { quoteId: 1, totalAmount: 10000, fee: 5 };
  }

  async createOrder(_token: string, _params: any) {
    return { orderId: 1, status: "success" };
  }
}