import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { storageSet, storageGetKey } from "src/services/localStorage";
import { FilterValueType } from "src/Types";
import { FILTER_ALL_VALUE } from "src/constants";

export function useSearchParamsAsValues() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState<FilterValueType>({});
  useEffect(() => {
    const values: FilterValueType = {};
    searchParams.forEach((value, key) => {
      values[key] = value;
    });
    setValues(values);
  }, [searchParams]);

  const handleValuesChange = (updatedValues: FilterValueType) => {
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
      const sortBy = params.get("sortBy");
      const sortOrder = params.get("sortOrder");

      const values: Record<string, string> = {
        ...(perPage ? { perPage } : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(sortOrder ? { sortOrder } : {}),
      };

      storageSet(storageGetKey(pathname), values);
      return values;
    });
  };

  return {
    values,
    handleValuesChange,
    handleResetForm,
  };
}
