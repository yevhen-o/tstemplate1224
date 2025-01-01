import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientScreenInterface } from "src/Types/ClientScreen";

const initialState: ClientScreenInterface = {
  isScreenOrientationLandscape: false,
  isScreenXS: false,
  isScreenSM: false,
  isScreenMD: false,
  isScreenLG: false,
  screenWidth: 0,
  screenHeight: 0,
};

const clientScreenSlice = createSlice({
  name: "clientScreen",
  initialState,
  reducers: {
    setClientScreen(state, action: PayloadAction<ClientScreenInterface>) {
      state = action.payload;
      return state;
    },
  },
});

export const { setClientScreen } = clientScreenSlice.actions;
export default clientScreenSlice.reducer;
