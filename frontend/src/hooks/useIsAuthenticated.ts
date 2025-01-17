import { isAuthenticated } from "src/store/user/userSlice";
import { useTypedSelector } from "./useTypedSelector";

export const useIsAuthenticated = () => {
  return useTypedSelector(isAuthenticated);
};
