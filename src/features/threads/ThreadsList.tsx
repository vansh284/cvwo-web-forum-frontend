import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import {
  getThreadList,
  selectThreadList,
  sortThreadsByLeastRecent,
  sortThreadsByMostRecent,
  Thread,
  threadsErrorNoted,
} from "./threadSlice";

import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/system/Stack/Stack";
import { Box } from "@mui/system";
import { ThreadExcerpt } from "./ThreadExcerpt";
import { ThreadAdd } from "./ThreadAdd";
import { getUser, logout, selectUsername } from "../user/userSlice";

export default function ThreadsList() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [threadAddDialogOpen, setThreadAddDialogOpen]: [boolean, Function] =
    useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen]: [boolean, Function] =
    useState(false);
  const [threadList, setThreadList]: [Thread[], Function] = useState([]);
  const [tags, setTags]: [string[], Function] = useState([]);
  const [recent, setRecent]: [string, Function] = useState("most recent");
  const fullThreadList = useAppSelector(selectThreadList);
  const threadsStatus: string = useAppSelector(
    (state: RootState) => state.thread.statusGet
  );
  const threadsError: string | null = useAppSelector(
    (state: RootState) => state.thread.error
  );
  const currentUser = useAppSelector(selectUsername);

  //Log user in
  useEffect(() => {
    dispatch(getUser());
  });

  //Autodirect users not logged in to the home page
  useEffect(() => {
    if (currentUser === "") {
      navigate("/", { replace: true });
      dispatch(threadsErrorNoted());
    }
  });

  //Gets the full thread list
  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(getThreadList());
    }
    setThreadList(fullThreadList);
  }, [threadsStatus, threadsError, fullThreadList]);

  //Modifies threadlist everytime tags is updated
  useEffect(() => {
    tags.length > 0
      ? setThreadList(
          fullThreadList.filter((thread) =>
            tags.reduce((curr, tag) => curr || tag === thread.tag, false)
          )
        )
      : setThreadList(fullThreadList);
  }, [tags, fullThreadList]);

  return (
    <Paper
      sx={{
        margin: "100px 300px",
        padding: "50px",
      }}
      variant="elevation"
      elevation={10}
      className="Paper"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
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
        <Button variant="outlined" onClick={() => setLogoutDialogOpen(true)}>
          Logout
        </Button>
        <Dialog open={logoutDialogOpen}>
          <DialogContent className="DialogContent">
            Are you sure you want to Logout?
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ bgcolor: "#ED4337" }}
              onClick={() => {
                dispatch(logout());
                setLogoutDialogOpen(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Stack spacing={2}>
        <h1>Threads</h1>
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
          onChange={(_, tags: string[]) => setTags(tags)}
          disablePortal
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag"
              placeholder="Search for Thread by Tag"
            />
          )}
          fullWidth
        />
        <ToggleButtonGroup
          value={recent}
          color="primary"
          exclusive
          onChange={(_, recent: string) => setRecent(recent)}
        >
          <ToggleButton
            value={"most recent"}
            onClick={() => {
              dispatch(sortThreadsByMostRecent());
            }}
          >
            Sort by Most Recent
          </ToggleButton>
          <ToggleButton
            value={"least recent"}
            onClick={() => {
              dispatch(sortThreadsByLeastRecent());
            }}
          >
            Sort by Least Recent
          </ToggleButton>
        </ToggleButtonGroup>
        {threadsStatus === "pending" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "150px 0",
            }}
          >
            <CircularProgress size={150} />
          </Box>
        ) : (
          threadList.map((thread: Thread) => (
            <ThreadExcerpt
              key={thread.ID?.toString()}
              thread={{ ...thread, content: thread.content.substring(0, 100) }}
            />
          ))
        )}
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
    </Paper>
  );
}
