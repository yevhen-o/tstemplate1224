import Filters from "src/components/Filters";
import { useFilterWorker } from "src/hooks/useFilterWorker";
import { FieldType, Value } from "src/hooks/useForm";
import { useSearchParamsAsValues } from "./useSearchParamsAsValues";
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
  const { values, handleValuesChange, handleResetForm } =
    useSearchParamsAsValues();

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
      onChange={(v) => handleValuesChange({ ...v, page: "1" })}
      resetForm={handleResetForm}
    />
  );

  return { filters, filteredData };
}
