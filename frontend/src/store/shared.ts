import { useToastStore } from "./toasts/toastsStore";
import { RequestConfig, KnownError } from "src/Types/httpTypes";

export type SliceError = KnownError | null | undefined;

export type ActionMeta = {
  requestId: string;
  aborted: boolean;
  condition: boolean;
} & (
  | {
      rejectedWithValue: true;
    }
  | ({
      rejectedWithValue: false;
    } & {})
);

export const initialFetchingState = {
  latestRequestId: "",
  isFetching: false,
  isFetched: false,
  error: null,
};

export const setFetchingState = <T>(section: T, latestRequestId: string) => ({
  ...section,
  latestRequestId,
  isFetching: true,
  isFetched: false,
  error: null,
});

export const setFulfilledState = <T>(section: T) => ({
  ...section,
  isFetching: false,
  isFetched: true,
});

export const setRejectedState = <T extends RequestState>(
  section: T,
  meta: ActionMeta,
  actionPayload: SliceError,
  actionErrorMessage: string | undefined = "Something goes wrong"
) => {
  const { requestId, condition, aborted } = meta;
  section = { ...section, isFetched: false, isFetching: false };
  if (section.latestRequestId === requestId) {
    if (!condition && !aborted) {
      if (actionPayload) {
        section.error = actionPayload;
      } else {
        section.error = new Error(actionErrorMessage);
      }
    }
  }
  return section;
};

export const updateItemById = <
  T extends { [key: string]: unknown },
  V extends { uid: string }
>(
  section: T,
  item: V
) => ({
  ...section,
  [item.uid]: {
    ...(section[item.uid] || {}),
    ...item,
    fetchedTime: Date.now(),
  },
});

export interface RequestState {
  latestRequestId: string;
  isFetching: boolean;
  isFetched: boolean;
  error: SliceError;
}

export interface FetchedTime {
  fetchedTime?: number;
}

export async function genericRequest<T, R>(
  config: RequestConfig<T>,
  thunkApi: { rejectWithValue: (value: KnownError) => R }
): Promise<T | R> {
  const addToast = useToastStore.getState().addToast;
  const { url, additionalOptions: options, ...restConfig } = config;
  try {
    const response = await fetch(url, { ...restConfig });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const json = await response.json();
    if (
      options &&
      options.deriveSuccessMessage &&
      !!options.deriveSuccessMessage(json)
    ) {
      addToast({ message: options.deriveSuccessMessage(json) });
    } else if (options && options.successMessage) {
      addToast({ message: options.successMessage });
    }
    return json;
  } catch (error: unknown) {
    if (
      options &&
      options.deriveErrorMessage &&
      !!options.deriveErrorMessage(error)
    ) {
      addToast({ message: options.deriveErrorMessage(error) });
    } else if (options && options.errorMessage) {
      addToast({ message: options.errorMessage });
    }
    return thunkApi.rejectWithValue({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
