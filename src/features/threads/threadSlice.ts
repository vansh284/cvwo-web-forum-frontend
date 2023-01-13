import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, mdelete, post, put } from "../../api/requests";
import { RootState } from "../../app/store";

export interface Thread {
  ID?: Number;
  title: string;
  content: string;
  CreatedAt?: string;
  tag: string;
  author: string;
  image: string | null;
}

export interface ThreadListState {
  threadList: Thread[]; // Array of threads
  statusGet: "idle" | "pending" | "success"; // Status of GET threads request
  statusUpdate: "idle" | "pending" | "success"; // Status of POST/PUT threads request
  error: null | string; // Errors of threads requests
}

export const getThreadList = createAsyncThunk(
  "thread/getThreadList",
  async () => {
    return await get("/threads");
  }
);

export const createThread = createAsyncThunk(
  "thread/createThread",
  async (thread: Thread) => {
    return await post("/threads", thread);
  }
);

export const editThread = createAsyncThunk(
  "thread/editThread",
  async (thread: Thread) => {
    return await put("/threads/" + thread.ID, thread);
  }
);

export const deleteThread = createAsyncThunk(
  "thread/deleteThread",
  async (thread: Thread) => {
    return await mdelete("/threads/" + thread.ID, thread);
  }
);

const initialState: ThreadListState = {
  threadList: [],
  statusGet: "idle",
  statusUpdate: "idle",
  error: null,
};

const threadSlice = createSlice({
  name: "thread",
  initialState: initialState,
  reducers: {
    // Reset the error for the request once system has noted it.
    threadsErrorNoted(state) {
      state.error = null;
    },
    sortThreadsByMostRecent(state) {
      state.threadList.sort((a: Thread, b: Thread) => {
        if (a.CreatedAt && b.CreatedAt) {
          const d1: Date = new Date(a.CreatedAt);
          const d2: Date = new Date(b.CreatedAt);
          return d1 > d2 ? -1 : 1;
        } else {
          return 0;
        }
      });
    },
    sortThreadsByLeastRecent(state) {
      state.threadList.sort((a: Thread, b: Thread) => {
        if (a.CreatedAt && b.CreatedAt) {
          const d1: Date = new Date(a.CreatedAt);
          const d2: Date = new Date(b.CreatedAt);
          return d1 < d2 ? -1 : 1;
        } else {
          return 0;
        }
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getThreadList.pending, (state, action) => {
        state.statusGet = "pending";
        state.error = null;
      })
      .addCase(getThreadList.fulfilled, (state, action) => {
        state.statusGet = "success";
        state.error = null;
        state.threadList = [];
        action.payload.forEach((element: Thread) => {
          state.threadList.push(element);
        });
      })
      .addCase(getThreadList.rejected, (state, action) => {
        state.statusGet = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(createThread.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(createThread.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(editThread.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(editThread.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(editThread.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(deleteThread.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      });
  },
});

export default threadSlice.reducer;

export const {
  threadsErrorNoted,
  sortThreadsByMostRecent,
  sortThreadsByLeastRecent,
} = threadSlice.actions;

export const selectThreadList = (state: RootState) => state.thread.threadList;

export const selectThreadByID = (ID: Number) => (state: RootState) => {
  const res: Thread | undefined = state.thread.threadList.find(
    (element) => element.ID === ID
  );
  return res
    ? res
    : {
        ID: 0,
        title: "",
        content: "",
        tag: "",
        author: "",
        CreatedAt: "",
        image: null,
      };
};
