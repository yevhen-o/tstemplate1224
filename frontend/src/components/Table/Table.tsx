import "./Table.scss";
import React, {
  useMemo,
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
  useSearchParamsOrLocalStorage,
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
  sortBy,
  isSortedAsc,
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
  const initialValues = useMemo(
    () => ({ sortBy, isSortedAsc }),
    [sortBy, isSortedAsc]
  );
  const { appliedValues, handleValuesChange } = useSearchParamsOrLocalStorage({
    initialValues,
  });

  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>(
    headerFields.map((f) => f.field)
  );

  const configuredFields = headerFields.filter((f) =>
    fieldsToDisplay.includes(f.field)
  );

  const appliedIsSortedAsc = typeof appliedValues?.isSortedAsc === "undefined";

  const sortType =
    appliedValues?.sortBy === "createdAt" ? SortTypes.date : SortTypes.string;
  const { sortedData, isWorking } = useSortWorker(
    data || [],
    appliedValues?.sortBy,
    appliedIsSortedAsc,
    sortType
  );

  const { filters, filteredData } = useFilters(
    sortedData,
    initialFilterValues,
    filterFields,
    filterFunctions
  );

  console.log("render");

  const { pagination, paginatedItems } = usePagination<O>(filteredData);

  const handleSort = (field: TableField) => () => {
    const updatedValues = { ...appliedValues };
    if (!field.isSortable) {
      return;
    }
    if (field.field === appliedValues?.sortBy) {
      updatedValues.isSortedAsc =
        typeof appliedValues.isSortedAsc === "undefined" ? false : true;
    } else {
      updatedValues.sortBy = field.field;
      updatedValues.isSortedAsc = true;
    }
    handleValuesChange(updatedValues);
  };

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      {filters}
      <table className={classNames("table", `${name}__table`)}>
        <TableHead
          name={name}
          sortBy={(appliedValues?.sortBy || "").toString()}
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
      {pagination}
    </div>
  );
};

export default Table;
