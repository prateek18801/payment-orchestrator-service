import { Router } from "express";
import { postPayment } from "#controller/paymentController.js";
import { verifyIdempotency } from "#middleware/idempotencyHandler.js";

const router: Router = Router();

router.post("/", verifyIdempotency, postPayment);

export default router;
