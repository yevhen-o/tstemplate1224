import "./Table.scss";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement, useState } from "react";

import TableHead, { TableField } from "./TableHead";
import TableBody from "./TableBody";

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

const defaultRenderFunction = {};

const Table = <O extends Record<string, unknown>>({
  data,
  name,
  sortBy,
  topWidget,
  isSortedAsc,
  headerFields,
  isDataFetching,
  wrapperClassName,
  showEmptyDataMessage,
  emptyDataMessageText,
  onSortChange,
  getRowClasses,
  renderFunctions = defaultRenderFunction,
}: PropsWithChildren<TableProps<O>>): ReactElement => {
  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>(
    headerFields.map((f) => f.field)
  );

  const configuredFields = headerFields.filter((f) =>
    fieldsToDisplay.includes(f.field)
  );

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      {topWidget && topWidget}
      <table className={classNames("table", `${name}__table`)}>
        <TableHead
          name={name}
          sortBy={sortBy}
          isSortedAsc={isSortedAsc}
          headerFields={headerFields}
          fieldsToDisplay={fieldsToDisplay}
          configuredFields={configuredFields}
          onSortChange={onSortChange}
          setFieldsToDisplay={setFieldsToDisplay}
        />
        <TableBody
          name={name}
          data={data}
          getRowClasses={getRowClasses}
          renderFunctions={renderFunctions}
          configuredFields={configuredFields}
        />
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
