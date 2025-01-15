import React from "react";
import Filters from "src/components/Filters";
import useFilterWorker from "src/hooks/useFilterWorker";
import { useSearchParamsOrLocalStorage } from "src/hooks";
import { FieldType, FormValueType, Value } from "src/hooks/useForm";

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
    const { appliedValues, handleValuesChange } = useSearchParamsOrLocalStorage(
      {
        initialValues,
      }
    );

    const { filteredData: itemsToDisplay } = useFilterWorker(
      items,
      appliedValues,
      filterFields,
      filterFunctions
    );

    return (
      <>
        <Filters
          initialValues={initialValues}
          filterFields={filterFields}
          appliedValues={appliedValues || {}}
          onChange={handleValuesChange}
        />
        <Component items={itemsToDisplay} />
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
