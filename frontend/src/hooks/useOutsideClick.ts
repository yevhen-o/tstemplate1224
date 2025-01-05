import { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void
): void => {
  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      if (ref.current?.contains(e.target as Node)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener("mouseup", clickHandler);

    return (): void => {
      document.removeEventListener("mouseup", clickHandler);
    };
  }, [onOutsideClick, ref]);
};
