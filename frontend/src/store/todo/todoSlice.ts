import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TodoInterface } from "src/Types";

type StateType = {
  list: {
    isFetching: boolean;
    isFetched: boolean;
    hasError: boolean;
    data: string[];
  };
  itemsById: {
    [key: string]: TodoInterface;
  };
  getItem: {
    isFetching: boolean;
    isFetched: boolean;
    hasError: boolean;
  };
  postItem: {
    isFetching: boolean;
    isFetched: boolean;
    hasError: boolean;
  };
};

const initialState: StateType = {
  list: {
    isFetching: false,
    isFetched: false,
    hasError: false,
    data: [],
  },
  itemsById: {},
  getItem: {
    isFetching: false,
    isFetched: false,
    hasError: false,
  },
  postItem: {
    isFetching: false,
    isFetched: false,
    hasError: false,
  },
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoAdd(state, action) {
      state.list.data.push(action.payload.uid);
      state.itemsById[action.payload.uid] = action.payload;
    },
    todoToggle(state, action) {
      state.itemsById[action.payload].isCompleted =
        !state.itemsById[action.payload].isCompleted;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todoGetList.pending, (state) => {
        state.list.isFetching = true;
        state.list.isFetched = false;
        state.list.hasError = false;
      })
      .addCase(
        todoGetList.fulfilled,
        (state, action: PayloadAction<TodoInterface[]>) => {
          state.list.isFetching = false;
          state.list.isFetched = true;
          state.list.data = action.payload.map((todo) => todo.uid);
          action.payload.forEach((todo) => {
            state.itemsById[todo.uid] = {
              ...(state.itemsById[todo.uid] || {}),
              ...todo,
            };
          });
        }
      )
      .addCase(todoPostItem.pending, (state) => {
        state.postItem.isFetching = true;
        state.postItem.isFetched = false;
        state.postItem.hasError = false;
      })
      .addCase(
        todoPostItem.fulfilled,
        (state, action: PayloadAction<TodoInterface>) => {
          state.postItem.isFetching = false;
          state.postItem.isFetched = true;
          state.list.data.push(action.payload.uid);
          state.itemsById[action.payload.uid] = {
            ...(state.itemsById[action.payload.uid] || {}),
            ...action.payload,
          };
        }
      )
      .addCase(todoPostItem.rejected, (state) => {
        state.postItem.isFetching = false;
        state.postItem.hasError = true;
      })
      .addCase(todoGetItem.pending, (state) => {
        state.getItem.isFetching = true;
        state.getItem.isFetched = false;
        state.getItem.hasError = false;
      })
      .addCase(
        todoGetItem.fulfilled,
        (state, action: PayloadAction<TodoInterface>) => {
          state.getItem.isFetching = false;
          state.getItem.isFetched = true;
          state.itemsById[action.payload.uid] = {
            ...(state.itemsById[action.payload.uid] || {}),
            ...action.payload,
          };
        }
      )
      .addCase(todoGetItem.rejected, (state) => {
        state.getItem.isFetching = false;
        state.getItem.hasError = true;
      });
  },
});

export const todoGetItem = createAsyncThunk(
  "todos/getItem",
  async (uid: string) => {
    const result: TodoInterface = await fetch(`/api/todos/${uid}`).then((res) =>
      res.json()
    );
    return result;
  }
);

export const todoPostItem = createAsyncThunk(
  "todos/postItem",
  async (item: TodoInterface) => {
    const result = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    if (!result.ok) {
      throw new Error("Failed to post item");
    }
    return item;
  }
);

export const todoGetList = createAsyncThunk("todos/getList", async () => {
  const result: TodoInterface[] = await fetch("/api/todos").then((res) =>
    res.json()
  );
  return result;
});

export const { todoAdd, todoToggle } = todosSlice.actions;
export default todosSlice.reducer;
