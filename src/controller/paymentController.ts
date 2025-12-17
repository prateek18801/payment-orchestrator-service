import { Request, Response, NextFunction } from "express";
import { AppError } from "#error/AppError.js";
import { IPaymentPayload, IPaymentService } from "#service/PaymentService.js";
import { IValidator } from "../validator/PaymentValidator.js";

export interface IPaymentController {
  handlePostPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class PaymentController implements IPaymentController {
  constructor(
    private paymentService: IPaymentService,
    private validator: IValidator<IPaymentPayload>
  ) { }

  async handlePostPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = this.validator.validate(req.body);

      if (!validation.isValid) {
        throw new AppError({
          message: validation.errors.join(', '),
          code: 'VALIDATION_ERROR',
          httpStatusCode: 400,
        });
      }

      const result = await this.paymentService.processPayment(req.body);

      res.status(201).json({
        message: "Payment Successful",
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
}