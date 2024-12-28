import React, { useCallback, useEffect } from "react";

import Portal from "./Portal";
import Button from "src/components/Buttons";
import "./Modal.scss";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hasCloseButton?: boolean;
  actions?: { title: string; onClick: () => void }[];
};

const ModalDialog: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  actions,
  hasCloseButton = true,
}) => {
  const listener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.body.addEventListener("keyup", listener);

    return () => {
      document.body.removeEventListener("keyup", listener);
    };
  }, [listener]);

  return (
    <Portal>
      <div className="overlay" onClick={onClose} />
      <div className="modal__wrapper">
        <div className={"relative p-4 w-full max-w-2xl max-h-full"}>
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              {hasCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              )}
            </div>
            <div className="p-4 md:p-5 space-y-4">{children}</div>
            {actions && (
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                {actions.map(({ title, ...rest }) => (
                  <Button key={title} {...rest}>
                    {title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ModalDialog;
