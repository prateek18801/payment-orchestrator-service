import { Router, Request, Response, NextFunction } from "express";
import { container } from "#core/container.js";
import { PaymentController } from "#controller/PaymentController.js";
import { IdempotencyHandler } from "#middleware/idempotencyHandler.js";

const router: Router = Router();

router.post("/",
  (req: Request, res: Response, next: NextFunction) => {
    const idempotencyHandler = container.get<IdempotencyHandler>('IdempotencyHandler');
    return idempotencyHandler.handle()(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    const paymentController = container.get<PaymentController>('PaymentController');
    return paymentController.handlePostPayment(req, res, next);
  }
);

export default router;
