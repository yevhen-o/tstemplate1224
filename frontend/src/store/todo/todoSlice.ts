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
            state.itemsById[todo.uid] = todo;
          });
        }
      );
  },
});

export const todoGetList = createAsyncThunk("todos/getList", async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const result: TodoInterface[] = [
    {
      uid: "1",
      title: "First todo",
      isCompleted: false,
      deadline: "2021-12-31",
      priority: "high",
      scope: "forWork",
    },
    {
      uid: "2",
      title: "Second todo",
      isCompleted: true,
      deadline: "2021-12-31",
      priority: "high",
      scope: "forWork",
    },
  ];
  return result;
});

export const { todoAdd, todoToggle } = todosSlice.actions;
export default todosSlice.reducer;
