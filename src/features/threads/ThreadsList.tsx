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

import {Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/system/Stack/Stack";
import { Box } from "@mui/system";
import { ThreadExcerpt } from "./ThreadExcerpt";
import { ThreadAdd } from "./ThreadAdd";
import { getUser } from "../user/userSlice";

export default function ThreadsList() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [threadAddDialogOpen, setThreadAddDialogOpen] = useState(false);
  const threadList: Thread[] = useAppSelector(selectThreadList);
  const threadsStatus: string = useAppSelector(
    (state: RootState) => state.thread.statusGet
  );
  const threadsError: string | null = useAppSelector(
    (state: RootState) => state.thread.error
  );
  //Log user in
  useEffect(() => {
    dispatch(getUser());
  });

  // Autodirect users not logged in to the home page
  useEffect(() => {
    if (threadsError !== null) {
      navigate("/", { replace: true });
      dispatch(threadsErrorNoted());
    }
  });

  //Get the threads
  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(getThreadList());
    }
  }, [threadsStatus, threadsError]);

  return (
    <Box sx={{ margin: "20px", padding: "50px" }}>
      <Stack spacing={2}>
        <h2>Threads</h2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Tooltip title="Create New Thread">
            <Fab
              color="primary"
              onClick={() => setThreadAddDialogOpen(true)}
              variant="extended"
            >
              <AddIcon />
              New Thread
            </Fab>
          </Tooltip>
        </Box>
        {threadList.map((thread: Thread) => (
          <ThreadExcerpt
            key={thread.ID?.toString()}
            thread={{ ...thread, content: thread.content.substring(0, 100) }}
          />
        ))}
        <ThreadAdd
          dialogOpen={threadAddDialogOpen}
          setDialogOpen={setThreadAddDialogOpen}
          thread={{ title: "", tag: "", content: "", author: "", image: null }}
          create={true}
        />
      </Stack>
    </Box>
  );
}
