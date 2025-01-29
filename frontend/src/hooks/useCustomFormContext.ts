import {
  useFormContext as useRHFFormContext,
  UseFormReturn,
} from "react-hook-form";

export type FormContext<T extends Record<string, unknown>> =
  UseFormReturn<T> & {
    touchedFields: Partial<Record<keyof T, boolean>>;
    setTouchedField: (field: keyof T) => void;
    setAllFieldsTouched: () => void;
  };

const useCustomFormContext = <T extends Record<string, unknown>>() => {
  const context = useRHFFormContext<T>() as FormContext<T>;

  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context;
};

export { useCustomFormContext };
