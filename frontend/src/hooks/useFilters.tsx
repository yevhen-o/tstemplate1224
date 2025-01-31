import { useLocation, useSearchParams } from "react-router-dom";
import { storageSet, storageGetKey } from "src/services/localStorage";

import Filters from "src/components/Filters";
import { useFilterWorker } from "src/hooks/useFilterWorker";
import { FieldType, Value } from "src/hooks/useForm";
import { FILTER_ALL_VALUE } from "src/constants";
import { useEffect, useState } from "react";
import { FilterValueType } from "src/Types";

const defaultObj = {};
const defaultArr: FieldType[] = [];

export function useFilters<T>(
  items: T[],
  initialValues: FilterValueType = defaultObj,
  filterFields: FieldType[] = defaultArr,
  filterFunctions: Record<
    string,
    (i: T, k: keyof typeof initialValues, v: Value) => boolean
  > = defaultObj
) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState<FilterValueType>(defaultObj);
  useEffect(() => {
    const values: FilterValueType = {};
    searchParams.forEach((value, key) => {
      values[key] = value;
    });
    setValues(values);
  }, [searchParams]);

  const handleValuesChange = (
    updatedValues: Record<string, string | string[]>
  ) => {
    setSearchParams((params) => {
      const values = {
        ...Object.fromEntries(params),
        ...updatedValues,
      };
      Object.keys(values).forEach((key) => {
        if (values[key] === "" || values[key] === FILTER_ALL_VALUE) {
          delete values[key];
        }
      });
      if (values.page === "1") {
        delete values.page;
      }

      storageSet(storageGetKey(pathname), values);
      return values;
    });
  };

  const handleResetForm = () => {
    setSearchParams((params) => {
      const perPage = params.get("perPage");

      const values: Record<string, string> = perPage ? { perPage } : {};

      storageSet(storageGetKey(pathname), values);
      return values;
    });
  };

  const { filteredData } = useFilterWorker(
    items,
    values,
    filterFields,
    filterFunctions
  );

  const filters = (
    <Filters
      appliedValues={values}
      filterFields={filterFields}
      initialValues={initialValues}
      onChange={handleValuesChange}
      resetForm={handleResetForm}
    />
  );

  return { filters, filteredData };
}
