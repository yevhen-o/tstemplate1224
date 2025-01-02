import React, { useState, useRef, useEffect, forwardRef } from "react";
import { withClientScreen, withWrapperSize } from "src/hocs";

interface StickerProps {
  children: React.ReactNode;
  initialPosition?: { top: number; left: number };
  screenWidth: number;
  screenHeight: number;
  wrapperWidth: number;
  wrapperHeight: number;
}

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = element;
      }
    });
  };
}

const Sticker = forwardRef<HTMLDivElement, StickerProps>(
  (
    {
      children,
      initialPosition = { top: 100, left: 100 },
      screenWidth,
      screenHeight,
      wrapperHeight,
      wrapperWidth,
    },
    ref
  ) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && dragRef.current) {
          setPosition((prev) => ({
            top: prev.top + (e.movementY || 0),
            left: prev.left + (e.movementX || 0),
          }));
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);

    const { top, left } = position;

    useEffect(() => {
      if (left > screenWidth - wrapperWidth / 3) {
        setPosition((prev) => ({ ...prev, left: screenWidth - wrapperWidth }));
      }
      if (top > screenHeight - wrapperHeight / 3) {
        setPosition((prev) => ({ ...prev, top: screenWidth - wrapperWidth }));
      }
    }, [top, left, screenHeight, screenWidth, wrapperHeight, wrapperWidth]);

    return (
      <div
        ref={mergeRefs(dragRef, ref)}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 1000,
        }}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    );
  }
);
export default withClientScreen(withWrapperSize(Sticker, true));
