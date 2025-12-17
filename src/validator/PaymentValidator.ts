import { IPaymentPayload } from "#service/PaymentService.js";

export interface IValidator<T> {
  validate(data: any): { isValid: boolean; errors: string[] };
}

export class PaymentValidator implements IValidator<IPaymentPayload> {
  validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!data.currency || typeof data.currency !== 'string') {
      errors.push('Valid currency is required');
    }

    if (!data.beneficiary) {
      errors.push('Beneficiary information is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}