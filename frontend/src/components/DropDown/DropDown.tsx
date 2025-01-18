import { useEffect, useRef, useCallback, ComponentType } from "react";

import Portal from "src/components/Portal";
import VirtualScroll from "src/components/VirtualScroll";
import { useOutsideClick } from "src/hooks";
import { OptionType } from "src/Types/FormTypes";
import DropDownItem from "./DropDownItem";

import "./DropDown.scss";

interface DropDownProps {
  id?: string;
  CMP?: ComponentType<unknown>;
  value?: string | number | Array<string | number>;
  menuItems: OptionType[];
  itemHeight: number;
  searchText?: string;
  isTopFixed?: boolean;
  isCentered?: boolean;
  isWidthFixed?: boolean;
  isBottomFixed?: boolean;
  repositionOnscroll?: boolean;
  menuWrapperEl: HTMLButtonElement | null;
  handleClose: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  withCloseOnSelect?: boolean;
  hasActiveByDefault?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({
  id,
  CMP = DropDownItem,
  value = undefined,
  menuItems,
  itemHeight,
  searchText = "",
  isTopFixed = false,
  isCentered = false,
  isWidthFixed = false,
  isBottomFixed = false,
  repositionOnscroll = false,
  menuWrapperEl,
  handleClose,
  withCloseOnSelect,
  hasActiveByDefault = false,
}) => {
  const menuScroll = useRef<HTMLDivElement | null>(null);
  const menuDropdown = useRef<HTMLDivElement | null>(null);

  const getMinHeight = useCallback(() => {
    const fullSizeItems = menuItems.filter(
      ({ isDivider }) => !isDivider
    ).length;
    const separators = menuItems.length - fullSizeItems;
    const itemsMinHeight = 16 + fullSizeItems * itemHeight + separators * 9;
    if (itemsMinHeight > 320) {
      return 320;
    }
    return itemsMinHeight;
  }, [itemHeight, menuItems]);

  const getMenuPosition = useCallback(() => {
    if (!menuDropdown?.current || !menuWrapperEl || !menuScroll.current) {
      return;
    }
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const button = menuWrapperEl.getBoundingClientRect();
    const { height, top, width, x, y } = button;
    const rect = menuDropdown.current.getBoundingClientRect();
    const { width: menuWidth, height: menuHeight } = rect;
    const minHeight = getMinHeight();
    const style = {
      left: "",
      top: "",
    };
    if (isCentered) {
      style.left = `${x - (menuWidth / 2 - width / 2)}px`;
    } else if (ww - 20 - x > menuWidth) {
      style.left = `${x + 1}px`;
    } else {
      style.left = `${x - (menuWidth - width)}px`;
    }
    if (isBottomFixed) {
      style.top = `${y + height}px`;
      const reservedHeight = wh - (height + top);
      if (minHeight > reservedHeight) {
        const newMenuHeight = reservedHeight > 150 ? reservedHeight : 200;
        menuScroll.current.style.height = `${newMenuHeight}px`;
        menuScroll.current.style.minHeight = `${newMenuHeight}px`;
      }
    } else if (isTopFixed) {
      style.top = `${y - menuHeight}px`;
      const reservedHeight = wh - (height + top);
      if (minHeight > reservedHeight) {
        const newMenuHeight = reservedHeight > 150 ? reservedHeight : 200;
        menuScroll.current.style.height = `${newMenuHeight}px`;
        menuScroll.current.style.minHeight = `${newMenuHeight}px`;
      }
    } else {
      menuScroll.current.style.minHeight = `${minHeight}px`;
      if (wh - (height + top) > menuHeight) {
        style.top = `${y + height}px`;
      } else {
        style.top = `${y - menuHeight}px`;
      }
    }

    if (isWidthFixed) {
      menuScroll.current.style.width = `${width}px`;
      menuScroll.current.style.maxWidth = `${width}px`;
    }
    menuDropdown.current.style.left = style.left;
    menuDropdown.current.style.top = style.top;
    // setTimeout(() => {
    menuDropdown.current.style.opacity = "1";
    menuDropdown.current.style.minHeight = `${minHeight}px`;
    // }, 50);
  }, [
    getMinHeight,
    isBottomFixed,
    isCentered,
    isTopFixed,
    isWidthFixed,
    menuWrapperEl,
  ]);

  const scrollHandler = useCallback(() => {
    if (!repositionOnscroll) {
      handleClose();
    } else if (menuDropdown && menuWrapperEl) {
      getMenuPosition();
    }
  }, [
    repositionOnscroll,
    menuWrapperEl,
    menuDropdown,
    getMenuPosition,
    handleClose,
  ]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    getMenuPosition();
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler, getMenuPosition]);

  useEffect(() => {
    getMenuPosition();
  }, [menuItems, getMenuPosition]);

  useOutsideClick(menuDropdown, handleClose);

  const isItemSelected = (itemValue: string, newValue: string | string[]) => {
    if (typeof newValue === "string") {
      return itemValue === newValue;
    }
    if (Array.isArray(newValue)) {
      return newValue.includes(itemValue);
    }
    return false;
  };

  const handleClick =
    (clickFn?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (withCloseOnSelect) {
        handleClose(e);
      }
      clickFn?.(e);
    };

  return (
    <Portal>
      <div
        ref={menuDropdown}
        className={"drop-down__wrapper"}
        style={{ opacity: 0 }}
      >
        <div ref={menuScroll} className={"drop-down__container"}>
          {!!menuItems.length && (
            <VirtualScroll
              id={id}
              itemHeight={itemHeight}
              items={menuItems.map((i, index) => ({ ...i, index }))}
              value={value}
              hasActiveByDefault={hasActiveByDefault}
              handleClick={handleClick}
              handleClose={handleClose}
              isItemSelected={isItemSelected}
              CMP={CMP || DropDownItem}
            />
          )}
          {!menuItems.length && (
            <small className={"drop-down__nothing-to-display"}>
              {searchText
                ? "No items match your criteria"
                : "Nothing to display"}
            </small>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default DropDown;
