import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import Filters from "src/components/Filters";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { FormValueType, FieldType, Value } from "src/hooks/useForm";
import { storageSet, storageGetKey } from "src/services/localStorage";
import useFilterWorker from "src/hooks/useFilterWorker";

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

const defaultObj = {};

export function withFilters<T>(
  Component: React.ComponentType<InjectedProps<T>>
) {
  return function FiltersWrapper(props: WithFiltersProps<T>) {
    const {
      items,
      initialValues = defaultObj,
      filterFunctions = defaultObj,
      filterFields = [{ fieldType: "input", name: "search", label: "Search" }],
    } = props;
    const [appliedValues, setAppliedValues] = useState<FormValueType | null>(
      null
    );

    const { filteredData: itemsToDisplay } = useFilterWorker(
      items,
      appliedValues,
      filterFields,
      filterFunctions
    );

    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
      const filterValues: FormValueType = {};
      searchParams.forEach((value, key) => (filterValues[key] = value));
      setAppliedValues(filterValues);
    }, [searchParams]);

    const navigate = useNavigate();

    const handleChange = useCallback(
      (updatedValues: FormValueType) => {
        const valuesImpactUrl = Object.entries(updatedValues).reduce(
          (acc, [key, v]) => ({
            ...acc,
            ...(!!v &&
            (v !== FILTER_ALL_VALUE ||
              !Object.prototype.hasOwnProperty.call(initialValues, key))
              ? { [key]: v }
              : {}),
          }),
          {} as FormValueType
        );
        storageSet(storageGetKey(pathname), valuesImpactUrl);
        navigate(getUrl(pathname as IDENTIFIERS, valuesImpactUrl));
      },
      [navigate, pathname, initialValues]
    );

    return (
      <>
        {appliedValues && (
          <>
            <Filters
              filterFields={filterFields}
              appliedValues={appliedValues}
              initialValues={initialValues}
              onChange={handleChange}
            />
            <Component {...props} items={itemsToDisplay} />
          </>
        )}
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
