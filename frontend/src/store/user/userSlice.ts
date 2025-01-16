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

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: string;
};

type StateType = {
  login: RequestState & {
    data: Partial<UserType>;
  };
};

const initialState: StateType = {
  login: {
    ...initialFetchingState,
    data: {},
  },
};

const createSliceWithThunks = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

const userSlice = createSliceWithThunks({
  name: "organization",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk<
      UserType,
      { email: string; password: string; signal?: AbortSignal }
    >(
      async (args, thunkApi) => {
        const passwordHash = await hashString(args.password);
        const fetchOptions: RequestConfig<UserType> = {
          method: "POST",
          url: `/api/user-login`,
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
        },
      }
    ),
  }),
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
