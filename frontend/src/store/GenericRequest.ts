import { RootState } from "./store";
import { useToastStore } from "./toasts/toastsStore";
import { RequestConfig, KnownError } from "src/Types/httpTypes";

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: string;
};

export type UserTypeAccess = UserType & { accessToken: string };

const RenewToken = async () => {
  const response = await fetch("/api/users/token", { method: "POST" });
  const user = await response.json();
  return user;
};

export async function genericRequest<T, R>(
  config: RequestConfig<T>,
  thunkApi: {
    rejectWithValue: (value: KnownError) => R;
    getState: () => unknown;
    dispatch: (action: { type: string; payload: unknown }) => void;
  }
): Promise<T | R> {
  const addToast = useToastStore.getState().addToast;
  const { url, additionalOptions: options, ...restConfig } = config;
  const state = thunkApi.getState() as RootState;

  const makeRequest = async (accessToken: string | null) => {
    const response = await fetch(url, {
      ...restConfig,
      headers: {
        ...restConfig.headers,
        ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = response.status !== 204 ? await response.json() : {};

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
  };

  try {
    const accessToken = state.user.user?.accessToken || null;

    // Attempt initial request
    return await makeRequest(accessToken);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("401") &&
      state.user.user !== null
    ) {
      try {
        // Handle token refresh
        const refreshedUser = await RenewToken();
        if (!refreshedUser || !refreshedUser.accessToken) {
          throw new Error("Failed to refresh token");
        }

        // Update state with refreshed token
        thunkApi.dispatch?.({
          type: "user/setUser",
          payload: refreshedUser,
        });

        // Retry the original request with the new token
        return await makeRequest(refreshedUser.accessToken);
      } catch {
        // Update state with refreshed token
        thunkApi.dispatch?.({
          type: "user/setUser",
          payload: null,
        });
        if (state.user.user) {
          addToast({
            message: "Session expired. Please log in again.",
            isError: true,
          });
        }
        return thunkApi.rejectWithValue({
          message: "Failed to refresh token. Please log in again.",
        });
      }
    }

    // Handle other errors
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
