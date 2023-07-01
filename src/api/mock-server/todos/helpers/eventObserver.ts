class EventObserver<
  ArgType,
  ReturnType,
  Type extends (arg: ArgType) => ReturnType,
> {
  observers: Type[];

  constructor() {
    this.observers = [];
  }

  subscribe(fn: Type) {
    this.observers.push(fn);
  }

  unsubscribe(fn: Type) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn);
  }

  broadcast(data: ArgType) {
    this.observers.forEach(subscriber => subscriber(data));
  }
}

export const observer = new EventObserver<
  boolean,
  void,
  (arg: boolean) => void
>();
