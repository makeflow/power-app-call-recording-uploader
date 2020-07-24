import {throttle} from './throttle';

export class ThrottledEventStream<T> {
  private static DELAY = 16;

  private isDestroyed = false;
  private callbacks: ((arg: T) => void)[] = [];

  subscribe(callback: (arg: T) => void): void {
    if (this.isDestroyed) {
      return;
    }
    this.callbacks.push(throttle(callback, ThrottledEventStream.DELAY));
  }

  emit(arg: T): void {
    if (this.isDestroyed) {
      return;
    }
    this.callbacks.forEach((f) => f(arg));
  }

  destroy(): void {
    this.isDestroyed = true;
    this.callbacks = [];
  }
}

export class SingleEvent<T> {
  private callback: Function | undefined;
  private triggered = false;

  emit(arg: T): void {
    if (typeof this.callback === 'undefined' || this.triggered) {
      return;
    }
    this.callback(arg);
    this.triggered = true;
  }

  onTrigger(callback: Function): void {
    if (this.triggered) {
      return;
    }
    this.callback = callback;
  }
}
