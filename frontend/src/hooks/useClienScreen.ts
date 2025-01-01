// If a lot of components will use this hook number of resize listeners will grow.
// As remembering that React attach just one exact listener, and than provide events to consumers it don't look so bed.
// But maybe, setup just one listener and populate this data through redux more preferred.

import { useState, useEffect } from "react";
import { throttle } from "src/helpers/utils";
import { SCREEN_SIZE, ClientScreenInterface } from "src/Types/ClientScreen";

const calcInnerWidth = (): ClientScreenInterface => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    isScreenOrientationLandscape: width > height,
    isScreenXS: width < SCREEN_SIZE.XS,
    isScreenSM: width >= SCREEN_SIZE.XS && width < SCREEN_SIZE.SM,
    isScreenMD: width >= SCREEN_SIZE.SM && width < SCREEN_SIZE.MD,
    isScreenLG: width > SCREEN_SIZE.MD,
    screenWidth: width,
    screenHeight: height,
  };
};

export const useClientScreen = (): ClientScreenInterface => {
  const [clientScreen, setClientScreen] = useState<ClientScreenInterface>({
    ...calcInnerWidth(),
  });
  useEffect(() => {
    const calcWidth = throttle((): void => {
      setClientScreen({ ...calcInnerWidth() });
    }, 300);
    window.addEventListener("resize", calcWidth);
    return () => window.removeEventListener("resize", calcWidth);
  }, []);

  return clientScreen;
};

export default useClientScreen;
