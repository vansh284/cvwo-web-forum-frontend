import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
  Chip,
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
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/system/Stack/Stack";
import { Box } from "@mui/system";
import { ThreadExcerpt } from "./ThreadExcerpt";
import { ThreadAdd } from "./ThreadAdd";
import { getUser, logout, selectUsername } from "../user/userSlice";
import logo from "../../assets/logo.svg";
import stc from "string-to-color";

export default function ThreadsList() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [threadAddDialogOpen, setThreadAddDialogOpen]: [boolean, Function] =
    useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen]: [boolean, Function] =
    useState(false);
  const [tags, setTags]: [string[], Function] = useState([]); // Keep track of tags to filter by
  const [recent, setRecent]: [string, Function] = useState("most recent"); // Keep track of how to sort threads
  const [threadList, setThreadList]: [Thread[], Function] = useState([]); // The threads to currently display to user
  const fullThreadList = useAppSelector(selectThreadList); // The entire list of threads
  const threadsStatus: string = useAppSelector(
    (state) => state.thread.statusGet
  );
  const threadsError: string | null = useAppSelector(
    (state) => state.thread.error
  );
  const currentUser: string = useAppSelector(selectUsername);
  const statusLog: string = useAppSelector((state) => state.user.statusLog);

  // Log user in
  useEffect(() => {
    if (statusLog === "logged out") {
      dispatch(getUser());
    }
  }, [statusLog, dispatch]);

  // Autodirect users not logged in to the home page
  useEffect(() => {
    if (statusLog === "logged out") {
      navigate("/", { replace: true });
      dispatch(threadsErrorNoted());
    }
  }, [statusLog, dispatch, navigate]);

  // Gets the full thread list
  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(getThreadList());
    }
    setThreadList(fullThreadList);
  }, [threadsStatus, threadsError, fullThreadList, dispatch]);

  // Sorts threadlist by most recent initially
  useEffect(() => {
    if (threadsStatus === "success") {
      dispatch(sortThreadsByMostRecent());
    }
  }, [threadsStatus, dispatch]);

  // Modifies threadlist everytime tags is updated
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
        margin: "100px auto",
        padding: "50px",
        width: "0.5",
        minWidth:"300px"
      }}
      variant="elevation"
      square
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
        <img height="130px" width="150px" src={logo} alt="logo" style={{marginRight:"50px"}}/>
        <Button style={{height:"50px"}} variant="outlined" onClick={() => setLogoutDialogOpen(true)}>
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
        <h1>CVWO Web Forum</h1>
        <h2 style={{fontSize:"44px"}}>Threads</h2>
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
          value={tags}
          onChange={(_, tags: string[]) => setTags(tags)}
          disablePortal
          renderTags={(value: string[]) =>
            value.map((option: string) => (
              <Chip
                key={option}
                label={option}
                sx={{ backgroundColor: stc(option) }}
                deleteIcon={<CloseIcon />}
                onDelete={() => setTags(tags.filter((tag) => tag !== option))}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for Thread by Tag"
              placeholder="Tag"
            />
          )}
          fullWidth
        />
        <ToggleButtonGroup
          value={recent}
          color="primary"
          exclusive
          onChange={(_, recent: string) =>
            recent !== null ? setRecent(recent) : null
          }
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
            <ThreadExcerpt key={thread.ID?.toString()} thread={thread} />
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
