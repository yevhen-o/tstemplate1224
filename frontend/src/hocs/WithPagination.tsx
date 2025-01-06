import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import Pagination from "src/components/Pagination/Pagination";

import { DEFAULT_PAGE_SIZE } from "src/constants";
import { FormValueType } from "src/hooks/useForm";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { storageSet, storageGetKey } from "src/services/localStorage";

interface WithPaginationProps<T> {
  items: T[];
}

interface InjectedProps<T> {
  items: T[];
}

export function withPagination<T>(
  Component: React.ComponentType<InjectedProps<T>>
) {
  return function PaginationWrapper(props: WithPaginationProps<T>) {
    const { items } = props;

    const { pathname } = useLocation();
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [appliedValues, setAppliedValues] = useState<FormValueType | null>(
      null
    );

    const page = appliedValues?.page || 1;
    const perPage = appliedValues?.perPage || DEFAULT_PAGE_SIZE;

    useEffect(() => {
      const filterValues: FormValueType = {};
      searchParams.forEach((value, key) => (filterValues[key] = value));
      setAppliedValues(filterValues);
    }, [searchParams]);

    const handleChange = useCallback(
      (updatedValues: FormValueType) => {
        const valuesImpactUrl: FormValueType = {};
        Object.entries(updatedValues).forEach(([key, v]) => {
          if (["page", "perPage"].includes(key)) {
            if (key === "page" && !!v && +v !== 1) {
              valuesImpactUrl[key] = v;
            } else if (key === "perPage" && !!v && +v !== DEFAULT_PAGE_SIZE) {
              valuesImpactUrl[key] = v;
            }
          } else {
            valuesImpactUrl[key] = v;
          }
        });
        storageSet(storageGetKey(pathname), valuesImpactUrl);
        navigate(getUrl(pathname as IDENTIFIERS, valuesImpactUrl));
      },
      [navigate, pathname]
    );

    const itemsToDisplay =
      page && perPage
        ? items.slice((+page - 1) * +perPage, (+page - 1) * +perPage + +perPage)
        : [];

    return (
      <>
        {appliedValues && (
          <>
            <Component {...props} items={itemsToDisplay} />
            <Pagination
              totalItems={items.length}
              appliedValues={appliedValues}
              onChange={handleChange}
            />
          </>
        )}
      </>
    );
  };
}
