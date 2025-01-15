import { useEffect, useState } from "react";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";
import SortWorker from "src/helpers/utils/sortWorker.ts?worker";

export const useSortWorker = <T>(
  data: T[],
  sort: { sortBy: string; isSortedAsc: boolean },
  sortType: SortTypes = SortTypes.string
) => {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const worker = new SortWorker();
    if (data.length && sort.sortBy) {
      worker.postMessage({
        data,
        sortByField: sort.sortBy,
        isSortedAsc: sort.isSortedAsc,
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
    };
  }, [data, sort, sortType]);

  return { sortedData, isWorking };
};

export default useSortWorker;
