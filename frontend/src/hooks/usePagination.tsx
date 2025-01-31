import { useSearchParams, useLocation } from "react-router-dom";
import { storageGetKey, storageSet } from "src/services/localStorage";
import { Pagination } from "src/components/Pagination/Pagination";
import { DEFAULT_PAGE_SIZE } from "src/constants";

export function usePagination<T>(items: T[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || DEFAULT_PAGE_SIZE;
  const paginatedItems = items.slice((page - 1) * perPage, page * perPage);

  const handleChange = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    setSearchParams((params) => {
      const values = {
        ...Object.fromEntries(params),
        ...(page === 1 ? {} : { page: page.toString() }),
        ...(perPage === DEFAULT_PAGE_SIZE
          ? {}
          : { perPage: perPage.toString() }),
      };
      if (page === 1) {
        delete values.page;
      }
      if (perPage === DEFAULT_PAGE_SIZE) {
        delete values.perPage;
      }
      storageSet(storageGetKey(pathname), values);
      return values;
    });
  };

  const pagination = (
    <Pagination
      page={page}
      perPage={perPage}
      totalItems={items.length}
      onChange={handleChange}
    />
  );

  return {
    paginatedItems,
    pagination,
  };
}
