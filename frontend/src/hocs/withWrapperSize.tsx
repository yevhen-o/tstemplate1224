import React, { useState, useEffect, useRef, ForwardedRef } from "react";

interface WrapperSizeProps {
  wrapperWidth?: number;
  wrapperHeight?: number;
}

export function withWrapperSize<T extends WrapperSizeProps>(
  Component: React.ComponentType<T>
) {
  const SizeWrapper = React.forwardRef<
    HTMLDivElement,
    Omit<T, keyof WrapperSizeProps>
  >((props, ref: ForwardedRef<HTMLDivElement>) => {
    const [size, setSize] = useState<{ blockSize: number; inlineSize: number }>(
      {
        blockSize: 0,
        inlineSize: 0,
      }
    );

    const localRef = useRef<HTMLDivElement | null>(null); // Mutable reference for the div

    const setCombinedRef = (element: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === "function") {
          ref(element);
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            element;
        }
      }
      localRef.current = element;
    };

    useEffect(() => {
      const observerCallback: ResizeObserverCallback = (
        entries: ResizeObserverEntry[]
      ) => {
        window.requestAnimationFrame(() => {
          if (entries.length > 0) {
            const { blockSize, inlineSize } = entries[0].borderBoxSize[0];
            if (
              blockSize !== size.blockSize ||
              inlineSize !== size.inlineSize
            ) {
              setSize({ blockSize, inlineSize });
            }
          }
        });
      };

      const resizeObserver = new ResizeObserver(observerCallback);
      const element = localRef.current; // Use mutable ref to access the DOM element
      if (element) {
        resizeObserver.observe(element);
      }

      return () => resizeObserver.disconnect();
    }, [size]);

    return (
      <div ref={setCombinedRef}>
        <Component
          {...(props as unknown as T)}
          wrapperWidth={size.inlineSize}
          wrapperHeight={size.blockSize}
        />
      </div>
    );
  });

  return SizeWrapper;
}

// The withWrapperSize is a Higher-Order Component (HOC) designed to enhance a given React component by injecting its parent's (or wrapper's) dimensions (width and height) as props. It uses the ResizeObserver API to monitor size changes of the wrapper element and updates the component dynamically whenever the size changes.
// Parameters:
// Component:

// A React component that requires wrapperWidth and wrapperHeight props to adjust its layout, styling, or functionality based on the size of its container.
// Props:

// The wrapped component must accept two additional props:
// wrapperWidth: The current width of the wrapper in pixels.
// wrapperHeight: The current height of the wrapper in pixels.

// useEffect(() => {
//   document.documentElement.style.setProperty(
//     "--filters-height",
//     `${wrapperHeight}px`
//   );
// }, [wrapperHeight]);
