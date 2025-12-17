const store = new Map<string, any>();

export const IdempotencyRepository = {
  get: (key: string) => store.get(key),
  save: (key: string, record: any) => store.set(key, record),
};
