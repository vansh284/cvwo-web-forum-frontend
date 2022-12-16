import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import {
  getThreadList,
  selectThreadList,
  Thread,
  threadsErrorNoted,
} from "./threadSlice";

import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/system/Stack/Stack";
import { Box } from "@mui/system";
import { ThreadExcerpt } from "./ThreadExcerpt";
import { ThreadAdd } from "./ThreadAdd";
import { getUser } from "../user/userSlice";

export default function ThreadsList() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [threadAddOpen, setThreadAddOpen] = useState(false);
  const threadList: Thread[] = useAppSelector(selectThreadList);
  const threadsStatus: string = useAppSelector(
    (state: RootState) => state.thread.statusGet
  );
  const threadsError: string | null = useAppSelector(
    (state: RootState) => state.thread.error
  );
  //Log user in
  useEffect(() => {
    dispatch(getUser())
  });

  //Autodirect users not logged in to the home page
  useEffect(() => {
    if (threadsError !== null) {
      navigate("/", { replace: true });
      dispatch(threadsErrorNoted());
    }
  }, [threadsError]);

  //Get the threads
  useEffect(() => {
    if (threadsStatus == "idle") {
      dispatch(getThreadList());
    }
  }, [threadsStatus, threadsError]);

  return (
    <Stack spacing={2}>
      <h2>Threads</h2>
      {threadList.map((thread: Thread) => (
        <ThreadExcerpt
          key={thread.ID?.toString()}
          thread={{ ...thread, content: thread.content.substring(0, 100) }}
        />
      ))}
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
      >
        <Tooltip title="Create New Thread">
          <Fab color="primary" onClick={() => setThreadAddOpen(true)}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
      <ThreadAdd
        threadAddOpen={threadAddOpen}
        setThreadAddOpen={setThreadAddOpen}
      />
    </Stack>
  );
}
