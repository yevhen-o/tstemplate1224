import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as actionCreators from "src/store/actions";
import { useMemo } from "react";

export const useActions = () => {
  const dispatch = useDispatch();

  // Memoize the bound action creators
  return useMemo(
    () => bindActionCreators(actionCreators, dispatch),
    [dispatch]
  );
};
