import React, { useState } from "react";
import Filters from "src/components/Filters";
import { FormValueType, FieldType, Value } from "src/hooks/useForm";

interface WithFiltersProps<T> {
  items: T[];
  filterFields?: FieldType[];
  initialValues?: FormValueType;
  filterFunctions?: Record<
    string,
    (item: T, key: string, value: NonNullable<Value>) => boolean
  >;
}

interface InjectedProps<T> {
  items: T[];
}

export const FILTER_ALL_VALUE =
  "someLongRandomStringThatNotMatchAnyPossibleValue";

export function withFilters<T>(
  Component: React.ComponentType<InjectedProps<T>>
) {
  return function FiltersWrapper(props: WithFiltersProps<T>) {
    const {
      items,
      initialValues = {},
      filterFunctions = {},
      filterFields = [{ fieldType: "input", name: "search", label: "Search" }],
    } = props;
    const [values, setValues] = useState<FormValueType>(initialValues);

    const defaultSelectFilterFunction = (
      item: T,
      key: string,
      value: NonNullable<Value>
    ): boolean =>
      value === FILTER_ALL_VALUE || `${(item as any)[key]}` === `${value}`;

    const defaultSearchFilterFunction = (
      item: T,
      _key: string,
      value: NonNullable<Value>
    ): boolean =>
      value === "" ||
      (item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        Object.values(item).some((v) =>
          v?.toString().toLowerCase().includes(value.toString().toLowerCase())
        ));

    // Apply filters based on the current values
    const itemsToDisplay = items.filter((item) =>
      Object.entries(values).every(([key, value]) => {
        const filterFn =
          filterFunctions[key] ||
          (filterFields.find((field) => field.name === key)?.fieldType ===
          "input"
            ? defaultSearchFilterFunction
            : defaultSelectFilterFunction);
        return !!value
          ? filterFn(item, key, value as NonNullable<Value>)
          : true;
      })
    );

    return (
      <>
        <Filters
          filterFields={filterFields}
          initialValues={initialValues}
          onChange={(updatedValues: FormValueType) => setValues(updatedValues)}
        />
        <Component {...props} items={itemsToDisplay} />
      </>
    );
  };
}

// usage reference
// define and pass filterFields based on FormFields
// const filterFields: FieldType[] = [
//   { fieldType: "input", name: "search", label: "Search" },
//   {
//     fieldType: "select",
//     name: "priority",
//     label: "Priority",
//     options: [
//       { value: FILTER_ALL_VALUE, label: "All" },
//       { value: "low", label: "Low" },
//       { value: "medium", label: "Medium" },
//       { value: "high", label: "High" },
//     ],
//   },
//   {
//     fieldType: "select",
//     name: "scope",
//     label: "Scope",
//     options: [
//       { value: FILTER_ALL_VALUE, label: "All" },
//       { value: "forWork", label: "For Work" },
//       { value: "forFun", label: "For Fun" },
//     ],
//   },
//   {
//     fieldType: "select",
//     name: "isImportant",
//     label: "Is Important",
//     options: [
//       { value: FILTER_ALL_VALUE, label: "All" },
//       { value: "true", label: "Important" },
//       { value: "false", label: "Not important" },
//     ],
//   },
// ];

// Define filter functions based on filter fields
// const filterFunctions: Record<
//   string,
//   (item: T, key: string, value: NonNullable<Value>) => boolean
// > = {
//   isImportant: (
//     item: any,
//     _key: string,
//     value: NonNullable<Value>
//   ): boolean =>
//     value === "" || item.isImportant.toString() === value.toString(),
// };
