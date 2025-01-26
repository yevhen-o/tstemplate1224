import { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { storageSet, storageGetKey } from "src/services/localStorage";
import { FormValueType } from "src/hooks/useForm";
import { DEFAULT_PAGE_SIZE, FILTER_ALL_VALUE } from "src/constants";

type UseAppliedValuesParams = {
  initialValues?: FormValueType;
  onChange?: (values: FormValueType) => void;
};

export function useSearchParamsOrLocalStorage({
  initialValues = {},
}: UseAppliedValuesParams) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedValues, setAppliedValues] = useState<FormValueType | null>({});

  useEffect(() => {
    const values: FormValueType = { ...initialValues };
    searchParams.forEach((value, key) => {
      values[key] = value;
    });
    setAppliedValues(values);
  }, [searchParams, initialValues]);

  const handleValuesChange = useCallback(
    (updatedValues: FormValueType) => {
      const valuesImpactUrl: FormValueType = {};
      Object.entries(updatedValues).forEach(([key, v]) => {
        if (["page", "perPage"].includes(key)) {
          if (key === "page" && !!v && +v !== 1) {
            valuesImpactUrl[key] = v;
          } else if (key === "perPage" && !!v && +v !== DEFAULT_PAGE_SIZE) {
            valuesImpactUrl[key] = v;
          }
        } else if (["sortBy", "isSortedAsc"].includes(key)) {
          if (key === "sortBy" && !!v) {
            valuesImpactUrl[key] = v;
          } else if (key === "isSortedAsc" && !v) {
            valuesImpactUrl[key] = v;
          }
        } else if (!!v && v !== FILTER_ALL_VALUE) {
          valuesImpactUrl[key] = v;
        }
      });

      storageSet(storageGetKey(pathname), valuesImpactUrl);
      setSearchParams((params) => ({ ...params, ...valuesImpactUrl }));
    },
    [setSearchParams, pathname]
  );

  return {
    appliedValues,
    handleValuesChange,
  };
}
