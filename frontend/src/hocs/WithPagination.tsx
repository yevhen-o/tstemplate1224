import React, { useState } from "react";
import Button from "src/components/Buttons";
import InputField from "src/components/FormFields/InputField";
import Select from "src/components/FormFields/Select";
import { DEFAULT_PAGE_SIZE, PREDEFINED_PAGE_SIZES } from "src/constants";

interface WithPaginationProps<T> {
  items: T[];
}

interface InjectedProps<T> {
  items: T[];
}

export function withPagination<T>(
  Component: React.ComponentType<InjectedProps<T>>
) {
  return function PaginationWrapper(props: WithPaginationProps<T>) {
    const { items } = props;
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

    const totalPages = Math.ceil(items.length / perPage);

    const handleChangePage = (pageToShow: number) => () => {
      setPage(pageToShow);
    };

    const itemsToDisplay = items.slice(
      (page - 1) * perPage,
      (page - 1) * perPage + perPage
    );

    return (
      <>
        <Component {...props} items={itemsToDisplay} />

        <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 grid grid-cols-2">
          <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 inline-flex">
            <nav
              aria-label="Pagination"
              className="inline-flex -space-x-px rounded-md shadow-sm dark:bg-gray-100 dark:text-gray-800"
            >
              <Button
                type="button"
                isBordered
                onClick={handleChangePage(page - 1)}
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
                onClick={handleChangePage(page + 1)}
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
              onChange={(value) => {
                const newPerPage = Math.max(+value, 1); // Ensure positive value
                setPerPage(newPerPage);
                setPage(1);
              }}
            />
          </div>
        </div>
      </>
    );
  };
}
