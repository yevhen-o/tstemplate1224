import React, { useState, useEffect } from "react";

import { FormValueType } from "src/hooks";
import Button from "src/components/Buttons";
import { deepEqual } from "src/helpers/utils";
import Select from "src/components/FormFields/Select";
import { ChevronLeft, ChevronRight } from "src/components/Icons";
import { DEFAULT_PAGE_SIZE, PREDEFINED_PAGE_SIZES } from "src/constants";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      onChange?.(values);
    } else {
      setIsMounted(true);
    }
  }, [values, onChange, isMounted]);

  useEffect(() => {
    if (!!appliedValues && !deepEqual(appliedValues, values)) {
      setValues(appliedValues);
    }
    // TODO: Check how solve add value as a dependency
  }, [appliedValues]); //eslint-disable-line react-hooks/exhaustive-deps

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
            <ChevronLeft size={20} />
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
            <ChevronRight size={20} />
          </Button>
        </nav>
        <span className="block">
          Page {page} of <span data-test-id="total-pages">{totalPages}</span>
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
