import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'
import threadReducer from '../features/threads/threadSlice'
import commentReducer from '../features/comments/commentSlice'

export const store = configureStore({
  reducer: {
    user: userReducer, 
    thread: threadReducer,
    comment: commentReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
