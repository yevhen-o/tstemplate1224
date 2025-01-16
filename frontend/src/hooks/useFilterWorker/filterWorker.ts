import { FieldType } from "src/hooks";
type Value = string | number;
type ItemType = Record<string, Value>;
import {
  defaultSearchFilterFunction,
  defaultSelectFilterFunction,
} from "./utils";

globalThis.onmessage = (event) => {
  const { items, appliedValues, filterFields, filterFunctions } = event.data;

  const filteredItems = items.filter((item: ItemType) =>
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

  globalThis.postMessage(filteredItems);
};
