export function debounce(fn: Function, wait: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: any[]) {
    if (timerId) {
      clearInterval(timerId);
    }
    const context = this;
    timerId = setTimeout(() => {
      timerId = null;
      fn.apply(context, args);
    }, wait);
  };
}

export const countBy = <T>(
  arr: T[],
  fn: (value: T) => unknown
): { [key: string]: number } => {
  const result: { [key: string]: number } = {};
  return arr.reduce((acc, item) => {
    const key: string = `${fn(item)}`;
    return { ...acc, [key]: (acc[key] || 0) + 1 };
  }, result);
};

export function throttle<T>(func: Function, wait: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastInvocationTime: number | null = null;

  return function (this: T, ...args: any[]) {
    const now = Date.now();
    const context = this;
    if (timerId) {
      clearTimeout(timerId);
    }

    const applyFn = (onTimer = true) => {
      lastInvocationTime = now;
      func.apply(context, args);
    };

    if (lastInvocationTime === null || now - lastInvocationTime >= wait) {
      applyFn(false);
    } else if (!timerId) {
      const remaining = wait - (now - lastInvocationTime);
      timerId = setTimeout(applyFn, remaining);
    }
  };
}

export function deepClone<T>(obj: T, seen = new Map()): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // Check for circular references
  if (seen.has(obj)) {
    return seen.get(obj) as T;
  }

  if (obj instanceof Set) {
    let result = new Set() as T;
    seen.set(obj, result);
    result = new Set(Array.from(obj).map((item) => deepClone(item, seen))) as T;
    return result;
  }

  const clone = Array.isArray(obj)
    ? [] // Create a new array for arrays
    : Object.create(Object.getPrototypeOf(obj)); // Create a new object with the same prototype

  seen.set(obj, clone);

  const keys = [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj), // Include symbol keys
  ];

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (descriptor) {
      if (typeof descriptor.value === "object" && descriptor.value !== null) {
        // Recursively deep clone object values
        descriptor.value = deepClone(descriptor.value, seen);
      }
      Object.defineProperty(clone, key, descriptor); // Define the property with its descriptor
    }
  }

  return clone as T;
}
