import "./Table.scss";
import React, {
  //useMemo,
  useState,
  ReactElement,
  PropsWithChildren,
} from "react";
import classNames from "classnames";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";
import {
  Value,
  FieldType,
  useFilters,
  useSortWorker,
  usePagination,
  useSearchParamsAsValues,
} from "src/hooks";

import TableHead, { TableField } from "./TableHead";
import TableBody from "./TableBody";
import { FilterValueType } from "src/Types";
const defaultObj = {};

type TableProps<O> = {
  name: string;
  headerFields: TableField[];
  initialFilterValues?: FilterValueType;
  filterFields?: FieldType[];
  filterFunctions?: Record<string, (i: O, k: string, v: Value) => boolean>;
  wrapperClassName?: string;
  data: O[];
  sortBy?: string;
  isSortedAsc?: boolean;
  isDataFetching?: boolean;
  showEmptyDataMessage?: boolean;
  emptyDataMessageText?: string;
  getRowClasses?: (record: O) => string;
  renderFunctions?: Record<string, React.FC<O>>;
};

const defaultRenderFunction = {};

const Table = <O extends Record<string, unknown>>({
  data,
  name,
  // sortBy,
  // isSortedAsc,
  headerFields,
  filterFields,
  initialFilterValues = defaultObj,
  filterFunctions = defaultObj,
  isDataFetching,
  wrapperClassName,
  showEmptyDataMessage,
  emptyDataMessageText,
  getRowClasses,
  renderFunctions = defaultRenderFunction,
}: PropsWithChildren<TableProps<O>>): ReactElement => {
  // const initialValues = useMemo(
  //   () => ({ sortBy, isSortedAsc }),
  //   [sortBy, isSortedAsc]
  // );
  const { values, handleValuesChange } = useSearchParamsAsValues();

  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>(
    headerFields.map((f) => f.field)
  );

  const configuredFields = headerFields.filter((f) =>
    fieldsToDisplay.includes(f.field)
  );

  const appliedIsSortedAsc = values.sortOrder === "desc" ? false : true;

  const sortType =
    values?.sortBy === "createdAt" ? SortTypes.date : SortTypes.string;
  const { sortedData, isWorking } = useSortWorker(
    data || [],
    values?.sortBy,
    appliedIsSortedAsc,
    sortType
  );

  const { filters, filteredData } = useFilters(
    sortedData,
    initialFilterValues,
    filterFields,
    filterFunctions
  );

  const { pagination, paginatedItems } = usePagination<O>(filteredData);

  const handleSort = (field: TableField) => () => {
    if (!field.isSortable) {
      return;
    }
    if (field.field === values?.sortBy) {
      handleValuesChange(
        values.sortOrder ? { sortOrder: "" } : { sortOrder: "desc" }
      );
    } else {
      handleValuesChange({ sortBy: field.field, sortOrder: "" });
    }
  };

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      <div className="table__filters">{filters}</div>
      <table className={classNames("table", `${name}__table`)}>
        <TableHead
          name={name}
          sortBy={(values?.sortBy || "").toString()}
          isSortedAsc={appliedIsSortedAsc}
          headerFields={headerFields}
          fieldsToDisplay={fieldsToDisplay}
          configuredFields={configuredFields}
          onSortChange={handleSort}
          setFieldsToDisplay={setFieldsToDisplay}
        />
        <TableBody
          name={name}
          data={paginatedItems}
          getRowClasses={getRowClasses}
          renderFunctions={renderFunctions}
          configuredFields={configuredFields}
        />
      </table>
      {!!isDataFetching ||
        (!!isWorking && (
          <div className={"table__cell-shimmer"}>Loading...</div>
        ))}
      {!!showEmptyDataMessage && (
        <>{emptyDataMessageText ? emptyDataMessageText : "No data found."}</>
      )}
      <div className="table__pagination">{pagination}</div>
    </div>
  );
};

export default Table;
