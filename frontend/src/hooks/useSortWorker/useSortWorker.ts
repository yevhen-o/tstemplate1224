import { useEffect, useState } from "react";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";
import { ITEMS_COUNT_TO_USE_WORKER } from "src/constants";
import sortByFn from "src/helpers/utils/sortBy/sortBy";
import { Value } from "../useForm";

export const useSortWorker = <T>(
  data: T[],
  sortBy?: Value,
  isSortedAsc?: Value,
  sortType: SortTypes = SortTypes.string
) => {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    let worker: Worker | null = null;

    const sortWithWorker = async () => {
      const { default: SortWorker } = await import("./sortWorker?worker");
      worker = new SortWorker();
      worker.postMessage({
        data,
        sortByField: sortBy,
        isSortedAsc: isSortedAsc,
        sortType,
      });
      setIsWorking(true);

      worker.onmessage = function (event) {
        setSortedData(event.data);
        setIsWorking(false);
      };

      worker.onerror = function (error) {
        console.error("Worker Error:", error);
        setSortedData(data || []);
        setIsWorking(false);
      };
    };

    if (data.length && sortBy && data.length > ITEMS_COUNT_TO_USE_WORKER) {
      sortWithWorker();
    } else if (sortBy) {
      const sortedData = sortByFn(
        data,
        sortBy.toString(),
        Boolean(isSortedAsc),
        sortType
      );
      setSortedData(sortedData);
    } else {
      setSortedData(data || []);
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
      setIsWorking(false);
    };
  }, [data, sortBy, isSortedAsc, sortType]);

  return { sortedData, isWorking };
};
