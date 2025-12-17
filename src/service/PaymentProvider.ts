export class PaymentProvider {
  async auth() {
    return {
      accessToken: "abcd",
      expiresIn: 90
    }
  }
  async createBeneficiary(_token: any, beneficiary: any) {
    return beneficiary;
  }
  async createQuote(_token: any, _params: any) {

    return { quoteId: 1, totalAmount: 10000, fee: 5 }
  }
  async createOrder(_token: any, _params: any) {
    return { orderId: 1, status: "success" }
  }
}