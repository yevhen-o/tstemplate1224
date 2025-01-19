import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

type StateType = {
  latestProjects: number[];
};

const initialState: StateType = {
  latestProjects: [],
};

const createSliceWithThunks = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

const latestProjectsSlice = createSliceWithThunks({
  name: "latestProjects",
  initialState,
  reducers: (create) => ({
    addLatestProject: create.reducer((state, action: { payload: number }) => {
      state.latestProjects = state.latestProjects.includes(action.payload)
        ? state.latestProjects
        : [...state.latestProjects, action.payload];
    }),
    removeLatestProject: create.reducer(
      (state, action: { payload: number }) => {
        state.latestProjects = state.latestProjects.filter(
          (projectId) => projectId !== action.payload
        );
      }
    ),
  }),
  selectors: {
    latestProjectsSelector: (state) => state.latestProjects,
  },
});

export const { addLatestProject, removeLatestProject } =
  latestProjectsSlice.actions;
export const { latestProjectsSelector } = latestProjectsSlice.selectors;
export default latestProjectsSlice.reducer;
