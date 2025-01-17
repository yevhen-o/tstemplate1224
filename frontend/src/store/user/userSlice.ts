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
//import { hashString } from "src/helpers/utils/hashString";

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: string;
};

export type UserTypeAccess = UserType & { accessToken: string };

type StateType = {
  init: RequestState;
  login: RequestState & {
    data: Partial<UserType>;
  };
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
        //const passwordHash = await hashString(args.password);
        const fetchOptions: RequestConfig<UserTypeAccess> = {
          method: "POST",
          url: `/api/users/login`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: args.email, password: args.password }),
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
    setUser: create.reducer((state, action: { payload: UserTypeAccess }) => {
      state.user = action.payload;
    }),
  }),
  selectors: {
    isAuthenticated: (state) => state.user,
  },
});

export const { login, init } = userSlice.actions;
export const { isAuthenticated } = userSlice.selectors;
export default userSlice.reducer;
