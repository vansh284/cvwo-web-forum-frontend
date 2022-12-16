import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get, post } from "../../api/requests";
import { RootState } from "../../app/store";

export interface UserState {
  username: string;
  statusLog: "logged in" | "pending" | "logged out";
  statusCreate: "idle" | "pending" | "success";
  error: null | string;
}

export const login = createAsyncThunk(
  "user/login",
  async (user: { username: string; password: string }) => {
    return await post("/login", user);
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (user: { username: string; password: string }) => {
    //does this need to be a async thunk?
    return await post("/users", user);
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  return await get("/users");
});

const initialState: UserState = {
  username: "",
  statusLog: "logged out",
  statusCreate: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userErrorNoted(state) {
      state.error = null;
    },
    userStatusCreateNoted(state) {
      state.statusCreate = "idle"
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.error = null;
        state.statusLog = "pending";
        state.username = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.error = null;
        state.statusLog = "logged in";
        state.username = action.payload.username;
      })
      .addCase(login.rejected, (state, action) => {
        state.statusLog = "logged out";
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
        state.username = "";
      })
      .addCase(register.pending, (state, action) => {
        state.error = null;
        state.statusCreate = "pending";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.error = null;
        state.statusCreate = "success";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message
          ? action.error.message
          : "unknown error";
        state.statusCreate = "idle";
      })
      .addCase(getUser.pending, (state, action) => {
        state.error = null;
        state.statusLog = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.error = null;
        state.statusLog = "logged in";
        state.username = action.payload.username;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = null;
        state.statusLog = "logged out";
      });
  },
});

export default userSlice.reducer;
export const { userErrorNoted, userStatusCreateNoted } = userSlice.actions
export const selectUsername = (state: RootState) => state.user.username;
