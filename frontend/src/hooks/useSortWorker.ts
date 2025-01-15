import { useEffect, useState } from "react";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";
import SortWorker from "src/helpers/utils/sortWorker.ts?worker";
import { Value } from "./useForm";

export const useSortWorker = <T>(
  data: T[],
  sortBy?: Value,
  isSortedAsc?: Value,
  sortType: SortTypes = SortTypes.string
) => {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const worker = new SortWorker();
    if (data.length && sortBy) {
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
    } else {
      setSortedData(data || []);
    }

    return () => {
      worker.terminate();
      setIsWorking(false);
    };
  }, [data, sortBy, isSortedAsc, sortType]);

  return { sortedData, isWorking };
};

export default useSortWorker;
