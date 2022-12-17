import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Comment, deleteComment } from "./commentSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { CommentAdd } from "./CommentAdd";
import { selectUsername } from "../user/userSlice";
import { Box } from "@mui/system";

export function CommentC({ comment }: { comment: Comment }) {
  const currentUser: string = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <Grid container spacing={2} wrap="nowrap" key={comment.ID?.toString()}>
        <Grid item sx={{ marginTop: "10px" }}>
          <Avatar sx={{ bgcolor: "blueviolet" }}>
            {comment.author.substring(0, 1).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid item xs={10}>
          <h4>{comment.author}</h4>
          <p>{comment.content}</p>
          <p>{comment.CreatedAt}</p>
        </Grid>
        {comment.author === currentUser && (
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <Grid item>
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
            </Grid>
          </Box>
        )}
      </Grid>
      <Divider />
      <CommentAdd
        dialogOpen={editDialogOpen}
        setDialogOpen={setEditDialogOpen}
        comment={comment}
        create={false}
      />
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Delete this Comment?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button variant="contained" sx={{ bgcolor: "#ED4337" }} onClick={() => dispatch(deleteComment(comment))}>Yes</Button>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
