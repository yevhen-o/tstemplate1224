import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { isBrowser } from "src/helpers/utils";

import { JWT_COOKIE_NAME } from "src/constants";

export function getCookieUser() {
  if (!isBrowser()) {
    return {};
  }
  const jwt_cookie = Cookies.get(JWT_COOKIE_NAME);
  if (!jwt_cookie) {
    return false;
  }
  const jwt = jwtDecode<{ sub?: string }>(jwt_cookie);

  return jwt;
}

const ROOT_STORAGE_KEY = "asp";

let isStorageSupported = false;
let storage: Record<string, any> = {};

// Test support
try {
  isStorageSupported = "localStorage" in window && window.localStorage !== null;
} catch (e) {
  // no throw
}

if (isStorageSupported) {
  try {
    const storedData = localStorage.getItem(ROOT_STORAGE_KEY);
    storage = storedData ? JSON.parse(storedData) : {};
  } catch (e) {
    storage = {};
  }
}

function storageSave(): void {
  if (isStorageSupported) {
    try {
      localStorage.setItem(ROOT_STORAGE_KEY, JSON.stringify(storage));
    } catch (e) {
      // no throw
    }
  }
}

export function storageRemoveItem<T = unknown>(key: string): T | undefined {
  const value = storage[key];
  delete storage[key];
  storageSave();
  return value;
}

export function storageGetLatest<T = unknown>(key: string, def: T): T {
  try {
    const storedData = localStorage.getItem(ROOT_STORAGE_KEY);
    const parsedStorage = storedData ? JSON.parse(storedData) : {};
    return key in parsedStorage ? parsedStorage[key] : def;
  } catch (e) {
    return def;
  }
}

export function storageGet<T = unknown>(key: string, def: T): T {
  return key in storage ? storage[key] : def;
}

export function storageSet<T = unknown>(key: string, value: T): T | undefined {
  const oldValue = storage[key];
  storage[key] = value;
  storageSave();
  return oldValue;
}

export function storageGetKey(prefix: string, resourceId?: string): string {
  const user = getCookieUser();
  let userKey: string = "unauthorized";
  if (user) {
    userKey = user.sub || "authorized_no_sub?";
  }
  return `${userKey}--${prefix}${resourceId ? `--${resourceId}` : ""}`;
}

export function storageKeys(): Record<string, string> {
  return {
    someLocalStorageKey: storageGetKey("someLocalStorageKey"),
  };
}

const storageService = {
  storageGet,
  storageSet,
  storageKeys,
  storageGetKey,
  storageGetLatest,
  storageRemoveItem,
};

export default storageService;
