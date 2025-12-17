export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  private constructor() { }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register(key: string, factory: (...args: any[]) => any, singleton: boolean = false): void {
    this.services.set(key, { factory, singleton });
  }

  public get<T>(key: string, ...args: any[]): T {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(`Service ${key} not registered`);
    }

    if (service.singleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, service.factory(...args));
      }
      return this.singletons.get(key);
    }

    return service.factory(...args);
  }

  public reset(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

export const container = Container.getInstance();