import React, { useState, useRef, useEffect } from "react";
import { useClientScreen, useObserveElementSize } from "src/hooks";

type InitialPosition =
  | { top: number; bottom?: never; left: number; right?: never }
  | { top: number; bottom?: never; left?: never; right: number }
  | { top?: never; bottom: number; left: number; right?: never }
  | { top?: never; bottom: number; left?: never; right: number };

interface StickerProps {
  children: React.ReactNode;
  initialPosition?: InitialPosition;
}

const Sticker: React.FC<StickerProps> = ({
  children,
  initialPosition = { top: 100, left: 100 },
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const { wrapperHeight, wrapperWidth } = useObserveElementSize(dragRef);

  const { screenHeight, screenWidth } = useClientScreen();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        setPosition((prev) => {
          const newPosition = { ...prev };

          if (prev.top !== undefined) {
            newPosition.top = prev.top + e.movementY;
          } else if (prev.bottom !== undefined) {
            newPosition.bottom = prev.bottom - e.movementY;
          }

          if (prev.left !== undefined) {
            newPosition.left = prev.left + e.movementX;
          } else if (prev.right !== undefined) {
            newPosition.right = prev.right - e.movementX;
          }

          return newPosition;
        });
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

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const newPosition = { ...prev };

        if (prev.left !== undefined && prev.left > screenWidth - wrapperWidth) {
          newPosition.left = screenWidth - wrapperWidth;
        }
        if (prev.top !== undefined && prev.top > screenHeight - wrapperHeight) {
          newPosition.top = screenHeight - wrapperHeight;
        }
        if (
          prev.right !== undefined &&
          prev.right > screenWidth - wrapperWidth
        ) {
          newPosition.right = screenWidth - wrapperWidth;
        }
        if (
          prev.bottom !== undefined &&
          prev.bottom > screenHeight - wrapperHeight
        ) {
          newPosition.bottom = screenHeight - wrapperHeight;
        }
        return newPosition;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth, screenHeight, wrapperHeight, wrapperWidth]);

  const styles: React.CSSProperties = {
    position: "fixed",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: 8,
  };

  if (position.top !== undefined) styles.top = position.top;
  if (position.bottom !== undefined) styles.bottom = position.bottom;
  if (position.left !== undefined) styles.left = position.left;
  if (position.right !== undefined) styles.right = position.right;

  return (
    <div ref={dragRef} style={styles} onMouseDown={handleMouseDown}>
      {children}
    </div>
  );
};

export default Sticker;
