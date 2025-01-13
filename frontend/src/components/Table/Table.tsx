import { nanoid } from "nanoid";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement } from "react";

import "./Table.scss";

type TableProps<O> = {
  name: string;
  headerFields: {
    title: string;
    field: string;
  }[];
  wrapperClassName?: string;
  topWidget?: ReactElement;
  data: O[];
  isDataFetching?: boolean;
  showEmptyDataMessage?: boolean;
  emptyDataMessageText?: string;
  getRowClasses?: (record: O) => string;
  renderFunctions?: Record<string, React.FC<O>>;
};

const Table = <O extends Record<string, unknown>>({
  headerFields,
  topWidget,
  wrapperClassName,
  data,
  name,
  showEmptyDataMessage,
  emptyDataMessageText,
  isDataFetching,
  getRowClasses,
  renderFunctions = {},
}: PropsWithChildren<TableProps<O>>): ReactElement => (
  <div className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}>
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
              `${name}__cell--${f.field}`
            )}
          >
            {f.title}
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

export default Table;
