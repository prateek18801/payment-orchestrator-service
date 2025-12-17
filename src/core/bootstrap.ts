import { container } from "./container.js";
import { PaymentProvider } from "#service/PaymentProvider.js";
import { PaymentService } from "#service/PaymentService.js";
import { PaymentController } from "#controller/PaymentController.js";
import { PaymentValidator } from "#validator/PaymentValidator.js";
import { IdempotencyRepository } from "#repository/idempotencyRepository.js";
import { IdempotencyHandler } from "#middleware/idempotencyHandler.js";

export function bootstrapDependencies(): void {
  container.register(
    'IdempotencyRepository',
    () => IdempotencyRepository.getInstance(),
    true
  );

  container.register(
    'PaymentProvider',
    () => PaymentProvider.getInstance(),
    true
  );

  container.register(
    'PaymentValidator',
    () => new PaymentValidator(),
    true
  );

  container.register(
    'IdempotencyHandler',
    () => {
      const repository = container.get<IdempotencyRepository>('IdempotencyRepository');
      return new IdempotencyHandler(repository);
    },
    true
  );

  container.register(
    'PaymentService',
    () => {
      const provider = container.get<PaymentProvider>('PaymentProvider');
      return new PaymentService(provider);
    },
    true
  );

  container.register(
    'PaymentController',
    () => {
      const service = container.get<PaymentService>('PaymentService');
      const validator = container.get<PaymentValidator>('PaymentValidator');
      return new PaymentController(service, validator);
    },
    true
  );
}