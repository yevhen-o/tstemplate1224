import "./Table.scss";
import classNames from "classnames";
import React, {
  useState,
  useEffect,
  ReactElement,
  PropsWithChildren,
} from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import { SortTypes } from "src/helpers/utils/sortBy/sortBy";
import { FormValueType } from "src/hooks/useForm";
import { useSortWorker } from "src/hooks";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { storageSet, storageGetKey } from "src/services/localStorage";

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
  getRowClasses,
  renderFunctions = defaultRenderFunction,
}: PropsWithChildren<TableProps<O>>): ReactElement => {
  const [appliedValues, setAppliedValues] = useState<FormValueType | null>({
    sortBy: sortBy,
    isSortedAsc: isSortedAsc,
  });

  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>(
    headerFields.map((f) => f.field)
  );

  const configuredFields = headerFields.filter((f) =>
    fieldsToDisplay.includes(f.field)
  );

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const filterValues: FormValueType = { sortBy, isSortedAsc };
    searchParams.forEach((value, key) => (filterValues[key] = value));
    setAppliedValues(filterValues);
  }, [searchParams, sortBy, isSortedAsc]);

  const appliedIsSortedAsc = typeof appliedValues?.isSortedAsc === "undefined";
  const sortType =
    appliedValues?.sortBy === "createdAt" ? SortTypes.date : SortTypes.string;
  const { sortedData, isWorking } = useSortWorker(
    data || [],
    appliedValues?.sortBy,
    appliedIsSortedAsc,
    sortType
  );

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
    const valuesImpactUrl: FormValueType = {};
    Object.entries(updatedValues).forEach(([key, v]) => {
      if (["sortBy", "isSortedAsc"].includes(key)) {
        if (key === "sortBy" && !!v) {
          valuesImpactUrl[key] = v;
        } else if (key === "isSortedAsc" && !v) {
          valuesImpactUrl[key] = v;
        }
      } else {
        valuesImpactUrl[key] = v;
      }
    });
    storageSet(storageGetKey(pathname), valuesImpactUrl);
    navigate(getUrl(pathname as IDENTIFIERS, valuesImpactUrl));
  };

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      {topWidget && topWidget}
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
          data={sortedData}
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
    </div>
  );
};

export default Table;
