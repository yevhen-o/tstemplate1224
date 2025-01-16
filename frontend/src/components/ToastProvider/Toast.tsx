import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import Buttons from "src/components/Buttons";
import { Close } from "src/components/Icons";
import { TIME_TO_DISPLAY_TOAST } from "src/constants";
import { ToastType, useToastStore } from "src/store/toasts/toastsStore";
import "./Toast.scss";

type ToastProps = {
  toast: ToastType;
};

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [timeAfterPause, setTimeAfterPause] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TIME_TO_DISPLAY_TOAST);

  useEffect(() => {
    setStartTime(Date.now());
    timeoutRef.current = setTimeout(() => {
      removeToast(toast);
    }, remainingTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [removeToast, toast, remainingTime]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      const newRemainingTime = remainingTime - (Date.now() - startTime);
      setTimeAfterPause(newRemainingTime);
    }
  };

  const handleMouseLeave = () => {
    setRemainingTime(timeAfterPause);
  };

  return (
    <div
      className={classNames("message-container", {
        "message-success": toast.isSuccess,
        "message-warning": toast.isWarning,
        "message-error": toast.isError,
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {typeof toast.message !== "string" ? (
        <div className={classNames("message")}>
          <span className={classNames("message-title")}>
            {toast.message.title}
          </span>
          <p className={classNames("message-description")}>
            {toast.message.description}
          </p>
        </div>
      ) : (
        <p className={classNames("message", "message-description")}>
          {toast.message}
        </p>
      )}
      <Buttons
        className={classNames("message-close-btn")}
        onClick={() => {
          removeToast(toast);
        }}
      >
        <Close size={24} />
      </Buttons>
    </div>
  );
};

export default Toast;
