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

import {
  Autocomplete,
  Button,
  Chip,
  Fab,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/system/Stack/Stack";
import { Box } from "@mui/system";
import { ThreadExcerpt } from "./ThreadExcerpt";
import { ThreadAdd } from "./ThreadAdd";
import { getUser, selectUsername } from "../user/userSlice";

export default function ThreadsList() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [threadAddDialogOpen, setThreadAddDialogOpen]: [boolean, Function] =
    useState(false);
  const [threadList, setThreadList]: [Thread[], Function] = useState([]);
  const fullThreadList = useAppSelector(selectThreadList);
  const threadsStatus: string = useAppSelector(
    (state: RootState) => state.thread.statusGet
  );
  const threadsError: string | null = useAppSelector(
    (state: RootState) => state.thread.error
  );
  const currentUser = useAppSelector(selectUsername);
  const tags: string[] = [
    "All",
    "Education",
    "Work",
    "Social Life",
    "Philosophy",
    "Culture",
    "Politics",
    "Miscellaneous",
  ];
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
    setThreadList(fullThreadList);
  }, [threadsStatus, threadsError]);

  return (
    <Box sx={{ margin: "20px", padding: "50px" }}>
      <Stack spacing={2}>
        <h2>Threads</h2>
        <Autocomplete
          multiple
          options={[
            "Education",
            "Work",
            "Social Life",
            "Philosophy",
            "Culture",
            "Politics",
            "Miscellaneous",
          ]}
          onChange={(_, tags) =>
            tags.length > 0
              ? setThreadList(
                  fullThreadList.filter((thread) =>
                    tags.reduce(
                      (curr, tag) => curr || tag === thread.tag,
                      false
                    )
                  )
                )
              : setThreadList(fullThreadList)
          }
          disablePortal
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag"
              placeholder="Select the tags you wish to see"
            />
          )}
          fullWidth
        />
        {/* <Stack direction="row" spacing={2}>
          {tags.map((tag: string) => (
            <Button
              onClick={() =>
                tag === "All"
                  ? setThreadList(fullThreadList)
                  : setThreadList(fullThreadList.filter((x) => x.tag === tag))
              }
            >
              <Chip
                label={tag}
                color={tag.length % 2 === 0 ? "primary" : "secondary"} //temp color hash
                clickable
                variant="filled"
              />
            </Button>
          ))}
        </Stack> */}
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
          thread={{
            title: "",
            tag: "",
            content: "",
            author: currentUser,
            image: null,
          }}
          create={true}
        />
      </Stack>
    </Box>
  );
}
