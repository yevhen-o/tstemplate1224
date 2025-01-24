export type { TodoInterface } from "./Todos";
export type { OrgInterface } from "./Organization";

export type ResponseThunkAction = {
  type: string;
  error?: {
    message: string; // Error message
  };
};
