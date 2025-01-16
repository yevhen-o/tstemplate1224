import Filters from "src/components/Filters";
import { useSearchParamsOrLocalStorage } from "src/hooks";
import { useFilterWorker } from "src/hooks/useFilterWorker";
import { FieldType, FormValueType, Value } from "src/hooks/useForm";

const defaultObj = {};
const defaultArr: FieldType[] = [];

export function useFilters<T>(
  items: T[],
  initialValues: FormValueType = defaultObj,
  filterFields: FieldType[] = defaultArr,
  filterFunctions: Record<
    string,
    (i: T, k: keyof typeof initialValues, v: Value) => boolean
  > = defaultObj
) {
  const { appliedValues, handleValuesChange } = useSearchParamsOrLocalStorage({
    initialValues,
  });

  const { filteredData } = useFilterWorker(
    items,
    appliedValues,
    filterFields,
    filterFunctions
  );

  const filters = (
    <Filters
      initialValues={initialValues}
      filterFields={filterFields}
      appliedValues={appliedValues || {}}
      onChange={handleValuesChange}
    />
  );

  return { filters, filteredData };
}
