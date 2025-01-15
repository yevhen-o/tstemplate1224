import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { storageSet, storageGetKey } from "src/services/localStorage";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { FormValueType } from "src/hooks/useForm";
import { DEFAULT_PAGE_SIZE, FILTER_ALL_VALUE } from "src/constants";

type UseAppliedValuesParams = {
  initialValues?: FormValueType;
  onChange?: (values: FormValueType) => void;
};

export function useSearchParamsOrLocalStorage({
  initialValues = {},
  onChange,
}: UseAppliedValuesParams) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [appliedValues, setAppliedValues] = useState<FormValueType | null>(
    initialValues
  );

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
      navigate(getUrl(pathname as IDENTIFIERS, valuesImpactUrl));
      onChange?.(valuesImpactUrl);
    },
    [navigate, pathname, onChange]
  );

  return {
    appliedValues,
    handleValuesChange,
  };
}
