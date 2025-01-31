export type { TodoInterface } from "./Todos";
export type { OrgInterface } from "./Organization";

export type ResponseThunkAction = {
  type: string;
  error?: {
    message: string; // Error message
  };
};

export type Option = { id?: string; value: string | number; label: string };

export type FilterValueType = Record<string, string>;
