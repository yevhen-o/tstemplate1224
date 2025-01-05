import { useState, ComponentType, useCallback, useEffect, useRef } from "react";
import { isBrowser } from "src/helpers/utils";
import { KEY_CODES } from "src/constants";
import { OptionType } from "src/Types/FormTypes";

const VirtualizedList = ({
  items,
  CMP,
  handleClick,
  handleClose,
  itemHeight = 40,
  extraItems = 20,
  visibleSpace,
}: {
  items: (OptionType & {
    href?: string;
    onClick?: () => void;
  })[];
  itemHeight?: number;
  extraItems?: number;
  CMP: ComponentType<any>;
  handleClick?: (callback?: () => void) => void;
  handleClose?: () => void;
  visibleSpace: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isKeyboardNavigated, setIsKeyboardNavigated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const numberOfItems = items.length;
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - extraItems
  );
  let renderedNodesCount =
    Math.floor(visibleSpace / itemHeight) + 2 * extraItems;
  renderedNodesCount = Math.min(numberOfItems - startIndex, renderedNodesCount);

  const handleMouseEnter = (index: number) => () => {
    if (!isKeyboardNavigated) {
      setActiveIndex(index);
    }
  };

  const generateRows = () => {
    let itemsToDisplay: JSX.Element[] = [];
    for (let i = 0; i < renderedNodesCount; i++) {
      const index = i + startIndex;
      itemsToDisplay.push(
        <CMP
          item={items[index]}
          key={index}
          index={index}
          activeIndex={activeIndex}
          onMouseEnter={handleMouseEnter(index)}
        />
      );
    }

    return itemsToDisplay;
  };

  const scrollToActiveIndex = useCallback(
    (currentActiveIndex: number) => {
      const start = startIndex + extraItems;
      const end = startIndex + extraItems + visibleSpace / itemHeight;
      if (currentActiveIndex - 1 < start && scrollRef.current) {
        scrollRef.current.scrollTop = scrollTop - itemHeight;
      } else if (currentActiveIndex + 1 > end && scrollRef.current) {
        scrollRef.current.scrollTop = scrollTop + itemHeight;
      }
    },
    [startIndex, scrollTop, extraItems, itemHeight, visibleSpace]
  );

  const handleKeyActions = useCallback(
    (keyAction: KeyboardEvent) => {
      if (!isMounted) {
        return;
      }

      const { code } = keyAction;
      switch (code) {
        case KEY_CODES.ENTER:
          if (items[activeIndex] && items[activeIndex].onClick) {
            handleClick?.(items[activeIndex].onClick);
          } else if (activeIndex > -1 && items[activeIndex].href) {
            handleClose?.();
          }
          break;
        case KEY_CODES.ESC:
          handleClose?.();
          break;
        case KEY_CODES.ARROW_DOWN:
          const nextActiveIndex =
            activeIndex + 1 < items.length ? activeIndex + 1 : activeIndex;
          setActiveIndex(nextActiveIndex);
          scrollToActiveIndex(nextActiveIndex);
          break;
        case KEY_CODES.ARROW_UP:
          const prevActiveIndex =
            activeIndex > 0 ? activeIndex - 1 : activeIndex;
          setActiveIndex(prevActiveIndex);
          scrollToActiveIndex(prevActiveIndex);
          break;
        default:
          break;
      }
    },
    [
      activeIndex,
      handleClick,
      handleClose,
      isMounted,
      items,
      scrollToActiveIndex,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KEY_CODES.ARROW_DOWN || e.code === KEY_CODES.ARROW_UP) {
        e.preventDefault();
        e.stopPropagation();
        setIsKeyboardNavigated(true);
      }
      handleKeyActions(e);
    };

    if (isBrowser()) {
      document.addEventListener("keydown", handleKeyDown);
    }

    setIsMounted(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyActions]);

  const handleMouseMove = () => {
    if (isKeyboardNavigated) setIsKeyboardNavigated(false);
  };

  return (
    <div
      ref={scrollRef}
      onMouseMove={handleMouseMove}
      className="overflow-y-scroll w-full"
      style={{ height: `${visibleSpace}px` }}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
      }}
    >
      <div
        style={{
          height: `${numberOfItems * itemHeight}px`,
        }}
      >
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
          }}
        >
          {generateRows()}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;
