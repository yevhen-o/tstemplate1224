import { FILTER_ALL_VALUE } from "src/constants";
type Value = string | number;
type ItemType = Record<string, Value>;

export const defaultSelectFilterFunction = (
  item: ItemType,
  key: string,
  value: Value
): boolean =>
  value === FILTER_ALL_VALUE || `${(item as ItemType)[key]}` === `${value}`;

export const defaultSearchFilterFunction = (
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
