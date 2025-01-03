import { debounce, countBy, throttle, deepClone } from "./utils";

describe("debounce", () => {
  test("can be initialized", () => {
    const increment = debounce(() => {}, 50);
    expect(increment).toBeTruthy();
  });

  test("executes after duration", (done) => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 10);

    expect(i).toBe(0);
    increment();
    expect(i).toBe(0);

    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });

  describe("uses arguments", () => {
    test("called once", (done) => {
      let i = 21;
      const increment = debounce((a: number, b: number) => {
        i += a * b;
      }, 10);

      expect(i).toBe(21);
      increment(3, 7);
      expect(i).toBe(21);

      setTimeout(() => {
        expect(i).toBe(42);
        done();
      }, 20);
    });

    test("uses arguments of latest invocation", (done) => {
      let i = 21;
      const increment = debounce((a: number, b: number) => {
        i += a * b;
      }, 10);

      expect(i).toBe(21);
      increment(3, 7);
      increment(4, 5);
      expect(i).toBe(21);

      setTimeout(() => {
        expect(i).toBe(41);
        done();
      }, 20);
    });
  });

  test("execute once even after calling it multiple times", (done) => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 20);

    expect(i).toBe(0);
    increment();
    increment();
    increment();
    increment();
    expect(i).toBe(0);

    // Should not fire yet.
    setTimeout(() => {
      expect(i).toBe(0);
    }, 10);

    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 30);
  });

  test("duration extended if called again during window", (done) => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 100);

    expect(i).toBe(0);
    increment();
    increment();
    expect(i).toBe(0);

    // Should not fire yet.
    setTimeout(() => {
      expect(i).toBe(0);
      increment();
      expect(i).toBe(0);
    }, 50);

    setTimeout(() => {
      // Still 0 because we fired again at t=50, increment will only happen at t=150
      expect(i).toBe(0);
    }, 125);

    setTimeout(() => {
      expect(i).toBe(1);
      done();
      // Add a longer delay because the browser timer is unreliable.
    }, 1500);
  });

  test("callbacks can access `this`", (done) => {
    const increment = debounce(function (this: any, delta: number) {
      this.val += delta;
    }, 10);

    const obj = {
      val: 2,
      increment,
    };

    expect(obj.val).toBe(2);
    obj.increment(3);
    expect(obj.val).toBe(2);

    setTimeout(() => {
      expect(obj.val).toBe(5);
      done();
    }, 20);
  });
});

describe("countBy", () => {
  test("empty array", () => {
    expect(countBy([], Math.floor)).toEqual({});
  });

  test("undefined keys", () => {
    expect(countBy([{ n: 1 }, { n: 2 }], (o: any) => o.m)).toEqual({
      undefined: 2,
    });
  });

  describe("function iteratees", () => {
    test("single-element arrays", () => {
      expect(countBy([6.1], Math.floor)).toEqual({ 6: 1 });
    });

    test("two-element arrays", () => {
      expect(countBy([6.1, 4.2], Math.floor)).toEqual({ 4: 1, 6: 1 });
    });

    test("multiple element arrays", () => {
      expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: 1, 6: 2 });
    });

    test("keys that are also properties", () => {
      expect(
        countBy(["one", "two", "three"], (val: string) => "length")
      ).toEqual({
        length: 3,
      });
    });
  });

  test("does not mutate the original array", () => {
    const arr = [6.1, 4.2, 6.3];
    const copy = arr.slice();
    const result = countBy(arr, Math.floor);
    expect(result).toEqual({ 4: 1, 6: 2 });
    expect(arr).toEqual(copy); // Ensure original array is unchanged
  });
});

