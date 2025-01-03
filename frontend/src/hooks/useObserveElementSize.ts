import { useState, useEffect } from "react";

export const useObserveElementSize = (
  ref: React.RefObject<HTMLElement>
): { wrapperWidth: number; wrapperHeight: number } => {
  const [size, setSize] = useState<{ blockSize: number; inlineSize: number }>({
    blockSize: 0,
    inlineSize: 0,
  });

  useEffect(() => {
    if (!ref.current) return; // Ensure the ref is defined

    const observerCallback: ResizeObserverCallback = (entries) => {
      if (entries.length > 0) {
        const { blockSize, inlineSize } = entries[0].borderBoxSize[0];
        setSize({ blockSize, inlineSize });
      }
    };

    const resizeObserver = new ResizeObserver(observerCallback);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return {
    wrapperWidth: size.inlineSize,
    wrapperHeight: size.blockSize,
  };
};
