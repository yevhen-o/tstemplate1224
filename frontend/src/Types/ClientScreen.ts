export enum SCREEN_SIZE {
  LG = 993,
  MD = 992,
  SM = 768,
  XS = 576,
}

export enum SCREEN_ORIENTATION {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export interface ClientScreenInterface {
  isScreenOrientationLandscape: boolean;
  isScreenXS: boolean;
  isScreenSM: boolean;
  isScreenMD: boolean;
  isScreenLG: boolean;
  screenWidth: number;
  screenHeight: number;
}
