import { useMemo } from "react";
import { create } from "zustand";
import { MAX_TOASTS_TO_DISPLAY } from "src/constants";

export type ToastMessage =
  | {
      title: string;
      description: string;
    }
  | string;

export type ToastType = {
  message: ToastMessage;
  id: string;
  isSuccess?: boolean;
  isWarning?: boolean;
  isError?: boolean;
};

type ToastsStore = {
  toasts: ToastType[];

  addToast: (t: Omit<ToastType, "id">) => void;
  removeToast: (t: Omit<ToastType, "id">) => void;
};

const getToastId = (message: ToastMessage) =>
  typeof message === "string"
    ? message
    : message.title + " " + message.description;

export const useToastStore = create<ToastsStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = getToastId(toast.message);
    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.id !== id), { id, ...toast }],
    }));
  },
  removeToast: (toast) => {
    const id = getToastId(toast.message);
    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.id !== id)],
    }));
  },
}));

// Selector for derived state
export const useToastsToDisplay = () => {
  const toasts = useToastStore((state) => state.toasts);

  const toastsToDisplay = useMemo(
    () => toasts.slice(0, MAX_TOASTS_TO_DISPLAY),
    [toasts]
  );
  return toastsToDisplay;
};