describe("throttle", () => {
  test("can be initialized", () => {
    const increment = throttle(() => {}, 50);
    expect(increment).toBeInstanceOf(Function);
  });

  test("invokes callback immediately", () => {
    let i = 0;
    const increment = throttle(() => {
      i++;
    }, 50);

    expect(i).toBe(0);
    increment();
    expect(i).toBe(1);
  });

  test("throttles immediate invocations", () => {
    let i = 0;
    const increment = throttle(() => {
      i++;
    }, 50);

    expect(i).toBe(0);
    increment();
    expect(i).toBe(1);
    increment();
    expect(i).toBe(1);
  });

  test("throttles delayed invocations", (done) => {
    let i = 0;
    const increment = throttle(() => {
      i++;
    }, 100);

    expect(i).toBe(0);
    increment();
    expect(i).toBe(1);

    setTimeout(() => {
      increment();
      expect(i).toBe(1);
    }, 25);

    setTimeout(() => {
      increment();
      expect(i).toBe(1);
      done();
    }, 50);
  });

  test("uses arguments", () => {
    let i = 21;
    const increment = throttle((a: number, b: number) => {
      i += a * b;
    }, 50);

    expect(i).toBe(21);
    increment(3, 7);
    expect(i).toBe(42);
  });

  test("can be called again after first throttling window", (done) => {
    let i = 0;
    const increment = throttle(() => {
      i++;
    }, 100);

    expect(i).toBe(0);
    increment();
    increment();
    increment();
    increment();
    expect(i).toBe(1);

    // Should not fire yet.
    setTimeout(() => {
      expect(i).toBe(1);
      increment();
      increment();
      increment();
      expect(i).toBe(1);
    }, 50);

    setTimeout(() => {
      expect(i).toBe(1);
      increment();
      increment();
      increment();
      expect(i).toBe(2);
      done();
    }, 200);
  });

  test("callbacks can access `this`", (done) => {
    const increment = throttle(function (
      this: Record<string, number>,
      delta: number
    ) {
      this.val += delta;
    },
    50);

    const obj = {
      val: 2,
      increment,
    };

    expect(obj.val).toBe(2);
    obj.increment(3);
    expect(obj.val).toBe(5);

    setTimeout(() => {
      obj.increment(10);
      expect(obj.val).toBe(15);
      done();
    }, 100);
  });
});

describe("deepClone", () => {
  describe("primitive values", () => {
    expect(deepClone("foo")).toEqual("foo");
    expect(deepClone(123)).toEqual(123);
    expect(deepClone(true)).toEqual(true);
    expect(deepClone(false)).toEqual(false);
    expect(deepClone(null)).toEqual(null);
  });

  describe("objects", () => {
    test("no nesting", () => {
      const obj = { role: "foo" };
      const clonedObj = deepClone(obj);
      clonedObj.role = "bar";
      expect(obj).toEqual({ role: "foo" });
    });

    test("one level of nesting", () => {
      const obj = { user: { role: "admin", id: "123" } };
      const clonedObj = deepClone(obj);
      clonedObj.user.role = "bar";
      expect(obj).toEqual({ user: { role: "admin", id: "123" } });
    });

    test("two levels of nesting", () => {
      const obj = { a: { b: { c: "d" } }, e: "f" };
      const clonedObj = deepClone(obj);
      (clonedObj.a.b as any) = {};
      expect(obj).toEqual({ a: { b: { c: "d" } }, e: "f" });
    });

    test("containing arrays", () => {
      const obj = { foo: [{ bar: "baz" }] };
      const clonedObj = deepClone(obj);
      clonedObj.foo[0].bar = "bax";

      expect(obj).toEqual({ foo: [{ bar: "baz" }] });
    });
  });

  describe("arrays", () => {
    test("containing objects", () => {
      const obj = [{ a: "foo" }, { b: "bar" }];
      const clonedObj = deepClone(obj);
      clonedObj[1].b = "baz";

      expect(obj).toEqual([{ a: "foo" }, { b: "bar" }]);
    });

    test("containing nested objects", () => {
      const obj = [{ a: { id: "foo" } }, { b: { id: "baz" } }];
      const clonedObj = deepClone(obj);
      clonedObj[1].b = { id: "bax" };

      expect(obj).toEqual([{ a: { id: "foo" } }, { b: { id: "baz" } }]);
    });
  });
});

interface CustomInstance {
  a: number;
  greet(): string;
  [key: symbol]: any;
  hidden: any;
  nested: CustomInstance;
}

interface CustomConstructor {
  new (): CustomInstance;
  prototype: CustomInstance;
}

