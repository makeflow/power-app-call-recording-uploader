/** 一个简陋的 Go channel 风格的异步执行流同步小工具 */
export class Channel<T> {
  private resolve!: (value: T) => void;
  private p: Promise<T>;

  constructor() {
    this.p = new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  put(value: T): void {
    this.resolve(value);
  }

  get(): Promise<T> {
    return this.p;
  }
}
