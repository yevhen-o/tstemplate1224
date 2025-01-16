import { useEffect, useState } from "react";
import { ITEMS_COUNT_TO_USE_WORKER } from "src/constants";
import { FormValueType, FieldType, Value } from "src/hooks/useForm";

import {
  defaultSearchFilterFunction,
  defaultSelectFilterFunction,
} from "./utils";

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
    let worker: Worker | null = null;

    const filterWithoutWorker = () => {
      const filteredItems = (items || []).filter((item: T) =>
        Object.entries(appliedValues || {}).every(([key, value]) => {
          const filterFn =
            filterFunctions[key] ||
            (filterFields.find((field: FieldType) => field.name === key)
              ?.fieldType === "input"
              ? defaultSearchFilterFunction
              : defaultSelectFilterFunction);
          return !!value &&
            !["page", "perPage", "sortBy", "sortOrder"].includes(key)
            ? filterFn(item, key, value)
            : true;
        })
      );
      setFilteredData(filteredItems);
    };

    const filterWithWorker = async () => {
      const { default: FilterWorker } = await import("./filterWorker?worker");
      worker = new FilterWorker();

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
    };

    if (items.length > ITEMS_COUNT_TO_USE_WORKER) {
      filterWithWorker();
    } else {
      filterWithoutWorker();
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, [items, appliedValues, filterFields, filterFunctions]);

  return { filteredData, isWorking };
};

export default useFilterWorker;
