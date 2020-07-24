export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let lastCallTime = new Date(0);
  let latestArgs: any[] = [];
  let lastTimer: number;

  const callFn = () => {
    lastCallTime = new Date();
    fn(...latestArgs);
  };

  return (...args: Parameters<T>) => {
    const now = new Date();
    latestArgs = args;
    clearTimeout(lastTimer);
    if (Number(now) - Number(lastCallTime) > delay) {
      callFn();
    } else {
      lastTimer = setTimeout(callFn, delay);
    }
  };
}

export function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
  let ticking = false;
  return (...args: Parameters<T>) => {
    if (ticking) {
      return;
    }
    requestAnimationFrame(() => {
      fn(...args);
      ticking = false;
    });
    ticking = true;
  };
}
