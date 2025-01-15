import React from "react";
import { FieldType, FormValueType, Value } from "src/hooks/useForm";
import { useFilters } from "src/hooks/useFilters";

const defaultObj = {};
const defaultArr: FieldType[] = [];

export function withFilters<T extends Record<string, Value>>(
  Component: React.ComponentType<{ items: T[] }>
) {
  return function FiltersWrapper({
    items,
    initialValues = defaultObj,
    filterFields = defaultArr,
    filterFunctions = defaultObj,
  }: {
    items: T[];
    initialValues?: FormValueType;
    filterFields: FieldType[];
    filterFunctions?: Record<
      string,
      (i: T, k: keyof typeof initialValues, v: Value) => boolean
    >;
  }) {
    const { filters, filteredData } = useFilters(
      items,
      initialValues,
      filterFields,
      filterFunctions
    );

    return (
      <>
        {filters}
        <Component items={filteredData} />
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
