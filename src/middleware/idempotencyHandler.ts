import { Request, Response, NextFunction } from "express";
import { IIdempotencyRepository } from "#repository/idempotencyRepository.js";

export interface IIdempotencyHandler {
  handle(): (req: Request, res: Response, next: NextFunction) => void;
}

export class IdempotencyHandler implements IIdempotencyHandler {
  constructor(private idempotencyRepository: IIdempotencyRepository) {}

  handle() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = req.header("Idempotency-Key") as string;

      if (!key) {
        return res.status(400).json({ error: "Idempotency-Key header is required" });
      }

      const existingRecord = this.idempotencyRepository.get(key);
      const reqBodyString = JSON.stringify(req.body || {});

      if (existingRecord) {
        if (existingRecord.requestBody === reqBodyString) {
          console.log(`[Idempotency] Replaying cached response for key: ${key}`);
          return res.status(existingRecord.response.status).json(existingRecord.response.body);
        }

        return res.status(409).json({ error: "Idempotency key conflict: different payload" });
      }

      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);
      let saved = false;

      const saveResponse = (body: any) => {
        if (saved) return;
        const record = {
          requestBody: reqBodyString,
          response: {
            status: res.statusCode || 200,
            body,
          },
        };
        this.idempotencyRepository.save(key, record);
        saved = true;
      };

      res.json = function (body?: any) {
        saveResponse(body);
        return originalJson(body);
      } as any;

      res.send = function (body?: any) {
        let parsedBody: any = body;
        if (typeof body === "string") {
          try {
            parsedBody = JSON.parse(body);
          } catch (e) {
            // keep as string
          }
        }
        saveResponse(parsedBody);
        return originalSend(body as any);
      } as any;

      next();
    };
  }
}