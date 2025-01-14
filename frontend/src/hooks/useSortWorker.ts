import { useMemo, useEffect, useState } from "react";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";

export const useSortWorker = (
  data: any[],
  sort: { sortBy: string; isSortedAsc: boolean },
  sortType: SortTypes = SortTypes.string
) => {
  const worker = useMemo(
    () =>
      new Worker(new URL("src/helpers/utils/sortWorker.ts", import.meta.url)),
    []
  );

  const [sortedData, setSortedData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length && sort.sortBy) {
      worker.postMessage({
        data,
        sortByField: sort.sortBy,
        isSortedAsc: sort.isSortedAsc,
        sortType,
      });

      worker.onmessage = function (event) {
        setSortedData(event.data);
      };

      worker.onerror = function (error) {
        console.error("Worker Error:", error);
        setSortedData(data || []);
      };
    } else {
      setSortedData(data || []);
    }

    return () => {
      //worker.terminate();
    };
  }, [data, sort, worker, sortType]);

  return sortedData;
};

export default useSortWorker;
