import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUsername } from "../user/userSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteThread, Thread } from "./threadSlice";
import { Box } from "@mui/system";
import { useState } from "react";
import { ThreadAdd } from "./ThreadAdd";
import { useNavigate } from "react-router-dom";
import { commentsStatusNoted } from "../comments/commentSlice";
import { timeToTimeAgo } from "../../app/time";

export function ThreadExcerpt({
  thread,
}: {
  thread: Thread;
  threadAddOpen?: boolean;
  setThreadAddOpen?: Function;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen]: [boolean, Function] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen]: [boolean, Function] =
    useState(false);

  const currentUser: string = useAppSelector(selectUsername);
  return (
    <Card key={thread.ID?.toString()} variant="outlined" >
      <CardActionArea
        onClick={() => {
          dispatch(commentsStatusNoted());
          navigate("/thread/" + thread.ID);
        }}
      >
        <Stack direction="row">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "blueviolet" }}>
                {thread.author.substring(0, 1).toUpperCase()}
              </Avatar> //randomise color or base on username characters
            }
            title={thread.title}
            subheader={
              thread.CreatedAt ? timeToTimeAgo(thread.CreatedAt) : null
            }
          />
          <Chip
            label={thread.tag}
            variant="outlined"
            color="primary"
            sx={{ margin: "20px" }}
          />
        </Stack>
        {thread.image && (
          <Box sx={{ height: "300px", width: "400px", marginLeft: "16px" }}>
            <CardMedia
              component="img"
              height="100%"
              width="100%"
              image={thread.image}
              alt={thread.title}
            />
          </Box>
        )}
        <CardContent className="CardContent">{thread.content}</CardContent>
      </CardActionArea>
      {currentUser === thread.author && (
        <CardActions disableSpacing>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setEditDialogOpen(true);
              }}
              sx={{ marginLeft: "auto" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
      <ThreadAdd
        dialogOpen={editDialogOpen}
        setDialogOpen={setEditDialogOpen}
        thread={thread}
        create={false}
      />
      <Dialog open={deleteDialogOpen}>
        <DialogTitle className="DialogTitle">Delete this Thread?</DialogTitle>
        <DialogContent className="DialogContent">
          This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ED4337" }}
            onClick={() => dispatch(deleteThread(thread))}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
