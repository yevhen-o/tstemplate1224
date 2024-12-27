import { createSlice } from "@reduxjs/toolkit";
import { TodoInterface } from "src/Types";

const initialState: TodoInterface[] = [];

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoAdded(state, action) {
      const { uid, title, deadline } = action.payload;
      state.push({
        uid,
        title,
        deadline,
        isCompleted: false,
      });
    },
    todoToggled(state, action) {
      const todo = state.find((todo) => todo.uid === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
  },
});

export const { todoAdded, todoToggled } = todosSlice.actions;
export default todosSlice.reducer;
