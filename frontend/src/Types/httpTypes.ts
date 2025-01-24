export type AdditionalRequestOption<T> = {
  successMessage?: string;
  deriveSuccessMessage?: (response: T) => string;
  errorMessage?: string;
  deriveErrorMessage?: (error: unknown) => string;
};

export type RequestConfig<T> = {
  url: string;
  method: "PATCH" | "POST" | "GET" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
  additionalOptions?: AdditionalRequestOption<T>;
};

export interface KnownError {
  message: string;
}

export type RejectValueType = {
  rejectValue: KnownError;
};
