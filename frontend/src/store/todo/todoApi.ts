import { TodoInterface } from "src/Types";
import { genericRequest } from "src/store/shared";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RejectValueType, RequestConfig } from "src/Types/httpTypes";

export const todoPatchItem = createAsyncThunk<
  TodoInterface,
  { uid: string; item: Partial<TodoInterface>; signal?: AbortSignal },
  RejectValueType
>("todos/patchItem", async ({ uid, item, signal }, thunkApi) => {
  const fetchOptions: RequestConfig<TodoInterface> = {
    method: "PATCH",
    url: `/api/todos/${uid}`,
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
    additionalOptions: {
      deriveSuccessMessage: (todo: TodoInterface) =>
        `Todo ${todo.title} updated successfully`,
    },
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoGetItem = createAsyncThunk<
  TodoInterface,
  { uid: string; signal?: AbortSignal },
  RejectValueType
>("todos/getItem", async ({ uid, signal }, thunkApi) => {
  const fetchOptions: RequestConfig<TodoInterface> = {
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
  const fetchOptions: RequestConfig<TodoInterface> = {
    method: "POST",
    url: `/api/todos`,
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
    additionalOptions: {
      deriveSuccessMessage: (todo: TodoInterface) =>
        `Todo ${todo.title} added successfully`,
    },
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoGetList = createAsyncThunk<
  TodoInterface[],
  { signal?: AbortSignal },
  RejectValueType
>("todos/getList", async ({ signal }, thunkApi) => {
  const fetchOptions: RequestConfig<TodoInterface[]> = {
    method: "GET",
    url: `/api/todos`,
    signal: signal,
  };
  return genericRequest(fetchOptions, thunkApi);
});

export const todoDeleteItem = createAsyncThunk<
  void,
  { signal?: AbortSignal; todoId: string },
  RejectValueType
>("todos/deleteItem", async ({ todoId, signal }, thunkApi) => {
  const fetchOptions: RequestConfig<void> = {
    method: "DELETE",
    url: `/api/todos/${todoId}`,
    signal: signal,
  };
  return genericRequest(fetchOptions, thunkApi);
});
