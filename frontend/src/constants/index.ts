export const DEFAULT_PAGE_SIZE = 3;
export const PREDEFINED_PAGE_SIZES = [3, 5, 10, 15, 50];

export const JWT_COOKIE_NAME = "u";

export const KEY_CODES = {
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACK_SPACE: "Backspace",
  ENTER: "Enter",
  ESC: "Escape",
  SPACE: "Space",
};

export const ITEMS_COUNT_TO_USE_WORKER = 100;

export const FILTER_ALL_VALUE =
  "someLongRandomStringThatNotMatchAnyPossibleValue";

export const MAX_TOASTS_TO_DISPLAY = 3;

export const TIME_TO_DISPLAY_TOAST = 1000 * 5;

export const NEW_RELIC_OPTIONS = {
  init: {
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ["bam.eu01.nr-data.net"] },
  },
  info: {
    beacon: "bam.eu01.nr-data.net",
    errorBeacon: "bam.eu01.nr-data.net",
    licenseKey: import.meta.env.VITE_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
    sa: 1,
  },
  loader_config: {
    accountID: import.meta.env.VITE_APP_NEW_RELIC_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_APP_NEW_RELIC_TRUST_KEY,
    agentID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
    licenseKey: import.meta.env.VITE_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
  },
};
