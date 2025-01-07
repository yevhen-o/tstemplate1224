import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ContextMenu, { ContextMenuOptionType } from "src/components/ContextMenu";

interface StateInterface<T> {
  position: {
    x: number;
    y: number;
  };
  item: T | null;
  isToggled: boolean;
}

export const useContextMenu = <T extends object>(
  getContextMenuOptions: (item: T) => ContextMenuOptionType[],
  hasRepositionOnScroll: boolean = true
) => {
  const contextMenuRef = useRef<HTMLElement | null>(null);

  const [contextMenu, setContextMenu] = useState<StateInterface<T>>({
    position: { x: 0, y: 0 },
    item: null,
    isToggled: false,
  });

  const portalContainer = useRef(document.createElement("div"));

  useEffect(() => {
    const container = portalContainer.current;
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const handleOpenContextMenu =
    (item: T) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      const element = contextMenuRef.current;
      if (element instanceof HTMLElement) {
        const contextMenuRect = element.getBoundingClientRect();
        const isLeft = e.clientX < window.innerWidth - contextMenuRect.width;
        const isBottom =
          e.clientY < window.innerHeight - contextMenuRect.height;

        const x = isLeft ? e.clientX : e.clientX - contextMenuRect.width;
        const y = isBottom ? e.clientY : e.clientY - contextMenuRect.height;

        setContextMenu({
          position: { x, y },
          item,
          isToggled: true,
        });
      }
    };

  const resetContextMenu = useCallback(() => {
    setContextMenu({
      position: { x: 0, y: 0 },
      item: null,
      isToggled: false,
    });
  }, [setContextMenu]);

  let contextMenuOptions: ContextMenuOptionType[] = [];
  if (contextMenu.item) {
    contextMenuOptions = getContextMenuOptions(contextMenu.item);
  }

  useEffect(() => {
    let lastScrollTop = window.scrollY;
    let lastScrollLeft = window.scrollX;

    const scrollHandler = () => {
      if (!hasRepositionOnScroll) {
        resetContextMenu();
        return;
      }

      const currentScrollTop = window.scrollY;
      const currentScrollLeft = window.scrollX;

      const scrollDeltaY = currentScrollTop - lastScrollTop;
      const scrollDeltaX = currentScrollLeft - lastScrollLeft;

      // Adjust menu position based on scroll delta
      setContextMenu((prev) => ({
        ...prev,
        position: {
          x: prev.position.x - scrollDeltaX,
          y: prev.position.y - scrollDeltaY,
        },
      }));

      // Update last scroll position
      lastScrollTop = currentScrollTop;
      lastScrollLeft = currentScrollLeft;
    };

    if (hasRepositionOnScroll) {
      document.addEventListener("scroll", scrollHandler, { passive: true });
    }

    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [hasRepositionOnScroll, resetContextMenu]);

  const menuPlaceholder = createPortal(
    <ContextMenu
      resetContextMenu={resetContextMenu}
      rightClickItem={contextMenu.item}
      contextMenuRef={contextMenuRef}
      isToggled={contextMenu.isToggled}
      positionX={contextMenu.position.x}
      positionY={contextMenu.position.y}
      options={contextMenuOptions}
    />,
    portalContainer.current
  );

  return {
    activeItem: contextMenu.item,
    handleOpenContextMenu,
    menuPlaceholder,
  };
};

export default useContextMenu;
