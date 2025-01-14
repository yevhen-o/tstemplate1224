import { nanoid } from "nanoid";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement } from "react";

import "./Table.scss";

interface TableField {
  title?: string;
  field: string;
  isSortable?: boolean;
  isAlwaysVisible?: boolean;
}

type TableProps<O> = {
  name: string;
  headerFields: TableField[];
  wrapperClassName?: string;
  topWidget?: ReactElement;
  data: O[];
  sortBy?: string;
  isSortedAsc?: boolean;
  isDataFetching?: boolean;
  showEmptyDataMessage?: boolean;
  emptyDataMessageText?: string;
  getRowClasses?: (record: O) => string;
  onSortChange?: (sortBy: string, isSortedAsc: boolean) => void;
  renderFunctions?: Record<string, React.FC<O>>;
};

const Table = <O extends Record<string, unknown>>({
  headerFields,
  topWidget,
  wrapperClassName,
  data,
  name,
  sortBy,
  isSortedAsc,
  showEmptyDataMessage,
  emptyDataMessageText,
  isDataFetching,
  getRowClasses,
  onSortChange,
  renderFunctions = {},
}: PropsWithChildren<TableProps<O>>): ReactElement => {
  const handleSort = (field: TableField) => () => {
    if (!field.isSortable) {
      return;
    }
    if (field.field === sortBy) {
      onSortChange?.(sortBy, !isSortedAsc);
    } else {
      onSortChange?.(field.field, true);
    }
  };

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      {topWidget && topWidget}
      <table className={classNames("table", `${name}__table`)}>
        <tr className={classNames("row", "row--head", `${name}__row--head`)}>
          {headerFields.map((f) => (
            <th
              key={f.field}
              className={classNames(
                "caption",
                "cell",
                "cell--head",
                `${name}__cell--head`,
                `${name}__cell--${f.field}`,
                { "cell--sortable": f.isSortable }
              )}
              onClick={handleSort(f)}
              aria-label={`Change sort field to ${f.title}`}
              role="button"
            >
              {f.title}
              {f.isSortable && (
                <span
                  className={classNames("cell__sort-indicator", {
                    "cell__sort-indicator--active": sortBy === f.field,
                  })}
                >
                  {isSortedAsc || sortBy !== f.field ? (
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4V20M12 20L18 14M12 20L6 14"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 20V4M12 4L6 10M12 4L18 10"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </span>
              )}
            </th>
          ))}
        </tr>
        {data.map((record, index) => (
          <tr
            key={`${record?.id || nanoid()}__${index}`}
            className={classNames(
              "row",
              `${name}__row`,
              getRowClasses ? getRowClasses(record) : ""
            )}
          >
            {headerFields.map((f) => (
              <td
                key={`${index}__${f.field}`}
                className={classNames(
                  "caption",
                  "cell",
                  `${name}__cell`,
                  `${name}__cell--${f.field}`
                )}
              >
                {renderFunctions[f.field]
                  ? renderFunctions[f.field](record)
                  : ((record?.[f.field] as string) || "").toString()}
              </td>
            ))}
          </tr>
        ))}
      </table>
      {!!isDataFetching && (
        <div className={"table__cell-shimmer"}>Loading...</div>
      )}
      {!!showEmptyDataMessage && (
        <>{emptyDataMessageText ? emptyDataMessageText : "No data found."}</>
      )}
    </div>
  );
};

export default Table;
