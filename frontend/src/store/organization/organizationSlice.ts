import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { deepClone } from "src/helpers/utils";
import { OrgInterface } from "src/Types";
import {
  KnownError,
  RequestState,
  FetchedTime,
  initialFetchingState,
  setFetchingState,
  setFulfilledState,
  setRejectedState,
  updateItemById,
  SliceError,
  RequestConfig,
  genericRequest,
} from "../shared";

type GeneralInfoType = OrgInterface & FetchedTime;

type RequestStateFetchData = RequestState &
  FetchedTime & {
    data: number[];
  };

type OrgType = {
  generalInfo: Partial<GeneralInfoType>;
  getOrg: RequestState;
  postOrg: RequestState;
  patchOrg: RequestState;
  getOrgMembers: RequestStateFetchData;
  getOrgProjects: RequestStateFetchData;
};

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: string;
};

type ProjectType = {
  projectId: number;
  name: string;
  description: string;
  imageUrl: string;
};

type StateType = {
  orgList: RequestState &
    FetchedTime & {
      data: number[];
    };
  orgById: {
    [key: string | number]: OrgType;
  };
  userById: {
    [key: string | number]: UserType;
  };
  projectById: {
    [key: string | number]: ProjectType;
  };
};

const defaultOrgState: OrgType = {
  generalInfo: {},
  getOrg: {
    ...initialFetchingState,
  },
  postOrg: {
    ...initialFetchingState,
  },
  patchOrg: {
    ...initialFetchingState,
  },
  getOrgMembers: {
    ...initialFetchingState,
    data: [],
  },
  getOrgProjects: {
    ...initialFetchingState,
    data: [],
  },
};

const initialState: StateType = {
  orgList: {
    ...initialFetchingState,
    data: [],
  },
  orgById: {},
  userById: {},
  projectById: {},
};

const createSliceWithThunks = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

const organizationSlice = createSliceWithThunks({
  name: "organization",
  initialState,
  reducers: (create) => ({
    getOrgList: create.asyncThunk<OrgInterface[], { signal?: AbortSignal }>(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig = {
          method: "GET",
          url: `/api/organizations`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          state.orgList = setFetchingState(
            state.orgList,
            action.meta.requestId
          );
        },
        rejected: (state, action) => {
          state.orgList = setRejectedState(
            state.orgList,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
        },
        fulfilled: (state, action) => {
          state.orgList = setFulfilledState(state.orgList);
          state.orgList.fetchedTime = Date.now();
          state.orgList.data = Array.from(
            new Set([
              ...state.orgList.data,
              ...action.payload.map((org: OrgInterface) => org.organizationId),
            ])
          );
          action.payload.forEach((org: OrgInterface) => {
            state.orgById[org.organizationId] = {
              ...(state.orgById[org.organizationId] ||
                deepClone(defaultOrgState)),
              generalInfo: {
                ...(state.orgById[org.organizationId]?.generalInfo || {}),
                ...org,
              },
            };
          });
        },
      }
    ),
    getOrgInfo: create.asyncThunk<
      OrgInterface,
      { signal?: AbortSignal; organizationId: number }
    >(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig = {
          method: "GET",
          url: `/api/organizations/${args.organizationId}`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrg = setFetchingState(org.getOrg, action.meta.requestId);
          state.orgById[organizationId] = org;
        },
        rejected: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrg = setRejectedState(
            org.getOrg,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
          state.orgById[organizationId] = org;
        },
        fulfilled: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrg = setFulfilledState(org.getOrg);
          org.generalInfo = {
            ...org.generalInfo,
            ...action.payload,
            fetchedTime: Date.now(),
          };
          state.orgById[organizationId] = org;
        },
      }
    ),
    getOrgUsers: create.asyncThunk<
      UserType[],
      { signal?: AbortSignal; organizationId: number }
    >(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig = {
          method: "GET",
          url: `/api/organizations/${args.organizationId}/users`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgMembers = setFetchingState(
            org.getOrgMembers,
            action.meta.requestId
          );
          state.orgById[organizationId] = org;
        },
        rejected: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgMembers = setRejectedState(
            org.getOrgMembers,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
          state.orgById[organizationId] = org;
        },
        fulfilled: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgMembers = setFulfilledState(org.getOrgMembers);
          org.getOrgMembers.data = action.payload.map(({ userId }) => userId);
          org.getOrgMembers.fetchedTime = Date.now();
          action.payload.forEach((user) => {
            state.userById[user.userId] = {
              ...(state.userById[user.userId] || {}),
              ...user,
            };
          });
          state.orgById[organizationId] = org;
        },
      }
    ),
    getOrgProjects: create.asyncThunk<
      ProjectType[],
      { signal?: AbortSignal; organizationId: number }
    >(
      async (args, thunkApi) => {
        const fetchOptions: RequestConfig = {
          method: "GET",
          url: `/api/organizations/${args.organizationId}/projects`,
          signal: args.signal,
          headers: {
            "Content-Type": "application/json",
          },
        };
        return genericRequest(fetchOptions, thunkApi);
      },
      {
        pending: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgProjects = setFetchingState(
            org.getOrgProjects,
            action.meta.requestId
          );
          state.orgById[organizationId] = org;
        },
        rejected: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgProjects = setRejectedState(
            org.getOrgProjects,
            action.meta,
            action.payload as SliceError,
            action.error.message
          );
          state.orgById[organizationId] = org;
        },
        fulfilled: (state, action) => {
          const { organizationId } = action.meta.arg;
          const org =
            state.orgById[organizationId] || deepClone(defaultOrgState);
          org.getOrgProjects = setFulfilledState(org.getOrgProjects);
          org.getOrgProjects.data = action.payload.map(
            ({ projectId }) => projectId
          );
          org.getOrgProjects.fetchedTime = Date.now();
          action.payload.forEach((project) => {
            state.projectById[project.projectId] = {
              ...(state.projectById[project.projectId] || {}),
              ...project,
            };
          });
          state.orgById[organizationId] = org;
        },
      }
    ),
  }),
});

export const { getOrgList, getOrgInfo, getOrgProjects, getOrgUsers } =
  organizationSlice.actions;
export default organizationSlice.reducer;
