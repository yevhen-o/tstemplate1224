export enum SortTypes {
  int = "int",
  date = "date",
  string = "string",
}

type UnknownObject = Record<string, unknown>;
type GetFieldValueOpts = { sortAsInt?: boolean; sortAsDate?: boolean };

function getFieldValue(
  obj: unknown,
  fieldName: string,
  { sortAsInt, sortAsDate }: GetFieldValueOpts = {}
): string | number {
  const value = fieldName
    .split(".")
    .reduce((acc, part) => (acc as any)?.[part], obj);

  if (sortAsDate) {
    return new Date((value as string | number) ?? 0).getTime();
  }
  if (sortAsInt) {
    return Number(value) || 0;
  }
  return String(value ?? "").toLowerCase();
}

function compare(
  a: string | number,
  b: string | number,
  isSortedAsc: boolean,
  sortAsInt: boolean
): number {
  if (sortAsInt) {
    return isSortedAsc ? +a - +b : +b - +a;
  }

  const order = a.toString().localeCompare(b.toString(), undefined, {
    sensitivity: "base",
  });
  return isSortedAsc ? order : -order;
}

function determineSortType(items: unknown[], field: string, type?: SortTypes) {
  if (type === SortTypes.date) return { sortAsDate: true };
  if (type === SortTypes.int) return { sortAsInt: true };
  if (type === SortTypes.string) return {};

  const firstValue = (items[0] as UnknownObject)?.[field];
  const lastValue = (items[items.length - 1] as UnknownObject)?.[field];

  const sortAsInt = !isNaN(Number(firstValue)) && !isNaN(Number(lastValue));
  const sortAsDate =
    !isNaN(new Date(firstValue as string).getTime()) &&
    !isNaN(new Date(lastValue as string).getTime());

  return { sortAsInt, sortAsDate };
}

function sortBy<T>(
  items: T[] | undefined,
  field: string,
  isSortedAsc: boolean,
  type?: SortTypes,
  secondaryField?: string | null,
  secondaryDirection?: boolean
): T[] {
  if (!items?.length) return [];

  const { sortAsInt, sortAsDate } = determineSortType(items, field, type);
  const secondarySort = secondaryField
    ? determineSortType(items, secondaryField)
    : {};

  return [...items].sort((a, b) => {
    const fieldA = getFieldValue(a, field, { sortAsInt, sortAsDate });
    const fieldB = getFieldValue(b, field, { sortAsInt, sortAsDate });

    if (fieldA === fieldB && secondaryField) {
      const secondaryFieldA = getFieldValue(a, secondaryField, secondarySort);
      const secondaryFieldB = getFieldValue(b, secondaryField, secondarySort);
      return compare(
        secondaryFieldA,
        secondaryFieldB,
        secondaryDirection ?? isSortedAsc,
        secondarySort.sortAsInt ?? false
      );
    }

    return compare(
      fieldA,
      fieldB,
      isSortedAsc,
      sortAsInt || sortAsDate || false
    );
  });
}

export default sortBy;
