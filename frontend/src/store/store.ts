import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todo/todoSlice";
import organizationReducer from "./organization/organizationSlice";
import clientScreenReducer from "./clientScreen/clientScreenSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    todo: todosReducer,
    organization: organizationReducer,
    clientScreen: clientScreenReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