describe("deepClone - Sets", () => {
  test("Cloning a Set with primitive values", () => {
    const original = new Set([1, 2, 3]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original); // Deep equality
    expect(cloned).not.toBe(original); // Ensure it's a different instance
    expect(Array.from(cloned)).toEqual(Array.from(original)); // Elements match
  });

  test("Cloning a Set with object values", () => {
    const obj1 = { key: "value1" };
    const obj2 = { key: "value2" };
    const original = new Set([obj1, obj2]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // Ensure cloned objects are not the same reference
    const [clonedObj1, clonedObj2] = Array.from(cloned);
    expect(clonedObj1).not.toBe(obj1);
    expect(clonedObj2).not.toBe(obj2);
    expect(clonedObj1).toEqual(obj1);
    expect(clonedObj2).toEqual(obj2);
  });

  test("Cloning a Set with nested Sets", () => {
    const nestedSet = new Set(["a", "b"]);
    const original = new Set([nestedSet]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    const [clonedNestedSet]: Set<string>[] = Array.from(cloned);
    expect(clonedNestedSet).not.toBe(nestedSet);
    expect(Array.from(clonedNestedSet)).toEqual(Array.from(nestedSet));
  });

  test("Cloning a Set with mixed types", () => {
    const obj = { key: "value" };
    const original = new Set([42, "string", obj]);
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    const [clonedNumber, clonedString, clonedObject] = Array.from(cloned);
    expect(clonedNumber).toBe(42);
    expect(clonedString).toBe("string");
    expect(clonedObject).not.toBe(obj);
    expect(clonedObject).toEqual(obj);
  });

  test("Cloning an empty Set", () => {
    const original = new Set();
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(Array.from(cloned)).toEqual([]);
  });

  test("Deep clone object with non-enumerable properties", () => {
    const original: Record<string, any> = {};
    Object.defineProperty(original, "hidden", {
      value: "non-enumerable",
      enumerable: false,
      writable: true,
      configurable: true,
    });

    const clone = deepClone(original);

    expect(Object.keys(clone)).not.toContain("hidden"); // Should not be in enumerable keys
    expect(Object.getOwnPropertyDescriptor(clone, "hidden")).toEqual({
      value: "non-enumerable",
      enumerable: false,
      writable: true,
      configurable: true,
    });
    expect(clone.hidden).toBe("non-enumerable"); // Value should match
  });
  test("Deep clone object with symbol-keyed properties", () => {
    const symKey = Symbol("key");
    const original = { [symKey]: "symbolValue" };

    const clone = deepClone(original);

    expect(clone[symKey]).toBe("symbolValue"); // Symbol-keyed property should be cloned
    expect(Object.getOwnPropertySymbols(clone)).toContain(symKey); // Symbol should exist in clone
  });
  test("Deep clone object and preserve prototype", () => {
    const CustomConstructor: CustomConstructor = function (
      this: CustomInstance
    ) {
      this.a = 1;
    } as any;
    CustomConstructor.prototype.greet = function () {
      return "Hello!";
    };

    const original = new CustomConstructor();
    const clone = deepClone(original);

    expect(clone.a).toBe(1); // Ensure property is cloned
    expect(clone.greet()).toBe("Hello!"); // Ensure prototype method works
    expect(Object.getPrototypeOf(clone)).toBe(CustomConstructor.prototype); // Prototype should match
  });
  test("Deep clone object with non-enumerable, symbol-keyed properties, and prototype", () => {
    const symKey = Symbol("key");
    const CustomConstructor: CustomConstructor = function (
      this: CustomInstance
    ) {
      this.a = 1;
    } as any;
    CustomConstructor.prototype.greet = function () {
      return "Hello!";
    };

    const original = new CustomConstructor();
    Object.defineProperty(original, "hidden", {
      value: "non-enumerable",
      enumerable: false,
      writable: true,
      configurable: true,
    });
    original[symKey] = "symbolValue";

    const clone = deepClone(original);

    // Check properties
    expect(clone.a).toBe(1);
    expect(clone[symKey]).toBe("symbolValue");
    expect(clone.hidden).toBe("non-enumerable");

    // Check descriptors
    expect(Object.getOwnPropertyDescriptor(clone, "hidden")).toEqual({
      value: "non-enumerable",
      enumerable: false,
      writable: true,
      configurable: true,
    });

    // Check prototype
    expect(clone.greet()).toBe("Hello!");
    expect(Object.getPrototypeOf(clone)).toBe(CustomConstructor.prototype);
  });
  test("Deep clone nested object with complex properties", () => {
    const symKey = Symbol("key");
    const original: Record<string, Record<string | symbol, any>> = {
      nested: {
        value: 42,
      },
    };
    Object.defineProperty(original.nested, "hidden", {
      value: "non-enumerable",
      enumerable: false,
    });
    original.nested[symKey] = "symbolValue";

    const clone = deepClone(original);

    // Check nested properties
    expect(clone.nested.value).toBe(42);
    expect(clone.nested[symKey]).toBe("symbolValue");
    expect(Object.getOwnPropertyDescriptor(clone.nested, "hidden")).toEqual({
      value: "non-enumerable",
      enumerable: false,
      writable: false,
      configurable: false,
    });
  });
  test("Clone object with a circular reference", () => {
    const obj: any = { name: "A" };
    obj.self = obj;

    const clone = deepClone(obj);

    expect(clone).not.toBe(obj);
    expect(clone.name).toBe("A");
    expect(clone.self).toBe(clone);
  });
  test("Clone object with nested circular references", () => {
    const a: any = { name: "A" };
    const b: any = { name: "B" };
    a.child = b;
    b.parent = a;

    const clone = deepClone(a);

    expect(clone).not.toBe(a);
    expect(clone.child).not.toBe(b);
    expect(clone.child.parent).toBe(clone);
  });
});
