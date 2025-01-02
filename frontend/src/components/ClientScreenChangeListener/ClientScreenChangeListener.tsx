import { useEffect } from "react";
import { useActions } from "src/hooks/useActions";
import useClientScreen from "src/hooks/useClientScreen";

export const ClientScreenChangeListener = () => {
  const {
    screenHeight,
    screenWidth,
    isScreenLG,
    isScreenMD,
    isScreenOrientationLandscape,
    isScreenSM,
    isScreenXS,
  } = useClientScreen();
  const { setClientScreen } = useActions();
  useEffect(() => {
    setClientScreen({
      isScreenLG,
      isScreenMD,
      isScreenSM,
      isScreenXS,
      screenWidth,
      screenHeight,
      isScreenOrientationLandscape,
    });
  }, [
    isScreenLG,
    isScreenSM,
    isScreenMD,
    isScreenXS,
    screenWidth,
    screenHeight,
    setClientScreen,
    isScreenOrientationLandscape,
  ]);

  return <></>;
};

export default ClientScreenChangeListener;
