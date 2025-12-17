export interface IIdempotencyRecord {
  requestBody: string;
  response: {
    status: number;
    body: any;
  };
}

export interface IIdempotencyRepository {
  get(key: string): IIdempotencyRecord | undefined;
  save(key: string, record: IIdempotencyRecord): void;
  clear(): void;
}

export class IdempotencyRepository implements IIdempotencyRepository {
  private static instance: IdempotencyRepository;
  private store: Map<string, IIdempotencyRecord> = new Map();

  private constructor() {}

  public static getInstance(): IdempotencyRepository {
    if (!IdempotencyRepository.instance) {
      IdempotencyRepository.instance = new IdempotencyRepository();
    }
    return IdempotencyRepository.instance;
  }

  get(key: string): IIdempotencyRecord | undefined {
    return this.store.get(key);
  }

  save(key: string, record: IIdempotencyRecord): void {
    this.store.set(key, record);
  }

  clear(): void {
    this.store.clear();
  }
}
