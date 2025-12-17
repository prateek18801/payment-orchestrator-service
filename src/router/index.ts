import { Router } from "express";
import paymentRouterV1 from "./paymentRouterV1.js";

const router: Router = Router();

router.use("/v1/payments", paymentRouterV1);

export default router;
