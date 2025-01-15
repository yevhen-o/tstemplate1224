import Pagination from "src/components/Pagination/Pagination";
import { useSearchParamsOrLocalStorage } from "src/hooks";
import { DEFAULT_PAGE_SIZE } from "src/constants";
import { FormValueType } from "src/hooks/useForm";

const defaultInitialValues = { page: 1, perPage: DEFAULT_PAGE_SIZE };

export function usePagination<T>(
  items: T[],
  initialValues: FormValueType = defaultInitialValues
) {
  const { appliedValues, handleValuesChange } = useSearchParamsOrLocalStorage({
    initialValues,
  });

  const page = Number(appliedValues?.page ?? 1);
  const perPage = Number(appliedValues?.perPage ?? DEFAULT_PAGE_SIZE);
  const paginatedItems = items.slice((page - 1) * perPage, page * perPage);

  const pagination = (
    <Pagination
      totalItems={items.length}
      appliedValues={appliedValues || {}}
      onChange={handleValuesChange}
    />
  );

  return {
    paginatedItems,
    pagination,
  };
}
