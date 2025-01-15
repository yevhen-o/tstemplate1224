import React from "react";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import { usePagination, FormValueType } from "src/hooks";

const defaultInitialValues = { page: 1, perPage: DEFAULT_PAGE_SIZE };

export function withPagination<T>(
  Component: React.ComponentType<{ items: T[] }>
) {
  return function PaginationWrapper({
    items,
    initialValues = defaultInitialValues,
  }: {
    items: T[];
    initialValues?: FormValueType;
  }) {
    const { pagination, paginatedItems } = usePagination(items, initialValues);

    return (
      <>
        <Component items={paginatedItems} />
        {pagination}
      </>
    );
  };
}
