import React, { useState, useEffect } from "react";

import Button from "src/components/Buttons";
import Select from "src/components/FormFields/Select";
import { FormValueType } from "src/hooks";
import { DEFAULT_PAGE_SIZE, PREDEFINED_PAGE_SIZES } from "src/constants";
import { deepEqual } from "src/helpers/utils";

interface PaginationProps {
  totalItems: number;
  appliedValues?: FormValueType;
  onChange?: (values: FormValueType) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  appliedValues,
  onChange,
}) => {
  const [values, setValues] = useState<FormValueType>({
    page: 1,
    perPage: DEFAULT_PAGE_SIZE,
  });
  const page = values.page ? +values.page : 1;
  const perPage = values.perPage ? +values.perPage : DEFAULT_PAGE_SIZE;
  const totalPages = Math.ceil(totalItems / +perPage);

  const handleChangePage = (pageToShow: number) => () => {
    setValues((prev) => ({ ...prev, page: pageToShow }));
  };

  const handleChangePerPage = (value: boolean | string) => {
    const newPerPage = Math.max(+value, 1); // Ensure positive value
    setValues((prev) => ({ ...prev, page: 1, perPage: newPerPage }));
  };

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  useEffect(() => {
    if (!!appliedValues && !deepEqual(appliedValues, values)) {
      setValues(appliedValues);
    }
  }, [appliedValues]);

  return (
    <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 grid grid-cols-2">
      <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 inline-flex">
        <nav
          aria-label="Pagination"
          className="inline-flex -space-x-px rounded-md shadow-sm dark:bg-gray-100 dark:text-gray-800"
        >
          <Button
            type="button"
            isBordered
            onClick={handleChangePage(+page - 1)}
            disabled={page === 1}
          >
            <span className="sr-only">Previous</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageItem) => (
              <Button
                key={pageItem}
                onClick={handleChangePage(pageItem)}
                isBordered
                isPrimary={pageItem === page}
                disabled={pageItem === page}
              >
                {pageItem}
              </Button>
            )
          )}

          <Button
            type="button"
            onClick={handleChangePage(+page + 1)}
            disabled={page === totalPages}
            isBordered
          >
            <span className="sr-only">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </nav>
        <span className="block">
          Page {page} of {totalPages}
        </span>
      </div>
      <div className="flex justify-self-end items-center gap-2">
        <span className="block">Items per page:</span>
        <Select
          fieldType="select"
          name="itemsPerPage"
          className={"my-0"}
          value={perPage.toString()}
          options={PREDEFINED_PAGE_SIZES.map((size) => ({
            value: `${size}`,
            label: `${size}`,
          }))}
          onChange={handleChangePerPage}
        />
      </div>
    </div>
  );
};

export default Pagination;
