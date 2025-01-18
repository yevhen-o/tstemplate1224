import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { RequestConfig } from "src/Types/httpTypes";
import {
  RequestState,
  initialFetchingState,
  setFetchingState,
  setFulfilledState,
  setRejectedState,
  SliceError,
  genericRequest,
} from "../shared";
import { hashString } from "src/helpers/utils/hashString";
import { Role } from "src/services/auth/abac";

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: string;
};

export type UserTypeAccess = UserType & {
  accessToken: string;
  roles: {
    organizationId: number;
    domain: string;
    role: Role;
  }[];
};

type StateType = {
  init: RequestState;
  login: RequestState & {
    data: Partial<UserType>;
  };
  logout: RequestState;
  logoutAll: RequestState;
  signup: RequestState;
  user: UserTypeAccess | null | undefined;
};

const initialState: StateType = {
  init: {
    ...initialFetchingState,
  },
  login: {
    ...initialFetchingState,
    data: {},
  },
  logout: {
    ...initialFetchingState,
  },
  logoutAll: {
    ...initialFetchingState,
  },
  signup: {
    ...initialFetchingState,
  },
  user: undefined,
};

const createSliceWithThunks = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

const userSlice = createSliceWithThunks({
  name: "user",
  initialState,
  reducers: (create) => ({
    init: create.asyncThunk<UserTypeAccess, { signal?: AbortSignal }>(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig<UserTypeAccess> = {
          method: "POST",
          url: `/api/users/init`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.init = setFetchingState(state.init, action.meta.requestId);
        },
        rejected: (state) => {
          state.init = setFulfilledState(state.init);
        },
        fulfilled: (state, action) => {
          state.init = setFulfilledState(state.init);
          state.user = action.payload;
        },
      }
    ),
    login: create.asyncThunk<
      UserTypeAccess,
      { email: string; password: string; signal?: AbortSignal }
    >(
      async (args, thunkApi) => {
        const passwordHash = await hashString(args.password);
        const fetchOptions: RequestConfig<UserTypeAccess> = {
          method: "POST",
          url: `/api/users/login`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: args.email, password: passwordHash }),
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.login = setFetchingState(state.login, action.meta.requestId);
        },
        rejected: (state, action) => {
          state.login = setRejectedState(
            state.login,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
        },
        fulfilled: (state, action) => {
          state.login = setFulfilledState(state.login);
          state.login.data = action.payload;
          state.user = action.payload;
        },
      }
    ),
    logout: create.asyncThunk<void, { signal?: AbortSignal }>(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig<void> = {
          method: "POST",
          url: `/api/users/logout`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
          additionalOptions: {
            successMessage: "You have logged out, see you soon!",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.logout = setFetchingState(state.logout, action.meta.requestId);
        },
        rejected: (state, action) => {
          state.logout = setRejectedState(
            state.logout,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
        },
        fulfilled: (state) => {
          state.logout = setFulfilledState(state.logout);
          state.user = null;
        },
      }
    ),
    logoutAll: create.asyncThunk<void, { signal?: AbortSignal }>(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig<void> = {
          method: "POST",
          url: `/api/users/logout-all`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
          additionalOptions: {
            successMessage: "You have logged out from all devices!",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.logoutAll = setFetchingState(
            state.logoutAll,
            action.meta.requestId
          );
        },
        rejected: (state, action) => {
          state.logoutAll = setRejectedState(
            state.logoutAll,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
        },
        fulfilled: (state) => {
          state.logoutAll = setFulfilledState(state.logoutAll);
          state.user = null;
        },
      }
    ),
    signup: create.asyncThunk<
      UserTypeAccess,
      Omit<UserType, "userId" | "createdAt"> & {
        password: string;
        confirmPassword: string;
        signal?: AbortSignal;
      }
    >(
      async (args, thunkApi) => {
        const { password, confirmPassword, signal, ...restArgs } = args;
        const passwordHash = await hashString(password);
        const confirmPasswordHash = await hashString(confirmPassword);
        const fetchOptions: RequestConfig<UserTypeAccess> = {
          method: "POST",
          url: `/api/users`,
          signal: signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...restArgs,
            password: passwordHash,
            confirmPassword: confirmPasswordHash,
          }),
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.signup = setFetchingState(state.signup, action.meta.requestId);
        },
        rejected: (state, action) => {
          state.signup = setRejectedState(
            state.signup,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
        },
        fulfilled: (state, action) => {
          state.signup = setFulfilledState(state.signup);
          state.login.data = action.payload;
          state.user = action.payload;
        },
      }
    ),
    setUser: create.reducer((state, action: { payload: UserTypeAccess }) => {
      state.user = action.payload;
    }),
  }),
  selectors: {
    isAuthenticated: (state) => !!state.user,
    authorizedUserSelector: (state) => state.user,
  },
});

export const { init, login, logout, logoutAll, signup } = userSlice.actions;
export const { isAuthenticated, authorizedUserSelector } = userSlice.selectors;
export default userSlice.reducer;
