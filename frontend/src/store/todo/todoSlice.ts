import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TodoInterface } from "src/Types";
import {
  KnownError,
  RequestState,
  FetchedTime,
  initialFetchingState,
  setFetchingState,
  setFulfilledState,
  setRejectedState,
  updateItemById,
  RequestConfig,
  genericRequest,
} from "../shared";

type StateType = {
  list: RequestState &
    FetchedTime & {
      data: string[];
    };
  itemsById: {
    [key: string]: TodoInterface & FetchedTime;
  };
  getItem: RequestState;
  postItem: RequestState;
  patchItem: RequestState;
};

const initialState: StateType = {
  list: {
    ...initialFetchingState,
    data: [],
  },
  itemsById: {},
  getItem: {
    ...initialFetchingState,
  },
  postItem: {
    ...initialFetchingState,
  },
  patchItem: {
    ...initialFetchingState,
  },
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todoGetList.pending, (state, action) => {
        state.list = setFetchingState(state.list, action.meta.requestId);
      })
      .addCase(todoGetList.fulfilled, (state, action) => {
        if (state.list.latestRequestId === action.meta.requestId) {
          state.list = setFulfilledState(state.list);
          state.list.fetchedTime = Date.now();
          state.list.data = Array.from(
            new Set([
              ...state.list.data,
              ...action.payload.map((todo) => todo.uid),
            ])
          );
          action.payload.forEach((todo) => {
            state.itemsById[todo.uid] = {
              ...(state.itemsById[todo.uid] || {}),
              ...todo,
            };
          });
        }
      })
      .addCase(todoGetList.rejected, (state, action) => {
        state.list = setRejectedState(
          state.list,
          action.meta,
          action.payload,
          action.error.message
        );
      })
      .addCase(todoPostItem.pending, (state, action) => {
        state.postItem = setFetchingState(
          state.postItem,
          action.meta.requestId
        );
      })
      .addCase(todoPostItem.fulfilled, (state, action) => {
        state.postItem = setFulfilledState(state.postItem);
        state.list.data.push(action.payload.uid);
        state.itemsById = updateItemById(state.itemsById, action.payload);
      })
      .addCase(todoPostItem.rejected, (state, action) => {
        state.postItem = setRejectedState(
          state.postItem,
          action.meta,
          action.payload,
          action.error.message
        );
      })
      .addCase(todoGetItem.pending, (state, action) => {
        state.getItem = setFetchingState(state.getItem, action.meta.requestId);
      })
      .addCase(todoGetItem.fulfilled, (state, action) => {
        state.getItem = setFulfilledState(state.getItem);
        state.itemsById = updateItemById(state.itemsById, action.payload);
      })
      .addCase(todoGetItem.rejected, (state, action) => {
        state.getItem = setRejectedState(
          state.getItem,
          action.meta,
          action.payload,
          action.error.message
        );
      })
      .addCase(todoPatchItem.pending, (state, action) => {
        state.patchItem = setFetchingState(
          state.patchItem,
          action.meta.requestId
        );
      })
      .addCase(todoPatchItem.fulfilled, (state, action) => {
        state.patchItem = setFulfilledState(state.patchItem);
        state.itemsById = updateItemById(state.itemsById, action.payload);
      })
      .addCase(todoPatchItem.rejected, (state, action) => {
        state.patchItem = setRejectedState(
          state.patchItem,
          action.meta,
          action.payload,
          action.error.message
        );
      });
  },
});

type RejectValueType = {
  rejectValue: KnownError;
};

export const todoPatchItem = createAsyncThunk<
  TodoInterface,
  { uid: string; item: Partial<TodoInterface>; signal?: AbortSignal },
  RejectValueType
>("todos/patchItem", async ({ uid, item, signal }, thunkApi) => {
  const fetchOptions: RequestConfig = {
    method: "PATCH",
    url: `/api/todos/${uid}`,
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoGetItem = createAsyncThunk<
  TodoInterface,
  { uid: string; signal?: AbortSignal },
  RejectValueType
>("todos/getItem", async ({ uid, signal }, thunkApi) => {
  const fetchOptions: RequestConfig = {
    method: "GET",
    url: `/api/todos/${uid}`,
    signal: signal,
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoPostItem = createAsyncThunk<
  TodoInterface,
  { item: TodoInterface; signal?: AbortSignal },
  RejectValueType
>("todos/postItem", async ({ item, signal }, thunkApi) => {
  const fetchOptions: RequestConfig = {
    method: "POST",
    url: `/api/todos`,
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoGetList = createAsyncThunk<
  TodoInterface[],
  { signal?: AbortSignal },
  RejectValueType
>("todos/getList", async ({ signal }, thunkApi) => {
  const fetchOptions: RequestConfig = {
    method: "GET",
    url: `/api/todos`,
    signal: signal,
  };
  return genericRequest(fetchOptions, thunkApi);
});

// function createTodoThunk<T, A>(
//   type: string,
//   requestFn: (
//     args: A,
//     thunkApi: { rejectWithValue: (value: KnownError) => any }
//   ) => Promise<T>
// ) {
//   return createAsyncThunk<T, A, RejectValueType>(type, requestFn);
// }

// export const todoGetList = createTodoThunk<
//   TodoInterface[],
//   { signal?: AbortSignal }
// >("todos/getList", async ({ signal }, thunkApi) => {
//   return genericRequest(
//     {
//       method: "GET",
//       url: "/api/todos",
//       signal,
//     },
//     thunkApi
//   );
// });

export default todosSlice.reducer;
