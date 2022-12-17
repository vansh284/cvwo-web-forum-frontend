import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CommentList } from "../comments/CommentsList";
import {
  getThreadList,
  selectThreadByID,
  Thread,
  threadsErrorNoted,
} from "./threadSlice";
import Paper from "@mui/material/Paper";
import { Box, Stack } from "@mui/system";
import Avatar from "@mui/material/Avatar/Avatar";
import { Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";
import { getUser } from "../user/userSlice";
import { RootState } from "../../app/store";

export function ThreadPage() {
  const { id } = useParams();
  const ID: Number = Number(id);
  const thread: Thread = useAppSelector(selectThreadByID(ID));
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); //change to useAppNavigate?
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
  //Get the threads
  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(getThreadList());
    }
  }, [threadsStatus, threadsError]);

  // Autodirect users not logged in to the home page
  useEffect(() => {
    if (threadsError !== null) {
      navigate("/threads", { replace: true });
      dispatch(threadsErrorNoted());
    }
  });

  return (
    <article className="thread">
      <ThreadView thread={thread} />
      <CommentList key={ID.toString()} ID={ID} />
    </article>
  );
}

function ThreadView({ thread }: { thread: Thread }) {
  return (
    <Paper
      variant="outlined"
      sx={{ margin: "100px 100px 0px 100px", padding: "50px" }}
    >
      <Grid spacing={2} container>
        <Grid item sx={{ marginTop: "20px" }}>
          <Avatar sx={{ bgcolor: "blueviolet" }}>
            {thread.author.substring(0, 1).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid item>
          <h2>{thread.title}</h2>
          <p>{thread.CreatedAt}</p>
        </Grid>
        <Grid item sx={{ marginTop: "24px" }}>
          <Chip label={thread.tag} variant="outlined" color="primary" />
          <p>{thread.author}</p>
        </Grid>
      </Grid>
      <Divider />
      {thread.image ? (
        <Box sx={{ height: "300px", width: "500px" }}>
          <img src={thread.image} alt="thread" height="100%" width="100%" />
        </Box>
      ) : undefined}
      <p>{thread.content}</p>
    </Paper>
  );
}
