import { FILTER_ALL_VALUE } from "src/constants";
import { FieldType } from "src/hooks";
type Value = string | number;
type ItemType = Record<string, Value>;

globalThis.onmessage = (event) => {
  const { items, appliedValues, filterFields, filterFunctions } = event.data;
  const defaultSelectFilterFunction = (
    item: ItemType,
    key: string,
    value: Value
  ): boolean =>
    value === FILTER_ALL_VALUE || `${(item as ItemType)[key]}` === `${value}`;

  const defaultSearchFilterFunction = (
    item: ItemType,
    _key: string,
    value: Value
  ): boolean =>
    value === "" ||
    (!!item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      Object.values(item).some((v) =>
        v?.toString().toLowerCase().includes(value.toString().toLowerCase())
      ));

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
