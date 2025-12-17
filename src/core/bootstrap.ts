import { container } from "./container.js";
import { PaymentProvider } from "#service/PaymentProvider.js";
import { PaymentService } from "#service/PaymentService.js";
import { PaymentController } from "#controller/PaymentController.js";
import { PaymentValidator } from "#validator/PaymentValidator.js";
import { IdempotencyRepository } from "#repository/idempotencyRepository.js";
import { IdempotencyHandler } from "#middleware/idempotencyHandler.js";
import { ILogger, Logger } from "#util/Logger.js";

export function bootstrapDependencies(): void {
  // Register Logger as Singleton
  container.register(
    'Logger',
    () => Logger.getInstance(),
    true
  );

  // Register IdempotencyRepository as Singleton
  container.register(
    'IdempotencyRepository',
    () => IdempotencyRepository.getInstance(),
    true
  );

  // Register PaymentProvider as Singleton with Logger dependency
  container.register(
    'PaymentProvider',
    () => {
      const logger = container.get<ILogger>('Logger');
      return PaymentProvider.getInstance(logger);
    },
    true
  );

  // Register PaymentValidator as Singleton
  container.register(
    'PaymentValidator',
    () => new PaymentValidator(),
    true
  );

  // Register IdempotencyHandler with its dependencies
  container.register(
    'IdempotencyHandler',
    () => {
      const repository = container.get<IdempotencyRepository>('IdempotencyRepository');
      return new IdempotencyHandler(repository);
    },
    true
  );

  // Register PaymentService with its dependencies
  container.register(
    'PaymentService',
    () => {
      const provider = container.get<PaymentProvider>('PaymentProvider');
      const logger = container.get<ILogger>('Logger');
      return new PaymentService(provider, logger);
    },
    true
  );

  // Register PaymentController with its dependencies
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