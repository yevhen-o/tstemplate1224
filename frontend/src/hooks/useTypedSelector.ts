import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "src/store";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
