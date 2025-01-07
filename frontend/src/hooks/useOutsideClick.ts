import { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void,
  isActive: boolean = true,
  trigger: keyof HTMLElementEventMap = "mouseup"
): void => {
  useEffect(() => {
    const clickHandler = (e: Event): void => {
      if (!isActive || ref.current?.contains(e.target as Node)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener(trigger, clickHandler);

    return (): void => {
      document.removeEventListener(trigger, clickHandler);
    };
  }, [onOutsideClick, ref, isActive, trigger]);
};
