export enum IDENTIFIERS {
  HOME = "/",
  DROP_DOWNS = "/dropdowns",
  TODOS = "/todos",
  TODO_VIEW = "/todos/[todoId]",
  PAGE_401 = "/401",
  PAGE_404 = "/404",
}

type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | { toString(): string };
type Params = Record<string, Primitive | Primitive[]>;
type RequiredParams<K extends string> = [Params & Record<K, string>];
type NoRequiredParams = [Params?];

const itemToString = (
  item: Primitive | Primitive[]
): string | string[] | null => {
  if (Array.isArray(item)) {
    return item
      .map((i) => (i instanceof Date ? i.toISOString() : i?.toString() || null))
      .filter(Boolean) as string[];
  }

  if (item instanceof Date) return item.toISOString();
  return item != null ? item.toString() : null;
};

const removeUnresolvedPathParams = (url: string): string => {
  const regexp = /{([^/]+)}/gm;
  const newUrl = url.replace(regexp, "");
  if (newUrl !== url) {
    // logError(new Error("Unresolved path param"), { newUrl, url });
  }
  return newUrl;
};

const buildUrl = (identifier: string, params: Params = {}): string => {
  let url = identifier;
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const resolvedValue = itemToString(value);
    if (resolvedValue) {
      const placeholder = `[${key}]`;

      if (url.includes(placeholder)) {
        url = url.replace(
          placeholder,
          Array.isArray(resolvedValue)
            ? encodeURIComponent(
                resolvedValue.map(encodeURIComponent).join(",")
              )
            : encodeURIComponent(resolvedValue)
        );
      } else {
        if (Array.isArray(resolvedValue)) {
          resolvedValue.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.set(key, resolvedValue);
        }
      }
    }
  }

  url = removeUnresolvedPathParams(url);

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

type IdentifierParams<I> = I extends IDENTIFIERS.TODO_VIEW
  ? RequiredParams<"todoId">
  : NoRequiredParams;

export const getUrl = <I extends IDENTIFIERS>(
  identifier: I,
  ...[params]: IdentifierParams<I>
): string => buildUrl(identifier, params);

const convertToReactRouterPath = (identifier: string): string => {
  return identifier.replace(/\[([^\]]+)]/g, ":$1");
};

export const getReactRouterPath = <I extends IDENTIFIERS>(
  identifier: I
): string => {
  return convertToReactRouterPath(identifier.toString());
};
