// deprecated
// require to much work to forward ref and cast types, much simpler to use hook --> created instead useObserverElementSize ;)

import React, { useState, useEffect, useRef, ForwardedRef } from "react";

interface WrapperSizeProps {
  wrapperWidth?: number;
  wrapperHeight?: number;
}

export function withWrapperSize<T extends WrapperSizeProps>(
  Component: React.ComponentType<T>,
  isRefSupported: boolean = false
) {
  const SizeWrapper = React.forwardRef<
    HTMLElement,
    Omit<T, keyof WrapperSizeProps>
  >((props, ref: ForwardedRef<HTMLElement>) => {
    const [size, setSize] = useState<{ blockSize: number; inlineSize: number }>(
      {
        blockSize: 0,
        inlineSize: 0,
      }
    );

    const localRef = useRef<HTMLElement | null>(null);

    const setCombinedRef = (element: HTMLElement | null) => {
      if (ref) {
        if (typeof ref === "function") {
          ref(element);
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = element;
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
      const element = localRef.current;
      if (element) {
        resizeObserver.observe(element);
      }

      return () => resizeObserver.disconnect();
    }, [size]);

    if (isRefSupported) {
      // Case 1: Ref is forwarded, no wrapper needed
      return (
        <Component
          ref={setCombinedRef}
          {...(props as unknown as T)}
          wrapperWidth={size.inlineSize}
          wrapperHeight={size.blockSize}
        />
      );
    } else {
      // Case 2: Ref not supported, add wrapper
      return (
        <div className="case2" ref={setCombinedRef}>
          <Component
            {...(props as unknown as T)}
            wrapperWidth={size.inlineSize}
            wrapperHeight={size.blockSize}
          />
        </div>
      );
    }
  });

  return SizeWrapper;
}
