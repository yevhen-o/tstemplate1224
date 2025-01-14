import { FILTER_ALL_VALUE } from "src/constants";

globalThis.onmessage = (event) => {
  const { items, appliedValues, filterFields, filterFunctions } = event.data;

  const defaultSelectFilterFunction = (
    item: unknown,
    key: string,
    value: any
  ): boolean =>
    value === FILTER_ALL_VALUE || `${(item as any)[key]}` === `${value}`;

  const defaultSearchFilterFunction = (
    item: unknown,
    _key: string,
    value: any
  ): boolean =>
    value === "" ||
    (!!item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      Object.values(item).some((v) =>
        v?.toString().toLowerCase().includes(value.toString().toLowerCase())
      ));

  const filteredItems = items.filter((item: any) =>
    Object.entries(appliedValues || {}).every(([key, value]) => {
      const filterFn =
        filterFunctions[key] ||
        (filterFields.find((field: any) => field.name === key)?.fieldType ===
        "input"
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
