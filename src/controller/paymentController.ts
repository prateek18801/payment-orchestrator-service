import { makePayment } from "#service/paymentService.js";
import { Request, Response, NextFunction } from "express";

export const postPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency, beneficiary } = req.body;

    if (!amount || !currency || !beneficiary) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, or beneficiary"
      });
    }

    const payload = {
      amount,
      currency,
      beneficiary
    };

    const result = await makePayment(payload);

    return res.status(201).json({
      message: "Payment Successful",
      data: result
    });

  } catch (error: any) {  
    next(error);
  }
}
