export { useActions } from "./useActions";
export { useClientScreen } from "./useClientScreen";
export { useTypedSelector } from "./useTypedSelector";
export type { FormValueType, FieldType, Value } from "./useForm";
export { useForm } from "./useForm";
export { useOutsideClick } from "./useOutsideClick";
export { useObserveElementSize } from "./useObserveElementSize";
export { useSortWorker } from "./useSortWorker";
export { useSearchParamsOrLocalStorage } from "./useSearchParamsOrLocalStorage";
export { usePagination } from "./usePagination";
export { useFilters } from "./useFilters";

export const isOutdated = <
  T extends { fetchedTime?: number; isFetching?: boolean }
>(
  data: T,
  cachingTime: number = 2 * 60 * 1000
) => {
  if (!data) return true;
  if (data.isFetching) return false;
  return !data?.fetchedTime || data.fetchedTime + cachingTime < Date.now();
};
