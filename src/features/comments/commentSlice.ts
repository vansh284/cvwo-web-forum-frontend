import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, mdelete, post, put } from "../../api/requests";
import { RootState } from "../../app/store";

export interface Comment {
  ID?: Number;
  thread_id: Number;
  content: string;
  CreatedAt?: string;
  author: string;
}

export interface CommentListState {
  commentList: Comment[];
  statusGet: "idle" | "pending" | "success";
  statusUpdate: "idle" | "pending" | "success";
  error: null | string;
}

export const getCommentList = createAsyncThunk(
  "commentList/getCommentList",
  async (ID: Number) => {
    return await get("/threads/" + ID + "/comments");
  }
);

export const createComment = createAsyncThunk(
  // this implementation assumes that there is a rerender whenever commentliststate changes (state.statusget is made idle upon success in the reducer below)
  "comment/createComment",
  async (comment: Comment) => {
    return await post("/threads/" + comment.thread_id + "/comments", comment);
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (comment: Comment) => {
    return await mdelete(
      "/threads/" + comment.thread_id + "/comments/" + comment.ID
    );
  }
);

export const editComment = createAsyncThunk(
  "comment/editComment",
  async (comment: Comment) => {
    return await put(
      "/threads/" + comment.thread_id + "/comments/" + comment.ID,
      comment
    );
  }
);

const initialState: CommentListState = {
  commentList: [],
  statusGet: "idle",
  statusUpdate: "idle",
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState: initialState,
  reducers: {commentsStatusNoted(state) {
    state.statusGet = "idle"
    state.statusUpdate = "idle"
  }},
  extraReducers(builder) {
    builder
      .addCase(getCommentList.pending, (state, action) => {
        state.statusGet = "pending";
        state.error = null;
      })
      .addCase(getCommentList.fulfilled, (state, action) => {
        state.statusGet = "success";
        state.error = null;
        state.commentList = [];
        action.payload.forEach((element: Comment) => {
          state.commentList.push(element);
        });
      })
      .addCase(getCommentList.rejected, (state, action) => {
        state.statusGet = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(createComment.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(editComment.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(editComment.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      })
      .addCase(deleteComment.pending, (state, action) => {
        state.statusUpdate = "pending";
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.statusUpdate = "success";
        state.statusGet = "idle";
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.statusUpdate = "idle";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
      });
  },
});

export default commentSlice.reducer;
export const { commentsStatusNoted } = commentSlice.actions

export const selectCommentList = (state: RootState) =>
  state.comment.commentList;
