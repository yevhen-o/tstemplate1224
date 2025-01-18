export function debounce<
  T extends (
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => any // eslint-disable-line @typescript-eslint/no-explicit-any
>(fn: T, wait: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (
    this: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...args: Parameters<T>
  ) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = null;
      fn.apply(this, args);
    }, wait);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
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

export function throttle<
  T extends (
    ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => any // eslint-disable-line @typescript-eslint/no-explicit-any
>(func: T, wait: number): T & { cancel: () => void } {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastInvocationTime: number | null = null;

  const throttled = function (
    this: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...args: Parameters<T>
  ) {
    const now = Date.now();

    const applyFn = () => {
      lastInvocationTime = now;
      func.apply(this, args); // Directly use `this` here
    };

    if (timerId) {
      clearTimeout(timerId);
    }

    if (lastInvocationTime === null || now - lastInvocationTime >= wait) {
      applyFn();
    } else {
      const remaining = wait - (now - lastInvocationTime);
      timerId = setTimeout(applyFn, remaining);
    }
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastInvocationTime = null;
  };

  return throttled;
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

// nice check for ssr
export const isBrowser = (): boolean => typeof document !== "undefined";

export function deepEqual(valueA: unknown, valueB: unknown): boolean {
  if (valueA === valueB) {
    return true;
  }

  if (
    ["string", "number", "boolean", "symbol"].includes(typeof valueA) ||
    valueA === null
  ) {
    return valueA === valueB;
  }

  if (Array.isArray(valueA) || Array.isArray(valueB)) {
    if (
      !Array.isArray(valueB) ||
      !Array.isArray(valueA) ||
      valueA.length !== valueB.length
    ) {
      return false;
    }
    for (let i = 0; i < valueA.length; i++) {
      if (!deepEqual(valueA[i], valueB[i])) {
        return false;
      }
    }
    return true;
  }

  if (typeof valueA === "object" && typeof valueB === "object") {
    if (valueA === null || valueB === null) return false;

    const keysA = Object.keys(valueA);
    const keysB = Object.keys(valueB);

    // Compare keys lengths and values
    if (keysA.length !== keysB.length || !deepEqual(keysA, keysB)) {
      return false;
    }

    // Compare each key's value
    for (const key of keysA) {
      if (
        !deepEqual(
          (valueA as Record<string, unknown>)[key],
          (valueB as Record<string, unknown>)[key]
        )
      ) {
        return false;
      }
    }

    return true;
  }
  return false;
}
