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
import { CardContent, CardHeader, CardMedia, Chip } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";
import { getUser } from "../user/userSlice";
import { RootState } from "../../app/store";
import { timeToTimeAgo } from "../../app/time";
import stc from "string-to-color";

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
  }, [dispatch]);
  
  //Get the threads
  useEffect(() => {
    if (threadsStatus === "idle") {
      dispatch(getThreadList());
    }
  }, [threadsStatus, threadsError, dispatch]);

  // Autodirect users not logged in to the home page
  useEffect(() => {
    if (threadsError !== null) {
      navigate("/threads", { replace: true });
      dispatch(threadsErrorNoted());
    }
  });

  return (
    <Paper
      variant="elevation"
      elevation={10}
      sx={{ margin: "100px 300px 100px 300px", padding: "20px 50px 20px 50px" }}
      className="Paper"
    >
      <ThreadView thread={thread} />
      <Divider sx={{ borderBottomWidth: 1.5, borderColor: "black" }} />
      <CommentList key={ID.toString()} ID={ID} />
    </Paper>
  );
}

function ThreadView({ thread }: { thread: Thread }) {
  return (
    <>
      <Stack direction="row">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: stc(thread.author) }}>
              {thread.author.substring(0, 1).toUpperCase()}
            </Avatar>
          }
          titleTypographyProps={{
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            marginTop: "10px",
          }}
          title={thread.author}
          subheader={thread.CreatedAt ? timeToTimeAgo(thread.CreatedAt) : null}
        />
        <Chip
          label={thread.tag}
          variant="outlined"
          sx={{
            marginLeft: "20px",
            marginTop: "30px",
            backgroundColor: stc(thread.tag),
          }}
        />
      </Stack>
      <Divider />
      <CardHeader
        titleTypographyProps={{
          fontSize: "50px",
          fontWeight: "400",
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
        }}
        title={thread.title}
      />
      <CardContent className="CardContent">{thread.content}</CardContent>
      {thread.image ? (
        <Box
          sx={{
            height: "300px",
            width: "500px",
            marginBottom: "30px",
            marginLeft: "17px",
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            width="100%"
            image={thread.image}
            alt={thread.title}
          />
        </Box>
      ) : undefined}
    </>
  );
}
