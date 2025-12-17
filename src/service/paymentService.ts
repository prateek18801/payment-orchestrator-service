import { PaymentProvider } from "./PaymentProvider.js";

const provider = new PaymentProvider();

export const makePayment = async (payload: any) => {

  const auth = await provider.auth();

  const beneficiary = await provider.createBeneficiary(auth.accessToken, payload.beneficiary);

  const quote = await provider.createQuote(auth.accessToken, {
    amount: payload.amount,
    currency: payload.currency,
    beneficiaryId: beneficiary.beneficiaryId,
  });

  let order;
  try {
    order = await provider.createOrder(auth.accessToken, {
      quoteId: quote.quoteId,
    });
  } catch (error: any) {
    if (error.statusCode === 503) {
      order = await provider.createOrder(auth.accessToken, { quoteId: quote.quoteId });
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
