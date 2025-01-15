import { useEffect, useState } from "react";
import { FormValueType, FieldType, Value } from "src/hooks/useForm";
import FilterWorker from "src/helpers/utils/filterWorker?worker";
export const useFilterWorker = <T>(
  items: T[],
  appliedValues: FormValueType | null,
  filterFields: FieldType[],
  filterFunctions: Record<
    string,
    (item: T, key: string, value: NonNullable<Value>) => boolean
  >
) => {
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const worker = new FilterWorker();
    if (items.length) {
      worker.postMessage({
        items,
        appliedValues,
        filterFields,
        filterFunctions,
      });
      setIsWorking(true);

      worker.onmessage = function (event) {
        setFilteredData(event.data);
        setIsWorking(false);
      };

      worker.onerror = function (error) {
        console.error("Worker Error:", error);
        setFilteredData(items || []);
        setIsWorking(false);
      };
    } else {
      setFilteredData(items || []);
    }

    return () => {
      worker.terminate();
    };
  }, [items, appliedValues, filterFields, filterFunctions]);

  return { filteredData, isWorking };
};

export default useFilterWorker;
